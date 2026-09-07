import { CalendarOutlined, FieldTimeOutlined, SwapRightOutlined } from '@ant-design/icons'
import { DatePicker, TimePicker } from 'antd'
import { registerComponent } from '../registry'
import { fieldSchema } from './helpers'

const FORMAT_OPTIONS = [
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
]

registerComponent({
  type: 'date',
  title: '日期选择',
  menu: 'main',
  icon: <CalendarOutlined />,
  defaultSchema: () => fieldSchema('date', '日期'),
  render: schema => <DatePicker style={{ width: '100%' }} {...schema.props} />,
  configForm: [
    { field: 'props.placeholder', label: '占位提示', type: 'input' },
    { field: 'props.format', label: '格式', type: 'select', options: FORMAT_OPTIONS },
    { field: 'props.showTime', label: '带时间', type: 'switch' },
    { field: 'props.disabled', label: '禁用', type: 'switch' },
  ],
})

registerComponent({
  type: 'dateRange',
  title: '日期范围',
  menu: 'main',
  icon: <SwapRightOutlined />,
  defaultSchema: () => fieldSchema('dateRange', '日期范围'),
  render: schema => <DatePicker.RangePicker style={{ width: '100%' }} {...schema.props} />,
  configForm: [
    { field: 'props.format', label: '格式', type: 'select', options: FORMAT_OPTIONS },
    { field: 'props.showTime', label: '带时间', type: 'switch' },
    { field: 'props.disabled', label: '禁用', type: 'switch' },
  ],
})

registerComponent({
  type: 'time',
  title: '时间选择',
  menu: 'main',
  icon: <FieldTimeOutlined />,
  defaultSchema: () => fieldSchema('time', '时间'),
  render: schema => <TimePicker style={{ width: '100%' }} {...schema.props} />,
  configForm: [
    {
      field: 'props.format',
      label: '格式',
      type: 'select',
      options: [
        { label: 'HH:mm:ss', value: 'HH:mm:ss' },
        { label: 'HH:mm', value: 'HH:mm' },
      ],
    },
    { field: 'props.disabled', label: '禁用', type: 'switch' },
  ],
})
