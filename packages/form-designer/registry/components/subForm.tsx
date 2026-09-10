import type { TableColumnsType } from 'antd'
import type { FieldSchema } from '../../types/schema'
import { GroupOutlined, OrderedListOutlined, PlusOutlined, TableOutlined } from '@ant-design/icons'
import { Button, Card, Steps, Table } from 'antd'
import { registerComponent } from '../registry'
import { bareSchema, fieldSchema, groupSchema } from './helpers'

/** Form.List 行记录：key 供 React，name 为名路径索引 */
interface RowRecord {
  key: number
  name: number
}

registerComponent({
  type: 'subForm',
  title: '子表单',
  menu: 'subform',
  icon: <GroupOutlined />,
  isContainer: true,
  // 值绑定为嵌套对象：提交结构 { [field]: { 子字段… } }
  nestObject: true,
  defaultSchema: () => groupSchema('subForm', '子表单', { size: 'small' }, [
    fieldSchema('input', '姓名'),
  ]),
  render: (schema, children) => (
    <Card
      size={schema.props.size ?? 'small'}
      title={schema.label || '子表单'}
      style={{ marginBottom: 12 }}
    >
      {children}
    </Card>
  ),
  configForm: [
    {
      field: 'props.size',
      label: '尺寸',
      type: 'select',
      options: [
        { label: '默认', value: 'default' },
        { label: '小', value: 'small' },
      ],
    },
  ],
})

registerComponent({
  type: 'tableForm',
  title: '表格子表单',
  menu: 'subform',
  icon: <TableOutlined />,
  isContainer: true,
  // 值绑定为数组：提交结构 [{ 子字段… }]
  nestList: true,
  defaultSchema: () => groupSchema('tableForm', '明细', { addText: '添加一行' }, [
    fieldSchema('input', '名称'),
    fieldSchema('number', '数量'),
  ]),
  // 画布态走这里：设计期没有数据行，用卡片壳承载子字段与落点
  render: (schema, children) => (
    <Card
      size="small"
      title={schema.label || '表格子表单'}
      extra="运行时可增删行"
      style={{ marginBottom: 12 }}
    >
      {children}
    </Card>
  ),
  // 运行时走这里：Table 行内编辑，列由 schema.children 生成，单元格名路径由渲染器按行注入
  renderList: (schema, { rows, renderCell, add, remove }) => {
    const children: FieldSchema[] = schema.children ?? []
    const columns: TableColumnsType<RowRecord> = [
      ...children.map(child => ({
        title: child.label || child.field || '字段',
        key: child.id,
        render: (_: unknown, row: RowRecord) => renderCell(row.name, child),
      })),
      {
        title: '操作',
        key: '__action',
        width: 72,
        render: (_: unknown, row: RowRecord) => (
          <Button type="link" size="small" danger onClick={() => remove(row.name)}>
            删除
          </Button>
        ),
      },
    ]
    return (
      <div style={{ marginBottom: 12 }}>
        <Table<RowRecord>
          size="small"
          rowKey="key"
          columns={columns}
          dataSource={rows}
          pagination={false}
          locale={{ emptyText: '暂无数据' }}
        />
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          style={{ marginTop: 8 }}
          onClick={() => add()}
        >
          {schema.props.addText || '添加一行'}
        </Button>
      </div>
    )
  },
  configForm: [
    { field: 'props.addText', label: '添加按钮文案', type: 'input' },
  ],
})

registerComponent({
  type: 'stepForm',
  title: '分步表单',
  menu: 'subform',
  icon: <OrderedListOutlined />,
  isContainer: true,
  defaultSchema: () => bareSchema('stepForm', { stepTitle: '步骤一' }, []),
  // 与 tabs/collapse 的单页签简化保持一致：本期只做单步骤视觉容器，数据扁平
  render: (schema, children) => (
    <div>
      <Steps
        size="small"
        items={[{ title: schema.props.stepTitle || '步骤一' }]}
        style={{ marginBottom: 16 }}
      />
      {children}
    </div>
  ),
  configForm: [
    { field: 'props.stepTitle', label: '步骤标题', type: 'input' },
  ],
})
