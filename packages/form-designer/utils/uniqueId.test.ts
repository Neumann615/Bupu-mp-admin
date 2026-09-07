import { describe, expect, it } from 'vitest'
import { uniqueId } from './uniqueId'

describe('uniqueId', () => {
  it('批量生成不重复', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => uniqueId()))
    expect(ids.size).toBe(1000)
  })

  it('支持自定义前缀', () => {
    expect(uniqueId('field_').startsWith('field_')).toBe(true)
  })
})
