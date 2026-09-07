import type { FieldSchema, FormSchema } from '../types/schema'
import { Button, Form, Space } from 'antd'
import { Fragment } from 'react'
import { renderField } from './renderField'

export interface FormRendererProps {
  schema: FormSchema
  initialValues?: Record<string, any>
  onSubmit?: (values: Record<string, any>) => void
  /** 是否显示提交/重置按钮，业务页面可自行接管提交 */
  showActions?: boolean
}

export function FormRenderer({ schema, initialValues, onSubmit, showActions = true }: FormRendererProps) {
  const [form] = Form.useForm()

  const renderChild = (child: FieldSchema, parentType?: string): React.ReactNode => (
    <Fragment key={child.id}>{renderField(child, renderChild, parentType)}</Fragment>
  )

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      {...schema.form}
    >
      {schema.children.map(c => renderChild(c))}
      {showActions && (
        <Form.Item wrapperCol={schema.form.layout === 'horizontal' ? { offset: 4 } : undefined}>
          <Space>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  )
}
