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
  const selectedId = useDesignerStore(s => s.selectedId)
  const select = useDesignerStore(s => s.select)
  const removeField = useDesignerStore(s => s.removeField)
  const duplicateField = useDesignerStore(s => s.duplicateField)
  const def = getComponent(node.type)
  const selected = selectedId === node.id

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
    ? def.render(node, renderChildren())
    : def.noFormItem
      ? def.render(node)
      : (
          <Form.Item label={node.label} required={node.formItem?.rules?.some(r => r.type === 'required')}>
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
