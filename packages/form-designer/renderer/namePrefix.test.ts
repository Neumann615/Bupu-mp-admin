import { describe, expect, it } from 'vitest'
import { joinName } from './namePrefix'

describe('joinName', () => {
  it('无字段名时不绑定', () => {
    expect(joinName([], undefined)).toBeUndefined()
    expect(joinName(['contact'], '')).toBeUndefined()
  })

  it('空前缀下返回单段名路径', () => {
    expect(joinName([], 'name')).toEqual(['name'])
  })

  it('嵌套前缀逐层累加（对象容器与数组行）', () => {
    expect(joinName(['contact'], 'name')).toEqual(['contact', 'name'])
    expect(joinName([0], 'title')).toEqual([0, 'title'])
  })

  it('不修改入参数组', () => {
    const prefix = ['contact']
    joinName(prefix, 'name')
    expect(prefix).toEqual(['contact'])
  })
})
