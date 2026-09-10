import { createContext, use } from 'react'

/** Form.Item / Form.List 的名路径：嵌套对象容器与数组行逐级累加 */
export type NamePath = (string | number)[]

export const NamePrefixContext = createContext<NamePath>([])

export function useNamePrefix(): NamePath {
  return use(NamePrefixContext)
}

/** 拼接名路径：无 name 时不绑定字段，空前缀时不产生新数组 */
export function joinName(prefix: NamePath, name?: string): NamePath | undefined {
  if (!name)
    return undefined
  return prefix.length ? [...prefix, name] : [name]
}
