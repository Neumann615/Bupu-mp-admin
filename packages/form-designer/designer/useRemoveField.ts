import { App } from 'antd'
import { useCallback } from 'react'
import { findNode } from '../utils/schemaTree'
import { useDesignerStore } from './store'

/**
 * 删除字段统一入口：含子字段的容器需二次确认，其余直接删除。
 * CanvasItem 的删除按钮与 FormDesigner 的 Delete 快捷键共用，删除后仍可 Ctrl+Z 撤销。
 */
export function useRemoveField() {
  const { modal } = App.useApp()

  return useCallback((id: string) => {
    const { schema, removeField } = useDesignerStore.getState()
    const childCount = findNode(schema.children, id)?.node.children?.length ?? 0
    if (childCount === 0) {
      removeField(id)
      return
    }
    modal.confirm({
      title: '删除容器？',
      content: `容器内还有 ${childCount} 个字段，将一并删除（可撤销）`,
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => removeField(id),
    })
  }, [modal])
}
