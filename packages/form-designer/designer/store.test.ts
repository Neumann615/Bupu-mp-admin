import { beforeEach, describe, expect, it } from 'vitest'
import { registerComponent } from '../registry/registry'
import { createEmptySchema } from '../types/schema'
import { useDesignerStore } from './store'

// 注册测试用组件
registerComponent({
  type: 'input',
  title: '输入框',
  menu: 'main',
  icon: null,
  defaultSchema: () => ({ id: 'x', type: 'input', field: 'fx', label: '输入框', props: {} }),
  render: () => null,
  configForm: [],
})
registerComponent({
  type: 'card',
  title: '卡片',
  menu: 'layout',
  icon: null,
  isContainer: true,
  defaultSchema: () => ({ id: 'x', type: 'card', props: {}, children: [] }),
  render: () => null,
  configForm: [],
})

function reset() {
  useDesignerStore.setState({
    schema: createEmptySchema(),
    selectedId: null,
    past: [],
    future: [],
  })
}

const store = () => useDesignerStore.getState()

describe('designer store', () => {
  beforeEach(reset)

  it('addField 向根列表插入字段并选中', () => {
    store().addField('input', { parentId: null, index: 0 })
    expect(store().schema.children).toHaveLength(1)
    expect(store().schema.children[0].type).toBe('input')
    expect(store().schema.children[0].id).not.toBe('x') // 重新生成
    expect(store().schema.children[0].field).not.toBe('fx')
    expect(store().selectedId).toBe(store().schema.children[0].id)
  })

  it('addField 向容器内插入', () => {
    store().addField('card', { parentId: null, index: 0 })
    const cardId = store().schema.children[0].id
    store().addField('input', { parentId: cardId, index: 0 })
    expect(store().schema.children[0].children).toHaveLength(1)
  })

  it('moveField 同列表排序（移到后方时下标修正）', () => {
    store().addField('input', { parentId: null, index: 0 })
    store().addField('input', { parentId: null, index: 1 })
    store().addField('input', { parentId: null, index: 2 })
    const [a, b, c] = store().schema.children.map(n => n.id)
    store().moveField(a, { parentId: null, index: 3 }) // a 移到末尾
    expect(store().schema.children.map(n => n.id)).toEqual([b, c, a])
  })

  it('moveField 拒绝拖入自身子树', () => {
    store().addField('card', { parentId: null, index: 0 })
    const cardId = store().schema.children[0].id
    store().addField('card', { parentId: cardId, index: 0 })
    const innerId = store().schema.children[0].children![0].id
    store().moveField(cardId, { parentId: innerId, index: 0 })
    expect(store().schema.children[0].id).toBe(cardId) // 未变化
  })

  it('removeField / duplicateField', () => {
    store().addField('input', { parentId: null, index: 0 })
    const id = store().schema.children[0].id
    store().duplicateField(id)
    expect(store().schema.children).toHaveLength(2)
    expect(store().schema.children[1].id).not.toBe(id)
    store().removeField(id)
    expect(store().schema.children).toHaveLength(1)
  })

  it('updateField 按路径写回并产生历史', () => {
    store().addField('input', { parentId: null, index: 0 })
    const id = store().schema.children[0].id
    store().updateField(id, 'props.placeholder', '请输入')
    expect(store().schema.children[0].props.placeholder).toBe('请输入')
    expect(store().past.length).toBeGreaterThan(0)
  })

  it('undo/redo 往返', () => {
    store().addField('input', { parentId: null, index: 0 })
    expect(store().schema.children).toHaveLength(1)
    store().undo()
    expect(store().schema.children).toHaveLength(0)
    store().redo()
    expect(store().schema.children).toHaveLength(1)
  })

  it('导出导入往返一致，非法 JSON 导入返回 false', () => {
    store().addField('input', { parentId: null, index: 0 })
    const json = store().exportSchema()
    store().clear()
    expect(store().schema.children).toHaveLength(0)
    expect(store().importSchema(json)).toBe(true)
    expect(store().schema.children).toHaveLength(1)
    expect(store().importSchema('{bad json')).toBe(false)
    expect(store().importSchema('{"version":2,"children":[]}')).toBe(false)
  })
})
