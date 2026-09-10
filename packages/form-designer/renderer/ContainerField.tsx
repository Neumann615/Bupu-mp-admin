import type { ReactNode } from 'react'
import type { ComponentDef } from '../registry/registry'
import type { FieldSchema } from '../types/schema'
import { use } from 'react'
import { NamePrefixContext } from './namePrefix'

/**
 * 容器分支单独成组件：名路径前缀来自 context，普通函数体内读不到。
 * nestObject 容器把子字段收进自己的 field 下（提交结构 { field: { 子字段… } }）。
 */
export function ContainerField({ def, schema, renderChild }: {
  def: ComponentDef
  schema: FieldSchema
  renderChild: (child: FieldSchema, parentType?: string) => ReactNode
}) {
  const prefix = use(NamePrefixContext)
  const children = (schema.children ?? []).map(c => renderChild(c, schema.type))
  const body = def.render(schema, children)
  if (!def.nestObject || !schema.field)
    return <>{body}</>
  return <NamePrefixContext value={[...prefix, schema.field]}>{body}</NamePrefixContext>
}
