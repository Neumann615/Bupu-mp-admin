// FormDesigner 将在后续任务补充导出
export { getComponent, getMenus, registerComponent } from './registry/registry'
export type { ComponentDef, ConfigMeta, MenuGroup } from './registry/registry'
export { FormRenderer } from './renderer/FormRenderer'
export type { FormRendererProps } from './renderer/FormRenderer'
export type { FieldSchema, FormGlobalConfig, FormSchema, ValidateRule } from './types/schema'
export { createEmptySchema } from './types/schema'
