import type { ReactNode } from 'react'
import type { FieldSchema } from '../types/schema'
import { Alert, Form } from 'antd'
import { getComponent } from '../registry/registry'
import { toAntdRules } from './toAntdRules'
import '../registry/components'

/**
 * 渲染单个字段。容器类通过 renderChild 递归子节点，
 * 设计器画布与运行时共用此入口。
 */
export function renderField(
  schema: FieldSchema,
  renderChild: (child: FieldSchema) => ReactNode,
): ReactNode {
  const def = getComponent(schema.type)
  if (!def)
    return <Alert type="warning" showIcon message={`未注册的组件类型：${schema.type}`} />

  if (def.isContainer)
    return def.render(schema, (schema.children ?? []).map(c => renderChild(c)))

  const control = def.render(schema)
  if (def.noFormItem)
    return control

  return (
    <Form.Item
      name={schema.field}
      label={schema.label}
      rules={toAntdRules(schema)}
      tooltip={schema.formItem?.tooltip}
      extra={schema.formItem?.extra}
      hidden={schema.formItem?.hidden}
      {...def.formItemProps}
    >
      {control}
    </Form.Item>
  )
}
