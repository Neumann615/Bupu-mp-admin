import type { ReactNode } from 'react'
import type { ComponentDef, ListRenderCtx } from '../registry/registry'
import type { FieldSchema } from '../types/schema'
import { Alert, Form } from 'antd'
import { NamePrefixContext, useNamePrefix } from './namePrefix'

/**
 * 数组容器（nestList）：Form.List 驱动行的增删。
 * 行内子字段的名路径相对列表——rc-field-form 的 List 已注入 prefixName，故行前缀只需 [rowName]。
 */
export function ListField({ def, schema, renderChild }: {
  def: ComponentDef
  schema: FieldSchema
  renderChild: (child: FieldSchema, parentType?: string) => ReactNode
}) {
  const prefix = useNamePrefix()
  const children = schema.children ?? []

  if (!schema.field)
    return <Alert type="warning" showIcon message={`数组容器缺少字段名：${schema.type}`} />

  const renderRow = (rowName: number): ReactNode => (
    <NamePrefixContext value={[rowName]}>
      {children.map(c => renderChild(c, schema.type))}
    </NamePrefixContext>
  )

  return (
    <Form.List name={[...prefix, schema.field]}>
      {(fields, { add, remove }) => {
        const ctx: ListRenderCtx = {
          rows: fields.map(f => ({ key: f.key, name: f.name })),
          renderRow,
          renderCell: (rowName, child) => (
            <NamePrefixContext value={[rowName]}>
              {renderChild(child, schema.type)}
            </NamePrefixContext>
          ),
          // 包一层避免 onClick 的事件对象被当成 add 的 defaultValue
          add: () => add(),
          remove: rowName => remove(rowName),
        }
        return def.renderList?.(schema, ctx) ?? null
      }}
    </Form.List>
  )
}
