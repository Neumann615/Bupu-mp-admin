import type { ComponentDef } from '../registry/registry'
import type { FieldSchema } from '../types/schema'

/**
 * Form.Item 向直接子组件注入受控 props（value/onChange，
 * 或 valuePropName 指定的如 checked），这里通过转发组件将全部
 * 注入 props 并入 schema.props 交给 def.render，无需改 render 签名。
 * Transfer 等 onChange 签名特殊的组件在各自 def.render 内自行处理。
 */
export function FieldControl({ def, schema, ...injected }: {
  def: ComponentDef
  schema: FieldSchema
  [key: string]: any
}) {
  return <>{def.render({ ...schema, props: { ...schema.props, ...injected } })}</>
}
