import type { FieldSchema } from '../types/schema'
import { describe, expect, it, vi } from 'vitest'
import { toAntdRules } from './toAntdRules'

function field(formItem: FieldSchema['formItem']): FieldSchema {
  return { id: 'a', type: 'input', field: 'fa', label: '邮箱', props: {}, formItem }
}

describe('toAntdRules', () => {
  it('无规则返回空数组', () => {
    expect(toAntdRules(field(undefined))).toEqual([])
    expect(toAntdRules(field({ rules: [] }))).toEqual([])
  })

  it('required 规则', () => {
    expect(toAntdRules(field({ rules: [{ type: 'required' }] }))).toEqual([
      { required: true, message: '邮箱不能为空' },
    ])
  })

  it('formItem.required 映射为必填规则并置于最前', () => {
    const rules = toAntdRules(field({ required: true, rules: [{ type: 'email' }] }))
    expect(rules[0]).toEqual({ required: true, message: '邮箱不能为空' })
    expect(rules).toHaveLength(2)
  })

  it('formItem.required 与 rules 中 required 不重复', () => {
    const rules = toAntdRules(field({ required: true, rules: [{ type: 'required', message: '必填' }] }))
    expect(rules.filter((r: any) => r.required)).toHaveLength(1)
  })

  it('email/url/number 映射为 type 规则', () => {
    expect(toAntdRules(field({ rules: [{ type: 'email' }] }))).toEqual([
      { type: 'email', message: '邮箱格式不正确' },
    ])
  })

  it('regexp 正常 pattern', () => {
    const rules = toAntdRules(field({ rules: [{ type: 'regexp', pattern: '^1\\d{10}$', message: '手机号不正确' }] }))
    expect(rules[0]).toHaveProperty('pattern')
    expect((rules[0] as any).pattern).toBeInstanceOf(RegExp)
  })

  it('regexp 空 pattern 被过滤', () => {
    expect(toAntdRules(field({ rules: [{ type: 'regexp' }] }))).toEqual([])
  })

  it('regexp 非法 pattern 被过滤且不抛异常', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => toAntdRules(field({ rules: [{ type: 'regexp', pattern: '[' }] }))).not.toThrow()
    expect(toAntdRules(field({ rules: [{ type: 'regexp', pattern: '[' }] }))).toEqual([])
    vi.restoreAllMocks()
  })

  it('无 label 时使用默认称谓', () => {
    const f = field({ rules: [{ type: 'required' }] })
    delete f.label
    expect(toAntdRules(f)).toEqual([{ required: true, message: '该字段不能为空' }])
  })
})
