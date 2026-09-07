import type { FormSchema } from '../types/schema'
import { createStyles } from 'antd-style'
import { useEffect } from 'react'
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
  initialSchema?: FormSchema
  onSave?: (schema: FormSchema) => void
}

export function FormDesigner({ initialSchema, onSave }: FormDesignerProps) {
  const { styles } = useStyles()
  const { setSchema, schema, removeField, duplicateField, undo, redo, selectedId } = useDesignerStore()

  // 外部 schema 装载（设计页编辑已有表单）
  useEffect(() => {
    if (initialSchema)
      setSchema(initialSchema)
  // 仅首次装载
  }, [])

  // 键盘快捷键
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const inInput = /^(?:INPUT|TEXTAREA)$/.test((e.target as HTMLElement).tagName)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
      else if (!inInput && e.key === 'Delete' && selectedId) {
        removeField(selectedId)
      }
      else if (!inInput && (e.ctrlKey || e.metaKey) && e.key === 'd' && selectedId) {
        e.preventDefault()
        duplicateField(selectedId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedId, removeField, duplicateField, undo, redo])

  return (
    <div className={styles.root}>
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
