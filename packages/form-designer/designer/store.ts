import type { FieldSchema, FormSchema } from '../types/schema'
import { create } from 'zustand'
import { getComponent } from '../registry/registry'
import { createEmptySchema } from '../types/schema'
import { setByPath } from '../utils/path'
import { childrenOf, cloneNode, findNode, isDescendant, removeNode } from '../utils/schemaTree'
import { uniqueId } from '../utils/uniqueId'

/** 拖拽落点：插入到 parentId 的 children 的 index 处 */
export interface DropTarget {
  parentId: string | null
  index: number
}

const HISTORY_LIMIT = 50

interface DesignerState {
  schema: FormSchema
  selectedId: string | null
  past: FormSchema[]
  future: FormSchema[]
  select: (id: string | null) => void
  addField: (type: string, target: DropTarget) => void
  moveField: (id: string, target: DropTarget) => void
  removeField: (id: string) => void
  duplicateField: (id: string) => void
  /** 按点分路径更新字段属性，如 updateField(id, 'props.placeholder', '请输入') */
  updateField: (id: string, path: string, value: any) => void
  updateFormConfig: (patch: Partial<FormSchema['form']>) => void
  undo: () => void
  redo: () => void
  clear: () => void
  importSchema: (json: string) => boolean
  exportSchema: () => string
  setSchema: (schema: FormSchema) => void
  getSelected: () => FieldSchema | null
}

function clone(schema: FormSchema): FormSchema {
  return JSON.parse(JSON.stringify(schema))
}

export const useDesignerStore = create<DesignerState>((set, get) => {
  /** 所有结构/属性变更走此入口：深拷贝 → 变更 → 推历史；fn 返回 false 表示中止（no-op，不推历史） */
  const mutate = (fn: (draft: FormSchema) => void | false) => {
    const { schema, past } = get()
    const draft = clone(schema)
    if (fn(draft) === false)
      return
    set({
      schema: draft,
      past: [...past.slice(-(HISTORY_LIMIT - 1)), schema],
      future: [],
    })
  }

  return {
    schema: createEmptySchema(),
    selectedId: null,
    past: [],
    future: [],

    select: id => set({ selectedId: id }),

    addField: (type, target) => {
      const def = getComponent(type)
      if (!def)
        return
      mutate((draft) => {
        const list = childrenOf(draft, target.parentId)
        if (!list)
          return false
        const node = def.defaultSchema()
        node.id = uniqueId()
        if (node.field)
          node.field = uniqueId()
        list.splice(Math.min(target.index, list.length), 0, node)
        set({ selectedId: node.id })
      })
    },

    moveField: (id, target) => {
      if (target.parentId === id)
        return // 不能拖入自身
      const located = findNode(get().schema.children, id)
      if (!located)
        return
      if (target.parentId && isDescendant(located.node, target.parentId))
        return // 不能拖入自身子树
      mutate((draft) => {
        // 摘除前先在 draft 内定位，记录同列表相对位置
        const draftLocated = findNode(draft.children, id)
        const draftTargetList = childrenOf(draft, target.parentId)
        if (!draftLocated || !draftTargetList)
          return false
        const sameList = draftLocated.parentChildren === draftTargetList
        const fromIndex = draftLocated.index
        const node = removeNode(draft, id)!
        const list = childrenOf(draft, target.parentId)!
        const index = sameList && fromIndex < target.index ? target.index - 1 : target.index
        list.splice(Math.min(index, list.length), 0, node)
      })
    },

    removeField: (id) => {
      mutate((draft) => {
        if (!removeNode(draft, id))
          return false
      })
      // 删除的可能是包含选中节点的容器，统一校验选中态
      if (get().selectedId && !findNode(get().schema.children, get().selectedId!))
        set({ selectedId: null })
    },

    duplicateField: (id) => {
      mutate((draft) => {
        const located = findNode(draft.children, id)
        if (!located)
          return false
        const copy = cloneNode(located.node, uniqueId)
        located.parentChildren.splice(located.index + 1, 0, copy)
      })
    },

    updateField: (id, path, value) => {
      mutate((draft) => {
        const located = findNode(draft.children, id)
        if (!located)
          return false
        setByPath(located.node as unknown as Record<string, any>, path, value)
      })
    },

    updateFormConfig: patch => mutate(draft => void Object.assign(draft.form, patch)),

    undo: () => {
      const { past, schema, future } = get()
      if (!past.length)
        return
      set({
        schema: past[past.length - 1],
        past: past.slice(0, -1),
        future: [schema, ...future],
        selectedId: null,
      })
    },

    redo: () => {
      const { past, schema, future } = get()
      if (!future.length)
        return
      set({
        schema: future[0],
        past: [...past, schema],
        future: future.slice(1),
        selectedId: null,
      })
    },

    clear: () => mutate(draft => void (draft.children = [])),

    importSchema: (json) => {
      try {
        const parsed = JSON.parse(json)
        if (parsed?.version !== 1 || !Array.isArray(parsed.children))
          return false
        if (parsed.form !== undefined && (typeof parsed.form !== 'object' || parsed.form === null))
          return false
        mutate((draft) => {
          draft.form = { ...createEmptySchema().form, ...parsed.form }
          // 过滤缺 id/type 的脏节点（深层递归校验留给后续）
          draft.children = parsed.children.filter(
            (c: any) => typeof c?.id === 'string' && typeof c?.type === 'string',
          )
        })
        set({ selectedId: null })
        return true
      }
      catch {
        return false
      }
    },

    exportSchema: () => JSON.stringify(get().schema, null, 2),

    setSchema: schema => set({ schema, selectedId: null, past: [], future: [] }),

    getSelected: () => {
      const { schema, selectedId } = get()
      if (!selectedId)
        return null
      return findNode(schema.children, selectedId)?.node ?? null
    },
  }
})
