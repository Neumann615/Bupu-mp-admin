import type { CSSProperties, ReactNode } from 'react'
import type { FieldSchema } from '../types/schema'

export type MenuGroup = 'main' | 'aide' | 'layout'

/** 右侧属性面板单项配置 */
export interface ConfigMeta {
  /** 写入路径，如 'label'、'props.placeholder'、'formItem.tooltip' */
  field: string
  label: string
  type: 'input' | 'textarea' | 'number' | 'switch' | 'select' | 'options' | 'json'
  /** type 为 select 时的选项 */
  options?: { label: string, value: any }[]
  /** 透传给配置控件的额外 props */
  props?: Record<string, any>
}

export interface ComponentDef {
  type: string
  title: string
  menu: MenuGroup
  /** 左侧面板图标（antd 图标节点） */
  icon: ReactNode
  /** 容器类：通过 children 嵌套 */
  isContainer?: boolean
  /** 辅助类：无 field、不进 Form.Item 绑定 */
  noFormItem?: boolean
  /** Form.Item 额外属性，如开关的 valuePropName: 'checked' */
  formItemProps?: Record<string, any>
  defaultSchema: () => FieldSchema
  /** children 为已渲染好的子节点（容器类使用） */
  render: (schema: FieldSchema, children?: ReactNode) => ReactNode
  /** 画布模式：CanvasItem 外壳需要镜像的布局样式（如 col 的 span 转 flex 尺寸） */
  canvasShellStyle?: (schema: FieldSchema) => CSSProperties
  /** 画布模式：替代 render 的渲染（如 col 在画布内渲染 span:24 占满外壳） */
  canvasRender?: (schema: FieldSchema, children?: ReactNode) => ReactNode
  configForm: ConfigMeta[]
}

const registry = new Map<string, ComponentDef>()

export function registerComponent(def: ComponentDef): void {
  registry.set(def.type, def)
}

export function getComponent(type: string): ComponentDef | undefined {
  return registry.get(type)
}

const GROUP_TITLES: Record<MenuGroup, string> = {
  main: '基础组件',
  aide: '辅助组件',
  layout: '布局组件',
}

export function getMenus(): { name: MenuGroup, title: string, list: ComponentDef[] }[] {
  const all = [...registry.values()]
  return (Object.keys(GROUP_TITLES) as MenuGroup[])
    .map(name => ({ name, title: GROUP_TITLES[name], list: all.filter(d => d.menu === name) }))
    .filter(g => g.list.length > 0)
}
