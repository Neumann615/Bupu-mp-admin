import { describe, expect, it } from 'vitest'
import { getByPath, setByPath } from './path'

describe('getByPath', () => {
  it('按点分路径读取', () => {
    const obj = { props: { placeholder: 'x' }, label: 'y' }
    expect(getByPath(obj, 'props.placeholder')).toBe('x')
    expect(getByPath(obj, 'label')).toBe('y')
    expect(getByPath(obj, 'props.missing.deep')).toBeUndefined()
  })
})

describe('setByPath', () => {
  it('按点分路径写入，自动创建中间对象', () => {
    const obj: Record<string, any> = {}
    setByPath(obj, 'formItem.tooltip', '提示')
    expect(obj).toEqual({ formItem: { tooltip: '提示' } })
  })

  it('覆盖已有值', () => {
    const obj = { props: { maxLength: 10 } }
    setByPath(obj, 'props.maxLength', 20)
    expect(obj.props.maxLength).toBe(20)
  })
})
