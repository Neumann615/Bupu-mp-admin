import {
  AlertOutlined,
  AlignLeftOutlined,
  FontColorsOutlined,
  LinkOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons'
import { Alert, Button, Typography } from 'antd'
import { registerComponent } from '../registry'
import { bareSchema } from './helpers'

registerComponent({
  type: 'text',
  title: '文本',
  menu: 'aide',
  icon: <FontColorsOutlined />,
  noFormItem: true,
  defaultSchema: () => bareSchema('text', { content: '文本内容' }),
  render: (schema) => {
    const { content, ...rest } = schema.props
    return <Typography.Text {...rest}>{content}</Typography.Text>
  },
  configForm: [
    { field: 'props.content', label: '内容', type: 'textarea' },
    {
      field: 'props.type',
      label: '类型',
      type: 'select',
      options: [
        { label: '默认', value: undefined },
        { label: '次要', value: 'secondary' },
        { label: '成功', value: 'success' },
        { label: '警告', value: 'warning' },
        { label: '危险', value: 'danger' },
      ],
    },
    { field: 'props.strong', label: '加粗', type: 'switch' },
    { field: 'props.delete', label: '删除线', type: 'switch' },
  ],
})

registerComponent({
  type: 'paragraph',
  title: '段落',
  menu: 'aide',
  icon: <AlignLeftOutlined />,
  noFormItem: true,
  defaultSchema: () => bareSchema('paragraph', { content: '段落文本，支持多行。' }),
  render: (schema) => {
    const { content, ...rest } = schema.props
    return <Typography.Paragraph {...rest}>{content}</Typography.Paragraph>
  },
  configForm: [
    { field: 'props.content', label: '内容', type: 'textarea' },
    {
      field: 'props.type',
      label: '类型',
      type: 'select',
      options: [
        { label: '默认', value: undefined },
        { label: '次要', value: 'secondary' },
        { label: '成功', value: 'success' },
        { label: '警告', value: 'warning' },
        { label: '危险', value: 'danger' },
      ],
    },
  ],
})

registerComponent({
  type: 'alert',
  title: '提示块',
  menu: 'aide',
  icon: <AlertOutlined />,
  noFormItem: true,
  defaultSchema: () => bareSchema('alert', { message: '提示信息', type: 'info', showIcon: true }),
  render: schema => <Alert {...schema.props} />,
  configForm: [
    { field: 'props.message', label: '标题', type: 'input' },
    { field: 'props.description', label: '描述', type: 'textarea' },
    {
      field: 'props.type',
      label: '类型',
      type: 'select',
      options: [
        { label: '信息', value: 'info' },
        { label: '成功', value: 'success' },
        { label: '警告', value: 'warning' },
        { label: '错误', value: 'error' },
      ],
    },
    { field: 'props.showIcon', label: '显示图标', type: 'switch' },
    { field: 'props.closable', label: '可关闭', type: 'switch' },
  ],
})

registerComponent({
  type: 'button',
  title: '按钮',
  menu: 'aide',
  icon: <PlaySquareOutlined />,
  noFormItem: true,
  defaultSchema: () => bareSchema('button', { text: '按钮', type: 'default' }),
  render: (schema) => {
    const { text, ...rest } = schema.props
    return <Button {...rest}>{text}</Button>
  },
  configForm: [
    { field: 'props.text', label: '文字', type: 'input' },
    {
      field: 'props.type',
      label: '类型',
      type: 'select',
      options: [
        { label: '默认', value: 'default' },
        { label: '主要', value: 'primary' },
        { label: '虚线', value: 'dashed' },
        { label: '文本', value: 'text' },
        { label: '链接', value: 'link' },
      ],
    },
    { field: 'props.danger', label: '危险态', type: 'switch' },
    { field: 'props.block', label: '撑满一行', type: 'switch' },
    { field: 'props.disabled', label: '禁用', type: 'switch' },
  ],
})

registerComponent({
  type: 'link',
  title: '链接',
  menu: 'aide',
  icon: <LinkOutlined />,
  noFormItem: true,
  defaultSchema: () => bareSchema('link', { text: '链接文字', href: 'https://', target: '_blank' }),
  render: (schema) => {
    const { text, ...rest } = schema.props
    return <Typography.Link {...rest}>{text}</Typography.Link>
  },
  configForm: [
    { field: 'props.text', label: '文字', type: 'input' },
    { field: 'props.href', label: '地址', type: 'input' },
    {
      field: 'props.target',
      label: '打开方式',
      type: 'select',
      options: [
        { label: '新窗口', value: '_blank' },
        { label: '当前窗口', value: '_self' },
      ],
    },
  ],
})
