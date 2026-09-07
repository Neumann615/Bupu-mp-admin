import type { ReactNode } from 'react'
import type { FieldSchema } from '../types/schema'
import { Alert, Form } from 'antd'
import { getComponent } from '../registry/registry'
import { FieldControl } from './FieldControl'
import { toAntdRules } from './toAntdRules'
import '../registry/components'

/**
 * 渲染单个字段。容器类通过 renderChild 递归子节点，
 * 设计器画布与运行时共用此入口。
 * parentType 为直接父容器的 type，用于父级特化（如 descriptions 的 label 去重）。
 */
export function renderField(
  schema: FieldSchema,
  renderChild: (child: FieldSchema, parentType?: string) => ReactNode,
  parentType?: string,
): ReactNode {
  const def = getComponent(schema.type)
  if (!def)
    return <Alert type="warning" showIcon message={`未注册的组件类型：${schema.type}`} />

  if (def.isContainer)
    return def.render(schema, (schema.children ?? []).map(c => renderChild(c, schema.type)))

  if (def.noFormItem)
    return def.render(schema)

  return (
    <Form.Item
      name={schema.field}
      // descriptions 的 item label 已显示字段名，Form.Item 不再重复
      label={parentType === 'descriptions' ? undefined : schema.label}
      rules={toAntdRules(schema)}
      tooltip={schema.formItem?.tooltip}
      extra={schema.formItem?.extra}
      hidden={schema.formItem?.hidden}
      {...def.formItemProps}
    >
      <FieldControl def={def} schema={schema} />
    </Form.Item>
  )
}
