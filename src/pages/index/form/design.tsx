import type { FormSchema } from '@zealous-admin/form-designer/index'
import { FormDesigner } from '@zealous-admin/form-designer/index'
import { useAppMessage } from '@zealous-admin/layout/index'
import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getFormDetailAPI, updateFormAPI } from '@/apis/form'

export default function FormDesignPage() {
  const { message } = useAppMessage()
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(!!id)
  const [initialSchema, setInitialSchema] = useState<FormSchema>()

  useEffect(() => {
    if (!id)
      return
    getFormDetailAPI(id).then((res) => {
      if (res.data.schema) {
        try {
          setInitialSchema(JSON.parse(res.data.schema))
        }
        catch {
          message.warning('已存 schema 解析失败，将重新设计')
        }
      }
    }).finally(() => setLoading(false))
  }, [id])

  const handleSave = async (schema: FormSchema) => {
    await updateFormAPI({ id, schema: JSON.stringify(schema) })
    message.success('保存成功')
  }

  if (loading)
    return <Spin style={{ display: 'block', margin: '120px auto' }} />

  return (
    <div style={{ height: 'calc(100vh - 120px)' }}>
      <FormDesigner key={id} initialSchema={initialSchema} onSave={id ? handleSave : undefined} />
    </div>
  )
}
