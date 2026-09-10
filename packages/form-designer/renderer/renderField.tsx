import type { ReactNode } from 'react'
import type { FieldSchema } from '../types/schema'
import { Alert } from 'antd'
import { getComponent } from '../registry/registry'
import { ContainerField } from './ContainerField'
import { FieldItem } from './FieldItem'
import { ListField } from './ListField'
import '../registry/components'

/**
 * 渲染单个字段。容器类通过 renderChild 递归子节点，
 * 设计器画布与运行时共用此入口。
 * parentType 为直接父容器的 type，用于父级特化（如 descriptions / tableForm 由父级呈现字段名）。
 */
export function renderField(
  schema: FieldSchema,
  renderChild: (child: FieldSchema, parentType?: string) => ReactNode,
  parentType?: string,
): ReactNode {
  const def = getComponent(schema.type)
  if (!def)
    return <Alert type="warning" showIcon message={`未注册的组件类型：${schema.type}`} />

  if (def.nestList)
    return <ListField def={def} schema={schema} renderChild={renderChild} />

  if (def.isContainer)
    return <ContainerField def={def} schema={schema} renderChild={renderChild} />

  if (def.noFormItem)
    return def.render(schema)

  return <FieldItem def={def} schema={schema} parentType={parentType} />
}
