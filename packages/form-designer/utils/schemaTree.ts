import type { FieldSchema, FormSchema } from '../types/schema'

export interface LocatedNode {
  node: FieldSchema
  parentChildren: FieldSchema[]
  index: number
}

/** 在字段树中按 id 查找节点（深度优先） */
export function findNode(children: FieldSchema[], id: string): LocatedNode | null {
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (node.id === id)
      return { node, parentChildren: children, index: i }
    if (node.children) {
      const found = findNode(node.children, id)
      if (found)
        return found
    }
  }
  return null
}

/**
 * 取指定父节点的 children 数组。
 * parentId 为 null 时表示根；目标节点没有 children 时初始化为空数组。
 */
export function childrenOf(schema: FormSchema, parentId: string | null): FieldSchema[] | null {
  if (parentId === null)
    return schema.children
  const located = findNode(schema.children, parentId)
  if (!located)
    return null
  if (!located.node.children)
    located.node.children = []
  return located.node.children
}

/** 从树中摘除节点，返回被摘除的节点 */
export function removeNode(schema: FormSchema, id: string): FieldSchema | null {
  const located = findNode(schema.children, id)
  if (!located)
    return null
  located.parentChildren.splice(located.index, 1)
  return located.node
}

/** 深拷贝节点并为整棵子树重新生成 id 与 field（用于复制） */
export function cloneNode(node: FieldSchema, genId: () => string): FieldSchema {
  const copy: FieldSchema = JSON.parse(JSON.stringify(node))
  const walk = (n: FieldSchema) => {
    const newId = genId()
    n.id = newId
    if (n.field)
      n.field = newId
    n.children?.forEach(walk)
  }
  walk(copy)
  return copy
}

/** 判断 maybeDescendantId 是否在 node 的子树内（防止容器拖入自身） */
export function isDescendant(node: FieldSchema, maybeDescendantId: string): boolean {
  if (!node.children)
    return false
  return node.children.some(
    c => c.id === maybeDescendantId || isDescendant(c, maybeDescendantId),
  )
}
