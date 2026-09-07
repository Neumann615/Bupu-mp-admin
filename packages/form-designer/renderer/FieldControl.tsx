import type { ComponentDef } from '../registry/registry'
import type { FieldSchema } from '../types/schema'

/**
 * Form.Item 向直接子组件注入 value/onChange，这里通过转发组件
 * 将其并入 schema.props 交给 def.render，无需改 render 签名。
 * Transfer 等 onChange 签名特殊的组件在各自 def.render 内自行处理。
 */
export function FieldControl({ def, schema, value, onChange }: {
  def: ComponentDef
  schema: FieldSchema
  value?: any
  onChange?: (v: any) => void
}) {
  return <>{def.render({ ...schema, props: { ...schema.props, value, onChange } })}</>
}
