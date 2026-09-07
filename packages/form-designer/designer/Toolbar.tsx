import {
  ClearOutlined,
  ExportOutlined,
  EyeOutlined,
  ImportOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { App, Button, Divider, Input, Modal, Space } from 'antd'
import { useState } from 'react'
import { FormRenderer } from '../renderer/FormRenderer'
import { useDesignerStore } from './store'

interface ToolbarProps {
  onSave?: () => void
}

export function Toolbar({ onSave }: ToolbarProps) {
  const { message, modal } = App.useApp()
  const { past, future, undo, redo, clear, importSchema, exportSchema, schema } = useDesignerStore()
  const [importOpen, setImportOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)

  const handleImport = () => {
    if (importSchema(importText)) {
      message.success('导入成功')
      setImportOpen(false)
      setImportText('')
    }
    else {
      message.error('JSON 格式不正确，未导入')
    }
  }

  const handleClear = () => {
    modal.confirm({
      title: '清空画布？',
      content: '将删除所有字段（可撤销）',
      onOk: clear,
    })
  }

  return (
    <Space split={<Divider type="vertical" />}>
      <Space>
        <Button size="small" icon={<UndoOutlined />} disabled={!past.length} onClick={undo} />
        <Button size="small" icon={<RedoOutlined />} disabled={!future.length} onClick={redo} />
      </Space>
      <Space>
        <Button size="small" icon={<ImportOutlined />} onClick={() => setImportOpen(true)}>导入</Button>
        <Button size="small" icon={<ExportOutlined />} onClick={() => setExportOpen(true)}>导出</Button>
        <Button size="small" danger icon={<ClearOutlined />} onClick={handleClear}>清空</Button>
      </Space>
      <Space>
        <Button
          size="small"
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => {
            setSubmitted(null)
            setPreviewOpen(true)
          }}
        >
          预览
        </Button>
        {onSave && <Button size="small" type="primary" icon={<SaveOutlined />} onClick={onSave}>保存</Button>}
      </Space>

      <Modal title="导入 Schema" open={importOpen} onOk={handleImport} onCancel={() => setImportOpen(false)} okText="导入">
        <Input.TextArea rows={10} value={importText} onChange={e => setImportText(e.target.value)} placeholder="粘贴 FormSchema JSON" />
      </Modal>

      <Modal title="导出 Schema" open={exportOpen} footer={null} onCancel={() => setExportOpen(false)}>
        <Input.TextArea rows={14} readOnly value={exportSchema()} onFocus={e => e.target.select()} />
      </Modal>

      <Modal title="表单预览" open={previewOpen} footer={null} width={720} onCancel={() => setPreviewOpen(false)} destroyOnHidden>
        <FormRenderer
          schema={schema}
          onSubmit={(values) => {
            setSubmitted(JSON.stringify(values, null, 2))
            message.success('提交成功，数据见下方')
          }}
        />
        {submitted && (
          <pre style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 6, maxHeight: 240, overflow: 'auto' }}>
            {submitted}
          </pre>
        )}
      </Modal>
    </Space>
  )
}
