import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'

export interface OptionItem {
  label: string
  value: any
}

interface OptionsEditorProps {
  value?: OptionItem[]
  onChange?: (value: OptionItem[]) => void
}

export function OptionsEditor({ value = [], onChange }: OptionsEditorProps) {
  const update = (index: number, key: keyof OptionItem, v: string) => {
    const next = value.map((item, i) => (i === index ? { ...item, [key]: v } : item))
    onChange?.(next)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {value.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6 }}>
          <Input size="small" placeholder="label" value={item.label} onChange={e => update(i, 'label', e.target.value)} />
          <Input size="small" placeholder="value" value={item.value} onChange={e => update(i, 'value', e.target.value)} />
          <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => onChange?.(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={() => onChange?.([...value, { label: `选项${value.length + 1}`, value: `${value.length + 1}` }])}>
        添加选项
      </Button>
    </div>
  )
}
