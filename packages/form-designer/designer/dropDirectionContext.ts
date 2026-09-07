import { createContext, use } from 'react'

/**
 * 容器内间隙落点（DropGap）的方向：
 * - vertical（默认）：8px 水平条，用于常规纵向流
 * - horizontal：0 宽的垂直落点条，用于 row / 水平 space、flex，
 *   避免落点成为占宽的 flex item 挤压栅格/间距布局
 */
export const DropDirectionContext = createContext<'vertical' | 'horizontal'>('vertical')

export function useDropDirection() {
  return use(DropDirectionContext)
}
