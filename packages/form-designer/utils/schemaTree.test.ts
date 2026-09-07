import type { FormSchema } from '../types/schema'
import { describe, expect, it } from 'vitest'
import { createEmptySchema } from '../types/schema'
import { childrenOf, cloneNode, findNode, isDescendant, removeNode } from './schemaTree'

function makeTree(): FormSchema {
  const schema = createEmptySchema()
  schema.children = [
    { id: 'a', type: 'input', field: 'fa', label: 'A', props: {} },
    {
      id: 'row',
      type: 'row',
      props: {},
      children: [
        { id: 'b', type: 'input', field: 'fb', label: 'B', props: {} },
        { id: 'c', type: 'input', field: 'fc', label: 'C', props: {} },
      ],
    },
  ]
  return schema
}

describe('findNode', () => {
  it('能找到根层节点并给出父列表与下标', () => {
    const schema = makeTree()
    const located = findNode(schema.children, 'a')
    expect(located?.node.id).toBe('a')
    expect(located?.index).toBe(0)
    expect(located?.parentChildren).toBe(schema.children)
  })

  it('能找到嵌套节点', () => {
    const schema = makeTree()
    const located = findNode(schema.children, 'c')
    expect(located?.node.id).toBe('c')
    expect(located?.index).toBe(1)
    expect(located?.parentChildren.map(n => n.id)).toEqual(['b', 'c'])
  })

  it('找不到时返回 null', () => {
    expect(findNode(makeTree().children, 'zzz')).toBeNull()
  })
})

describe('childrenOf', () => {
  it('parentId 为 null 时返回根 children', () => {
    const schema = makeTree()
    expect(childrenOf(schema, null)).toBe(schema.children)
  })

  it('容器无 children 时初始化为空数组', () => {
    const schema = makeTree()
    schema.children.push({ id: 'card', type: 'card', props: {} })
    const list = childrenOf(schema, 'card')
    expect(list).toEqual([])
  })
})

describe('removeNode', () => {
  it('摘除嵌套节点并返回该节点', () => {
    const schema = makeTree()
    const removed = removeNode(schema, 'b')
    expect(removed?.id).toBe('b')
    expect(findNode(schema.children, 'row')?.node.children?.map(n => n.id)).toEqual(['c'])
  })
})

describe('cloneNode', () => {
  it('深拷贝并为整棵子树生成新 id/field', () => {
    const schema = makeTree()
    const row = findNode(schema.children, 'row')!.node
    let seq = 0
    const copy = cloneNode(row, () => `new${seq++}`)
    expect(copy.id).toBe('new0')
    expect(copy.children!.map(c => c.id)).toEqual(['new1', 'new2'])
    expect(copy.children!.map(c => c.field)).toEqual(['new1', 'new2'])
    // 原节点不受影响
    expect(row.id).toBe('row')
  })
})

describe('isDescendant', () => {
  it('识别子树内节点', () => {
    const schema = makeTree()
    const row = findNode(schema.children, 'row')!.node
    expect(isDescendant(row, 'c')).toBe(true)
    expect(isDescendant(row, 'a')).toBe(false)
    expect(isDescendant(row, 'row')).toBe(false)
  })
})

describe('补充边界用例', () => {
  it('findNode 空树返回 null', () => {
    expect(findNode([], 'a')).toBeNull()
  })

  it('removeNode 未命中返回 null 且树不变', () => {
    const schema = makeTree()
    expect(removeNode(schema, 'zzz')).toBeNull()
    expect(schema.children).toHaveLength(2)
  })

  it('removeNode 摘除根层节点', () => {
    const schema = makeTree()
    expect(removeNode(schema, 'a')?.id).toBe('a')
    expect(schema.children.map(n => n.id)).toEqual(['row'])
  })

  it('childrenOf parentId 不存在返回 null', () => {
    expect(childrenOf(makeTree(), 'zzz')).toBeNull()
  })

  it('cloneNode 深拷贝隔离：修改 copy 不影响原节点', () => {
    const schema = makeTree()
    const row = findNode(schema.children, 'row')!.node
    const copy = cloneNode(row, () => 'x1')
    copy.props.gutter = 99
    expect(row.props.gutter).toBeUndefined()
  })
})
