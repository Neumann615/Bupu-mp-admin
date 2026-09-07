import type { FieldSchema } from '../types/schema'
import { CopyOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons'
import { useDraggable } from '@dnd-kit/react'
import { Form } from 'antd'
import { createStyles } from 'antd-style'
import { getComponent } from '../registry/registry'
import { DropGap } from './DropGap'
import { useDesignerStore } from './store'

const useStyles = createStyles(({ token, css }) => ({
  item: css`
    position: relative;
    border: 1px dashed transparent;
    border-radius: ${token.borderRadius}px;
    padding: 2px;
    &:hover {
      border-color: ${token.colorPrimaryBorder};
    }
  `,
  selected: css`
    border-color: ${token.colorPrimary} !important;
  `,
  mask: css`
    position: absolute;
    inset: 0;
    z-index: 1;
    cursor: default;
  `,
  /**
   * 容器子树包装层：z-index 高于自身 mask（z-index:1），使子项（含子项自身的
   * mask/操作条）整棵子树压在父 mask 之上，子字段可点选；父 mask 仍覆盖容器
   * 自身 padding/外壳区域用于选中容器。嵌套容器逐层复用同一规则。
   */
  children: css`
    position: relative;
    z-index: 2;
  `,
  actions: css`
    position: absolute;
    top: -12px;
    right: 4px;
    z-index: 2;
    display: flex;
    background: ${token.colorPrimary};
    border-radius: ${token.borderRadiusSM}px;
    overflow: hidden;
  `,
  actionBtn: css`
    padding: 1px 6px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `,
  dragBtn: css`
    cursor: grab;
  `,
  unknown: css`
    padding: ${token.paddingSM}px;
    color: ${token.colorWarning};
  `,
}))

interface CanvasItemProps {
  node: FieldSchema
}

export function CanvasItem({ node }: CanvasItemProps) {
  const { styles, cx } = useStyles()
  // 布尔选择器：仅当选中态在当前项上进/出时才重渲染，避免选中切换扇出到全部 CanvasItem
  const selected = useDesignerStore(s => s.selectedId === node.id)
  const select = useDesignerStore(s => s.select)
  const removeField = useDesignerStore(s => s.removeField)
  const duplicateField = useDesignerStore(s => s.duplicateField)
  const def = getComponent(node.type)

  // 拖拽激活区域随选中态变化属有意设计（formily 同款行为，勿当回归修复）：
  // handleRef 未挂载时（未选中、操作条不渲染）整个字段可起拖；
  // 选中后 handleRef 挂载到操作条手柄，仅手柄可拖，避免与字段输入区交互冲突。
  const { ref: dragRef, handleRef } = useDraggable({
    id: `field-${node.id}`,
    data: { kind: 'field', id: node.id },
  })

  if (!def) {
    return <div className={styles.unknown}>{`未注册的组件类型：${node.type}`}</div>
  }

  /** 容器子列表：交替渲染间隙落点与子项 */
  const renderChildren = () => {
    const kids = node.children ?? []
    if (!kids.length)
      return <DropGap parentId={node.id} index={0} empty />
    return (
      <>
        {kids.map((c, i) => (
          <span key={c.id} style={{ display: 'contents' }}>
            <DropGap parentId={node.id} index={i} />
            <CanvasItem node={c} />
          </span>
        ))}
        <DropGap parentId={node.id} index={kids.length} />
      </>
    )
  }

  const body = def.isContainer
    ? def.render(node, <div className={styles.children}>{renderChildren()}</div>)
    : def.noFormItem
      ? def.render(node)
      : (
          <Form.Item
            label={node.label}
            required={node.formItem?.rules?.some(r => r.type === 'required')}
            tooltip={node.formItem?.tooltip}
            extra={node.formItem?.extra}
          >
            {def.render(node)}
          </Form.Item>
        )

  return (
    <div
      ref={dragRef}
      className={cx(styles.item, selected && styles.selected)}
      onClick={(e) => {
        e.stopPropagation()
        select(node.id)
      }}
    >
      {body}
      <div
        className={styles.mask}
        onClick={(e) => {
          e.stopPropagation()
          select(node.id)
        }}
      />
      {selected && (
        <div className={styles.actions}>
          <span ref={handleRef} className={cx(styles.actionBtn, styles.dragBtn)} title="拖拽移动">
            <DragOutlined />
          </span>
          <span
            className={styles.actionBtn}
            title="复制"
            onClick={(e) => {
              e.stopPropagation()
              duplicateField(node.id)
            }}
          >
            <CopyOutlined />
          </span>
          <span
            className={styles.actionBtn}
            title="删除"
            onClick={(e) => {
              e.stopPropagation()
              removeField(node.id)
            }}
          >
            <DeleteOutlined />
          </span>
        </div>
      )}
    </div>
  )
}
