import type { FormSchema } from '@zealous-admin/form-designer/index'
import { FormRenderer } from '@zealous-admin/form-designer/index'
import { useAppMessage } from '@zealous-admin/layout/index'
import { Card, Empty, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getFormDetailAPI } from '@/apis/form'

export default function FormRenderPage() {
  const { message } = useAppMessage()
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(!!id)
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)

  useEffect(() => {
    if (!id)
      return
    getFormDetailAPI(id).then((res) => {
      setName(res.data.name)
      if (res.data.schema) {
        try {
          setSchema(JSON.parse(res.data.schema))
        }
        catch {
          message.warning('表单数据解析失败')
        }
      }
    }).finally(() => setLoading(false))
  }, [id])

  if (loading)
    return <Spin style={{ display: 'block', margin: '120px auto' }} />
  if (!schema)
    return <Empty description="未找到表单或尚未保存设计" />

  return (
    <div className="app-container">
      <Card title={`渲染测试：${name}`} style={{ maxWidth: 860, margin: '0 auto' }}>
        <FormRenderer
          schema={schema}
          onSubmit={(values) => {
            setSubmitted(JSON.stringify(values, null, 2))
            message.success('提交成功')
          }}
        />
        {submitted && (
          <pre style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 6, maxHeight: 320, overflow: 'auto' }}>
            {submitted}
          </pre>
        )}
      </Card>
    </div>
  )
}
