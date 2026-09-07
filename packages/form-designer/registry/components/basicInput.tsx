import {
  FieldNumberOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { Input, InputNumber } from 'antd'
import { registerComponent } from '../registry'
import { fieldSchema } from './helpers'

registerComponent({
  type: 'input',
  title: '输入框',
  menu: 'main',
  icon: <FontSizeOutlined />,
  defaultSchema: () => fieldSchema('input', '输入框'),
  render: schema => <Input {...schema.props} />,
  configForm: [
    { field: 'props.placeholder', label: '占位提示', type: 'input' },
    { field: 'props.maxLength', label: '最大长度', type: 'number', props: { min: 0 } },
    { field: 'props.allowClear', label: '可清空', type: 'switch' },
    { field: 'props.showCount', label: '显示字数', type: 'switch' },
    { field: 'props.disabled', label: '禁用', type: 'switch' },
  ],
})

registerComponent({
  type: 'textarea',
  title: '文本域',
  menu: 'main',
  icon: <FileTextOutlined />,
  defaultSchema: () => fieldSchema('textarea', '文本域', { rows: 3 }),
  render: schema => <Input.TextArea {...schema.props} />,
  configForm: [
    { field: 'props.placeholder', label: '占位提示', type: 'input' },
    { field: 'props.rows', label: '行数', type: 'number', props: { min: 1, max: 20 } },
    { field: 'props.maxLength', label: '最大长度', type: 'number', props: { min: 0 } },
    { field: 'props.showCount', label: '显示字数', type: 'switch' },
    { field: 'props.disabled', label: '禁用', type: 'switch' },
  ],
})

registerComponent({
  type: 'password',
  title: '密码框',
  menu: 'main',
  icon: <LockOutlined />,
  defaultSchema: () => fieldSchema('password', '密码'),
  render: schema => <Input.Password {...schema.props} />,
  configForm: [
    { field: 'props.placeholder', label: '占位提示', type: 'input' },
    { field: 'props.disabled', label: '禁用', type: 'switch' },
  ],
})

registerComponent({
  type: 'number',
  title: '数字输入',
  menu: 'main',
  icon: <FieldNumberOutlined />,
  defaultSchema: () => fieldSchema('number', '数字'),
  render: schema => <InputNumber style={{ width: '100%' }} {...schema.props} />,
  configForm: [
    { field: 'props.min', label: '最小值', type: 'number' },
    { field: 'props.max', label: '最大值', type: 'number' },
    { field: 'props.step', label: '步长', type: 'number', props: { min: 0 } },
    { field: 'props.precision', label: '小数位', type: 'number', props: { min: 0, max: 10 } },
    { field: 'props.placeholder', label: '占位提示', type: 'input' },
    { field: 'props.disabled', label: '禁用', type: 'switch' },
  ],
})
