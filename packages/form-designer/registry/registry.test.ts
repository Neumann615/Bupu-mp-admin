import { describe, expect, it } from 'vitest'
import { getComponent, getMenus, registerComponent } from './registry'

function stub(type: string, menu: 'main' | 'aide' | 'layout', title = type) {
  return {
    type,
    title,
    menu,
    icon: null,
    defaultSchema: () => ({ id: 'x', type, props: {} }),
    render: () => null,
    configForm: [],
  }
}

describe('registry', () => {
  it('registerComponent / getComponent', () => {
    registerComponent(stub('test-input', 'main', '测试输入'))
    expect(getComponent('test-input')?.title).toBe('测试输入')
    expect(getComponent('not-exist')).toBeUndefined()
  })

  it('getMenus 按分组返回且过滤空组', () => {
    registerComponent(stub('test-a', 'aide'))
    const menus = getMenus()
    const mainGroup = menus.find(g => g.name === 'main')
    expect(mainGroup?.list.some(d => d.type === 'test-input')).toBe(true)
    const aideGroup = menus.find(g => g.name === 'aide')
    expect(aideGroup?.list.some(d => d.type === 'test-a')).toBe(true)
    // layout 组无组件时应被过滤
    expect(menus.find(g => g.name === 'layout')).toBeUndefined()
    // 分组标题
    expect(mainGroup?.title).toBe('基础组件')
  })
})
