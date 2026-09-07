# FormDesigner（React + antd 6 自研表单设计器）设计规格

日期：2026-09-07
状态：已获用户批准（头脑风暴三节设计逐节确认）

## 1. 背景与目标

将 `form-manage.web` 项目中 form-designer（FormCreate 商业版，Vue 3 + Element Plus，312 文件约 6.4 万行）的能力，以 React + antd 6 自研重写，集成到 zealous-admin 模板，作为 `packages/form-designer` 包。

**关键决策（用户已确认）：**

| 决策点 | 结论 |
|---|---|
| Schema 格式 | 自研 schema，不兼容 form-create rule JSON，不管旧数据 |
| 组件范围 | 精简全量（基础 + 布局 + 子表单，约 36 个；富文本/图表/签名/二维码等重组件暂不接入） |
| 双端 | 只做 PC 端，不做移动端 |
| 集成形态 | 包 + 演示页 + 后端存取（完整闭环） |
| 架构 | 方案 A：声明式组件注册表 + 单一真实渲染（画布/预览/运行时共用） |

**License 约束**：原包为 FormCreate 商业版（"未经授权不得使用、修改或移除版权信息"）。本实现**全部代码自研**，仅参考其交互模式与组件清单，不复制任何源码。

**非目标（YAGNI）**：

- 移动端设计与渲染
- 富文本（wangEditor）、图表（echarts）、签名板、二维码、HTML 嵌入、JSON 编辑器（后续按需增量接入）
- 事件 JS 表达式配置、JS 函数编辑器（二期评估）
- AI 生成表单（原项目 ai/ 目录能力）
- 原项目业务组件（组织选择器、干系人选择器、天地图等）

## 2. 包结构

```
packages/form-designer/
  index.ts                        # 导出 FormDesigner、FormRenderer、registerComponent、类型
  types/schema.ts                 # Schema 类型定义
  registry/
    registry.ts                   # registerComponent / getComponent / getMenus
    components/                   # 每个组件一个定义文件
      input.ts / select.ts / ...  # defaultSchema + render + configForm
      _containers/ row.ts col.ts card.ts tabs.ts ...
  designer/
    FormDesigner.tsx              # 三栏布局 + 顶部工具栏
    LeftPanel.tsx                 # 组件面板（分组 + 搜索 + 拖拽源）
    Canvas/
      Canvas.tsx                  # 画布（@dnd-kit 放置区）
      CanvasItem.tsx              # 单项包装：选中/悬停/拖拽/复制/删除/嵌套
    RightPanel.tsx                # 属性 / 表单全局配置 Tab
    ConfigFormRenderer.tsx        # meta 配置 → antd Form 渲染器
    Toolbar.tsx                   # 撤销/重做/预览/导入/导出/清空/保存
    store.ts                      # Zustand：schema 树 + 选中项 + 历史栈
  renderer/
    FormRenderer.tsx              # 运行时渲染（设计器画布 & 预览 & 业务复用同一组件）
    renderItem.tsx                # 单个 schema → Form.Item 递归渲染
  utils/  uniqueId / schemaWalker / json io
```

包通过现有 `@zealous-admin` alias 引入（`packages` 目录已映射）。

## 3. Schema 数据模型（自研）

```ts
interface FormSchema {
  version: 1
  form: FormGlobalConfig      // labelAlign、size、labelCol、disabled 等全局配置
  children: FieldSchema[]     // 表单字段树（容器类通过 children 嵌套）
}

interface FieldSchema {
  id: string                  // 唯一 id（拖拽/选中主键）
  type: string                // 'input' | 'select' | 'row' | ...
  field?: string              // 表单字段名，提交数据的 key（容器/辅助类可为空）
  label?: string
  props: Record<string, any>  // 直接透传给 antd 组件的 props，无中间层转换
  formItem?: {                // Form.Item 层面配置
    rules?: Rule[]
    required?: boolean
    tooltip?: string
    extra?: string
    labelCol?: ColProps
    hidden?: boolean
  }
  children?: FieldSchema[]    // 容器类：row/col/card/tabs/subForm/tableForm
}
```

设计要点：

- `props` 直接对应 antd 组件 props，配置面板改什么 antd 就吃什么。
- 树形结构，`id` 为主键，`field` 只是提交数据 key。
- 嵌套容器（Row > Col > Input）通过 `children` 递归，拖拽时整个子树一起移动。

## 4. 设计器交互与状态管理

**三栏布局**：顶部工具栏（撤销/重做/清空/导入/导出/预览/保存）；左侧组件面板（分组折叠 + 搜索过滤 + 拖拽源）；中间画布（真实 antd 渲染的表单外观）；右侧配置（属性 Tab / 表单全局配置 Tab）。

**Zustand store（`designer/store.ts`）**：

```ts
{
  schema: FormSchema
  selectedId: string | null
  history: { past: FormSchema[], future: FormSchema[] }  // 快照式撤销重做
  addField(type, targetId?, index?)
  moveField(id, targetId, index)
  removeField(id) / duplicateField(id)
  updateProps(id, path, value)      // 每次变更推历史快照
  updateFormConfig(patch)
  undo() / redo() / clear()
  importSchema(json) / exportSchema()
}
```

