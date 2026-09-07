import { useDroppable } from '@dnd-kit/react'
import { createStyles } from 'antd-style'

const useStyles = createStyles(({ token, css }) => ({
  // position/z-index：压在父容器 mask（z-index:1）之上，保持间隙可见可拖放
  gap: css`
    position: relative;
    z-index: 2;
    height: 8px;
    border-radius: 2px;
    transition: background 0.15s;
  `,
  active: css`
    background: ${token.colorPrimary};
    height: 3px;
    margin: 2.5px 0;
  `,
  /** 横向落点（row / 水平 space、flex 内）：0 宽根不占布局空间，避免挤压栅格 */
  hGap: css`
    flex: 0 0 0;
    width: 0;
    align-self: stretch;
    position: relative;
    z-index: 2;
  `,
  /** 横向落点的命中/视觉层：向两侧各溢出 4px，形成 8px 命中条 */
  hHit: css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: -4px;
    right: -4px;
    border-radius: 2px;
    transition: background 0.15s;
  `,
  hActive: css`
    background: ${token.colorPrimary};
    left: -1.5px;
    right: -1.5px;
  `,
  /** 容器空态落点：更大的虚线区域 */
  empty: css`
    position: relative;
    z-index: 2;
    height: 56px;
    border: 1px dashed ${token.colorBorder};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
  `,
  /** 横向容器（row / 水平 space、flex）的空态落点：竖向块并拉伸交叉轴 */
  emptyHorizontal: css`
    width: 56px;
    height: auto;
    min-height: 56px;
    align-self: stretch;
  `,
  emptyActive: css`
    border-color: ${token.colorPrimary};
    color: ${token.colorPrimary};
    background: ${token.colorPrimaryBg};
  `,
}))

interface DropGapProps {
  parentId: string | null
  index: number
  /** 容器空态模式 */
  empty?: boolean
  /** 横向容器（row / 水平 space、flex）内的落点变体 */
  horizontal?: boolean
}

export function DropGap({ parentId, index, empty, horizontal }: DropGapProps) {
  const { styles, cx } = useStyles()
  const { ref, isDropTarget } = useDroppable({
    id: `gap-${parentId ?? 'root'}-${index}`,
    data: { parentId, index },
  })

  if (empty) {
    return (
      <div
        ref={ref}
        className={cx(
          styles.empty,
          isDropTarget && styles.emptyActive,
          horizontal && styles.emptyHorizontal,
        )}
      >
        拖拽组件到此处
      </div>
    )
  }
  // 横向：droppable ref 挂在内层命中层上（根 0 宽，碰撞矩形需非零宽高）
  if (horizontal) {
    return (
      <div className={styles.hGap}>
        <div ref={ref} className={cx(styles.hHit, isDropTarget && styles.hActive)} />
      </div>
    )
  }
  return <div ref={ref} className={cx(styles.gap, isDropTarget && styles.active)} />
}
