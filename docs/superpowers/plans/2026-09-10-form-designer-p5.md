# FormDesigner P5 实现计划（高级组件 + 子表单）+ P1–P4 遗留补齐

日期：2026-09-10
上游规格：`docs/superpowers/specs/2026-09-07-form-designer-design.md` §6 / §8（P5）
前置计划：`docs/superpowers/plans/2026-09-07-form-designer.md`（T1–T12 = P1–P4，已全部完成）

## 现状盘点（编写本计划时）

- 注册组件 31 个：基础输入 17（basicInput 4 + selectFamily 3 + dateTime 3 + choice 7）、辅助 5、布局 9（Row/Col 分开注册）。
- 测试 83 项：utils（schemaTree/path/uniqueId）、store、registry、toAntdRules，以及本轮新增的渲染器冒烟测试（31 个组件 defaultSchema 渲染 + 容器嵌套 + 未注册类型降级）。
- 后端 `za_form`（id/name/description/schema/status/version/create_time/update_time）+ 5 个路由（list/detail/create/update/delete），前端三个演示页闭环可用。

### P1–P4 遗留项处置

| 规格条目 | 状态 | 落地位置 |
|---|---|---|
| §9 删除含子字段的容器需二次确认 | 本轮补齐 | `designer/useRemoveField.ts`，CanvasItem 删除按钮与 Delete 快捷键共用 |
| §9 保存失败保留本地 schema 并提示 | 本轮补齐 | `src/pages/index/form/design.tsx` handleSave 兜住 rejection（提示由 http 拦截器统一弹出） |
| §10 渲染器冒烟测试 | 本轮补齐 | `renderer/FormRenderer.smoke.test.tsx`（新增 devDeps：jsdom、@testing-library/react） |
| §7 表单发布状态流转 | 本轮补齐 | `src/pages/index/form/list.tsx` 发布/下线操作（复用 `updateFormAPI` 的 status） |
| §7 `GET /form/:id/schema`（只取发布版） | 暂不做 | 无消费方：渲染演示页需要能看草稿；待有对外填写场景再加 |

## 全局约定（沿用前置计划）

- 组件一律通过 `registerComponent(def)` 声明式注册，画布走 `canvasRender ?? render`，运行时走 `render`。
- 配置面板只吃 `configForm: ConfigMeta[]`，控件类型限 input/textarea/number/switch/select/options/json。
- 纯逻辑与渲染冒烟走 Vitest（渲染类测试文件首行加 `// @vitest-environment jsdom`）。
- 每步验证：`node ./node_modules/eslint/bin/eslint.js <改动路径>` + `node ./node_modules/vitest/vitest.mjs run`。
- 运行时依赖零新增（图标选择器复用 `@zealous-admin/components` 的 `ZaIconPicker`，上传用 antd `Upload`）。

## 任务 1：渲染器名路径（嵌套对象 + 数组行）

**问题**：现有 `renderField` 直接用 `schema.field` 作为 `Form.Item` 的 name，无法表达 `{ 子表单: { 字段: v } }` 与 `[{ 字段: v }]`。

- [x] **步骤 1：新增 `renderer/namePrefix.ts`** —— `NamePrefixContext`（值类型 `(string | number)[]`）+ `useNamePrefix()`，供嵌套容器与数组行逐级累加名路径。
- [x] **步骤 2：抽出 `renderer/FieldItem.tsx`** —— 把 `renderField` 里的 `Form.Item` 分支搬进组件（函数内不能读 context），name 由 `[...prefix, schema.field]` 计算；沿用既有 `parentType` 特化（descriptions 去重 label，新增 tableForm 单元格不显示 label）。
- [x] **步骤 3：`renderField` 接入容器分支** —— 容器改为 `ContainerField` 组件：`nestObject` 容器把子节点包在 `[...prefix, field]` 前缀下；`nestList` 容器交给 `ListField`。
- [x] **步骤 4：新增 `renderer/ListField.tsx`** —— `Form.List name={[...prefix, field]}`，向组件的 `renderList` 提供 `{ rows, renderRow, renderCell, add, remove }`；行内前缀为 `[rowName]`（rc-field-form 的 List 自带 prefixName，故行内 name 相对列表）。
- [x] **步骤 5：单测** —— `renderer/namePrefix.test.ts`（纯逻辑：前缀拼接）与冒烟测试中的嵌套数据结构断言（提交值形如 `{ 对象: { a } }`、`{ 数组: [{ a }] }`）。

