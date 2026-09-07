import type { ValidateRule } from '../types/schema'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Select } from 'antd'

const RULE_TYPES = [
  { label: '必填', value: 'required' },
  { label: '邮箱', value: 'email' },
  { label: 'URL', value: 'url' },
  { label: '数字', value: 'number' },
  { label: '正则', value: 'regexp' },
]

interface ValidateEditorProps {
  value?: ValidateRule[]
  onChange?: (value: ValidateRule[]) => void
}

export function ValidateEditor({ value = [], onChange }: ValidateEditorProps) {
  const update = (index: number, patch: Partial<ValidateRule>) => {
    onChange?.(value.map((r, i) => {
      if (i !== index)
        return r
      const next = { ...r, ...patch }
      // 切换到非 regexp 类型时清除残留 pattern
      if (patch.type && patch.type !== 'regexp')
        delete next.pattern
      return next
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {value.map((rule, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 6, border: '1px solid #f0f0f0', borderRadius: 6 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <Select
              size="small"
              style={{ flex: 1 }}
              options={RULE_TYPES}
              value={rule.type}
              onChange={v => update(i, { type: v })}
            />
            <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => onChange?.(value.filter((_, j) => j !== i))} />
          </div>
          {rule.type === 'regexp' && (
            <Input size="small" placeholder="正则表达式，如 ^1\d{10}$" value={rule.pattern ?? ''} onChange={e => update(i, { pattern: e.target.value })} />
          )}
          <Input size="small" placeholder="校验失败提示语（可选）" value={rule.message ?? ''} onChange={e => update(i, { message: e.target.value })} />
        </div>
      ))}
      <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={() => onChange?.([...value, { type: 'required' }])}>
        添加规则
      </Button>
    </div>
  )
}