**拖拽**：使用项目已有依赖 `@dnd-kit/react`。左侧组件项为 drag source（携带 type）；画布及每个容器（Col、Card、Tabs 页签、SubForm）为 drop zone；画布内已有字段也是 drag source，支持排序与跨容器移动。插入位置显示 2px primary 色指示线。

**画布交互拦截**：`CanvasItem` 外层壳 `position: relative`，组件本体上盖透明遮罩（`position: absolute; inset: 0`）吃掉鼠标事件——点击 = 选中，不触发真实输入。悬停显示描边，选中显示 primary 描边 + 浮动操作钮（复制、删除，容器类加拖拽手柄）。

**键盘**：Delete 删除选中项、Ctrl+Z / Ctrl+Shift+Z 撤销重做、Ctrl+D 复制。

**配置面板**：`ConfigFormRenderer` 将每个组件声明的 `configForm` meta 数组映射为 antd Form 项（约 60 行核心），不引入任何表单引擎。校验规则提供"必填 + 类型 + 正则 + 自定义提示"可视化编辑。

## 5. 渲染器（FormRenderer）

对外三个用法，同一组件：

```tsx
// 1. 设计器画布内部复用（带拦截壳）
// 2. 设计器预览弹窗：真实可交互 + 提交回调 formData
<FormRenderer schema={schema} onSubmit={(values) => ...} />
// 3. 业务页运行时渲染
<FormRenderer schema={remoteSchema} initialValues={...} onSubmit={save} />
```

内部为 antd `Form` + 递归 `renderItem`：非容器 → `Form.Item` 包 `registry[type].render(props)`；容器 → 渲染自身壳再递归 children。`form` 全局配置透传给 antd `Form`。

## 6. 组件清单（约 36 个）

| 分组 | 组件 |
|---|---|
| 基础输入 (17) | 输入框、文本域、数字、密码、下拉、单选、多选、开关、日期、日期范围、时间、级联、树选择、评分、滑块、颜色、穿梭框 |
| 高级 (3) | 上传、金额输入、图标选择器（复用 ZaIcon 体系） |
| 布局 (8) | Row/Col、卡片、分割线、折叠面板、标签页、Space、描述列表、Flex |
| 子表单 (3) | SubForm（嵌套对象）、TableForm（antd Table 行内编辑数组）、StepForm |
| 辅助 (5) | 文本、段落、Alert 提示块、按钮、链接 |

后续增量候选（不在本期）：富文本、图表、签名板、二维码、HTML、JSON 编辑器。

## 7. 后端存取（service 端）

```ts
// Drizzle schema 新增 form 表
form: id, name, category, description, schema(text, JSON 字符串),
      status(草稿/发布), version, createTime, updateTime

// 路由 service/src/routes/form.ts
GET    /form/list         分页 + 搜索
GET    /form/:id
POST   /form/create
PUT    /form/:id          存 schema + version+1
DELETE /form/:id
GET    /form/:id/schema   运行时取发布版
```

注意：数据库写入日期直接传 `new Date()`，禁止 `toISOString()`（项目 CLAUDE.md 约束）。

**演示页（src/pages）**：

- `/form/list`：表单管理列表（antd Table + 新建/编辑/删除/复制）
- `/form/design/:id?`：设计器页（保存调后端）
- `/form/render/:id`：渲染测试页（取发布 schema 真实提交）

## 8. 分期计划

| 阶段 | 内容 | 验收标准 |
|---|---|---|
| P1 骨架 | 包搭建、注册表、schema 类型、store、三栏布局、拖拽、选中/删除/复制 | 拖 3 个 input 进画布能排序、删除、撤销 |
| P2 基础组件 | 17 个基础输入组件 + 配置面板 + 预览/导入/导出 | 设计一个完整表单，预览提交拿到正确 values |
| P3 布局+辅助+嵌套 | 8 个布局组件 + 5 个辅助组件、容器嵌套拖拽 | 卡片套 Row 套 Col 套输入框正常工作 |
| P4 后端闭环 | form 表 + CRUD + 三个演示页 | 列表→设计→保存→渲染测试全链路通 |
| P5 子表单+高级 | SubForm/TableForm/StepForm + 上传/金额输入/图标选择器 | 子表单提交嵌套数据结构正确 |

P1–P4 构成完整可用闭环；P5 逐组件增量添加，互不影响。

## 9. 错误处理

- 导入 JSON 非法：message.error 提示，不覆盖当前 schema。
- schema 中出现未注册的 type：渲染时降级为警告占位块，不崩溃。
- 保存接口失败：保留本地 schema，message.error 提示重试。
- 删除含子字段的容器：二次确认（Modal.confirm，走 useAppMessage 体系）。

## 10. 测试

- `utils/`（schemaWalker、uniqueId、json io）与 `store.ts` 的纯逻辑用 Vitest 单测：增删移动字段、撤销重做、导入导出往返一致。
- 渲染器冒烟测试：每个注册组件用 defaultSchema 渲染不抛错。
- 手动验收走第 8 节分期验收标准（项目无 E2E 设施，不新增）。

## 11. 依赖新增

- 前端：**零新增**。拖拽复用已有 `@dnd-kit/react`，状态复用 zustand，不引入表单引擎/低代码框架。（富文本/echarts/qrcode/signature_pad 等依赖随对应组件后续增量接入时再添加。）
- 后端：无新依赖（沿用 Hono + Drizzle + mysql2 现有体系）。
