import type { Rule } from 'antd/es/form'
import type { FieldSchema, ValidateRule } from '../types/schema'

export function toAntdRules(schema: FieldSchema): Rule[] {
  const label = schema.label || '该字段'
  const rules = schema.formItem?.rules ?? []

  const result: (Rule | null)[] = []

  // formItem.required 映射为必填规则并置于最前；rules 中已有 required 则不重复
  if (schema.formItem?.required && !rules.some(r => r.type === 'required'))
    result.push({ required: true, message: `${label}不能为空` })

  for (const r of rules) {
    result.push(mapRule(r, label))
  }

  return result.filter((r): r is Rule => r !== null)
}

function mapRule(r: ValidateRule, label: string): Rule | null {
  switch (r.type) {
    case 'required':
      return { required: true, message: r.message || `${label}不能为空` }
    case 'regexp': {
      if (!r.pattern)
        return null
      try {
        return { pattern: new RegExp(r.pattern), message: r.message || `${label}格式不正确` }
      }
      catch {
        console.warn(`[form-designer] 非法正则表达式：${r.pattern}`)
        return null
      }
    }
    // 注意：type: 'number' 要求值为 number 类型，仅适用于 InputNumber 等数值组件；字符串输入组件误配将永远校验失败
    default:
      return { type: r.type as 'email' | 'url' | 'number', message: r.message || `${label}格式不正确` }
  }
}
