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
  /** 所有结构/属性变更走此入口：深拷贝 → 变更 → 推历史 */
  const mutate = (fn: (draft: FormSchema) => void) => {
    const { schema, past } = get()
    const draft = clone(schema)
    fn(draft)
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
          return
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
      // 同列表时记录摘除前的相对位置
      const targetList = childrenOf(get().schema, target.parentId)
      const sameList = targetList === located.parentChildren
      mutate((draft) => {
        const node = removeNode(draft, id)
        if (!node)
          return
        const list = childrenOf(draft, target.parentId)
        if (!list)
          return
        const index = sameList && located.index < target.index ? target.index - 1 : target.index
        list.splice(Math.min(index, list.length), 0, node)
      })
    },

    removeField: (id) => {
      mutate(draft => void removeNode(draft, id))
      if (get().selectedId === id)
        set({ selectedId: null })
    },

    duplicateField: (id) => {
      mutate((draft) => {
        const located = findNode(draft.children, id)
        if (!located)
          return
        const copy = cloneNode(located.node, uniqueId)
        located.parentChildren.splice(located.index + 1, 0, copy)
      })
    },

    updateField: (id, path, value) => {
      mutate((draft) => {
        const located = findNode(draft.children, id)
        if (located)
          setByPath(located.node as unknown as Record<string, any>, path, value)
      })
    },

    updateFormConfig: patch => mutate(draft => Object.assign(draft.form, patch)),

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
        mutate(draft => void Object.assign(draft, parsed))
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
