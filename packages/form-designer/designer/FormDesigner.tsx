import type { FormSchema } from '../types/schema'
import { createStyles } from 'antd-style'
import { useEffect, useRef } from 'react'
import { useDesignerStore } from './store'
import { Toolbar } from './Toolbar'
import '../registry/components'

const useStyles = createStyles(({ token, css }) => ({
  root: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${token.colorBgLayout};
  `,
  toolbar: css`
    padding: ${token.paddingXS}px ${token.paddingSM}px;
    background: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  body: css`
    flex: 1;
    display: flex;
    min-height: 0;
  `,
  left: css`
    width: 250px;
    flex-shrink: 0;
    background: ${token.colorBgContainer};
    border-right: 1px solid ${token.colorBorderSecondary};
    overflow-y: auto;
  `,
  canvas: css`
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    padding: ${token.paddingLG}px;
  `,
  right: css`
    width: 300px;
    flex-shrink: 0;
    background: ${token.colorBgContainer};
    border-left: 1px solid ${token.colorBorderSecondary};
    overflow-y: auto;
  `,
}))

export interface FormDesignerProps {
  /** 初始 schema。身份（引用）变化时重新装载；同实例切换编辑对象时建议配合 key 使用 */
  initialSchema?: FormSchema
  onSave?: (schema: FormSchema) => void
}

export function FormDesigner({ initialSchema, onSave }: FormDesignerProps) {
  const { styles } = useStyles()
  const { setSchema, schema } = useDesignerStore()
  const rootRef = useRef<HTMLDivElement>(null)

  // 外部 schema 装载：initialSchema 身份变化时重新装载（消费方切换表单时应传入新对象；
  // 若父组件复用同一对象引用则不触发——同实例切换表单的推荐做法是传 key={表单id}）
  useEffect(() => {
    if (initialSchema)
      setSchema(initialSchema)
  }, [initialSchema, setSchema])

  // 键盘快捷键：仅当事件目标在设计器容器内时生效；
  // 可编辑目标（输入框/文本域/contentEditable）内屏蔽 Delete/Ctrl+D 与撤销重做（让位于原生文本编辑）
  useEffect(() => {
    const isEditable = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement))
        return false
      return /^(?:INPUT|TEXTAREA)$/.test(el.tagName) || el.isContentEditable
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const root = rootRef.current
      if (!root)
        return
      const inRoot = root.contains(e.target as Node)
      // 点击画布后焦点回落 body：仅当设计器可见（非 keep-alive display:none 隐藏）时放行
      const bodyFallback = e.target === document.body && root.offsetParent !== null
      if (!inRoot && !bodyFallback)
        return
      const key = e.key.toLowerCase()
      const mod = e.ctrlKey || e.metaKey
      if (isEditable(e.target))
        return
      const { selectedId, removeField, duplicateField, undo, redo } = useDesignerStore.getState()
      if (mod && key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      else if (mod && (key === 'y' || (key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
      else if (e.key === 'Delete' && selectedId) {
        removeField(selectedId)
      }
      else if (mod && key === 'd' && selectedId) {
        e.preventDefault()
        duplicateField(selectedId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.toolbar}>
        <Toolbar onSave={onSave ? () => onSave(schema) : undefined} />
      </div>
      <div className={styles.body}>
        <div className={styles.left}>{/* T5：LeftPanel */}</div>
        <div className={styles.canvas}>{/* T6：Canvas */}</div>
        <div className={styles.right}>{/* T7：RightPanel */}</div>
      </div>
    </div>
  )
}
