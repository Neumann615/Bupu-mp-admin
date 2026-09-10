import type { FieldSchema } from '../../types/schema'
import { uniqueId } from '../../utils/uniqueId'

/** 生成字段组件的默认 schema */
export function fieldSchema(type: string, label: string, props: Record<string, any> = {}): FieldSchema {
  return { id: uniqueId(), type, field: uniqueId(), label, props }
}

/** 生成容器/辅助组件的默认 schema（无 field） */
export function bareSchema(type: string, props: Record<string, any> = {}, children?: FieldSchema[]): FieldSchema {
  return { id: uniqueId(), type, props, children }
}

/** 生成值绑定容器的默认 schema（带 field：嵌套对象 / 数组容器） */
export function groupSchema(type: string, label: string, props: Record<string, any> = {}, children?: FieldSchema[]): FieldSchema {
  return { id: uniqueId(), type, field: uniqueId(), label, props, children }
}