## 任务 2：注册表与配置面板扩展

- [x] **步骤 1：`registry/registry.ts`** —— `MenuGroup` 增加 `advanced`（高级组件）与 `subform`（子表单）；`ComponentDef` 增加 `nestObject?: boolean`、`nestList?: boolean`、`renderList?: (schema, ctx) => ReactNode`，并导出 `ListRenderCtx` 类型。
- [x] **步骤 2：`designer/RightPanel.tsx`** —— 值绑定容器（nestObject/nestList）也显示“字段名”配置；校验规则仍只对非容器开放（容器不挂 Form.Item）。
- [x] **步骤 3：`registry/components/helpers.ts`** —— 新增 `groupSchema(type, label, props, children)`：带 `field` 的容器默认 schema。
- [x] **步骤 4：验证** —— LeftPanel 分组由 `getMenus()` 动态生成，新增分组无需改面板代码；跑 registry 单测确认分组数量。

## 任务 3：高级组件 3 个（`registry/components/advanced.tsx`）

- [x] **upload 上传**：antd `Upload`，`beforeUpload` 返回 false（前端收集，不落后端），`formItemProps` 设 `valuePropName: fileList` + `getValueFromEvent` 归一化；配置项先给 按钮文案/listType/multiple/maxCount/accept，上传地址与鉴权后续按需扩展。
- [x] **money 金额输入**：`InputNumber` + `prefix` 与千分位 formatter/parser、`precision: 2`；配置项给 币种符号/精度/最小最大值。
- [x] **icon 图标选择器**：包 `ZaIconPicker`（value/onChange 受控，Form.Item 直接注入），配置项给 placeholder/clearable/图标库范围。
- [x] **验证**：冒烟测试自动覆盖三个新组件；手动在画布拖入并检查提交值。

## 任务 4：子表单 3 个（`registry/components/subForm.tsx`）

- [x] **subForm 嵌套对象**：`isContainer + nestObject`，运行时渲染 Card 外壳（标题取 `label`）+ 子字段（名路径嵌套）；画布同壳层，内部可继续拖入字段。
- [x] **tableForm 表格子表单**：`isContainer + nestList`，`renderList` 用 antd `Table` 呈现——列由 `schema.children` 生成（title 取子字段 label），单元格用 `renderCell(rowName, child)`；底部“添加一行”，行尾删除；画布用 `canvasRender` 渲染设计态壳层（表头 + 一行模板 + 落点），不渲染 Form.List。
- [x] **stepForm 分步表单**：视觉容器，`Steps` 头 + 子字段内容区，数据结构扁平（与现有 tabs/collapse 的单页签简化保持一致）；多步骤拆分留作后续配置增强。
- [x] **验证**：冒烟测试覆盖；新增断言——tableForm 提交结构为数组、subForm 为嵌套对象（规格 §8 P5 验收标准）。

## 任务 5：文档与工程一致性

- [x] **步骤 1：文档站新增 form-designer 章节**（`docs/form-designer/`：架构与 schema、组件清单、设计器交互、渲染器用法、后端接口），并挂到 VitePress 侧边栏。
- [x] **步骤 2：纠正 `CLAUDE.md` 后端描述** —— 实际为 Express 5 + better-sqlite3（非 Hono + Drizzle + mysql2），默认端口 3508。
- [x] **步骤 3：`CHANGELOG.md`** 按日期补记本轮全部改动。

## 已知限制（本期不解决，记录备查）

- tabs/collapse/stepForm 均为单页签/单面板/单步骤简化版，多页签需要 children 分组语义（schema 扩展）。
- descriptions 在画布态无法把子节点拆分到各 item（前置计划已记录）。
- upload 仅前端收集（base64/FileList），service 端尚无上传路由与静态目录。
- tableForm 的列宽/对齐/行内校验、数组级 min/max 规则未接入（Form.List rules 待补）。

## 验收标准（规格 §8 P5）

- 左侧面板出现“高级组件”“子表单”两个分组，共 6 个新组件可拖入画布。
- 子表单（嵌套对象）提交得到 `{ 字段名: { 子字段: 值 } }`；表格子表单提交得到 `{ 字段名: [{ 子字段: 值 }] }`，可增删行。
- 上传/金额/图标选择器在画布与预览中均可交互，提交值分别为 fileList、number、图标字符串。
- `pnpm lint` 无新增错误，`vitest run` 全绿。
