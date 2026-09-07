import { useDroppable } from '@dnd-kit/react'
import { createStyles } from 'antd-style'

const useStyles = createStyles(({ token, css }) => ({
  gap: css`
    height: 8px;
    border-radius: 2px;
    transition: background 0.15s;
  `,
  active: css`
    background: ${token.colorPrimary};
    height: 3px;
    margin: 2.5px 0;
  `,
  /** 容器空态落点：更大的虚线区域 */
  empty: css`
    height: 56px;
    border: 1px dashed ${token.colorBorder};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
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
}

export function DropGap({ parentId, index, empty }: DropGapProps) {
  const { styles, cx } = useStyles()
  const { ref, isDropTarget } = useDroppable({
    id: `gap-${parentId ?? 'root'}-${index}`,
    data: { parentId, index },
  })

  if (empty) {
    return (
      <div ref={ref} className={cx(styles.empty, isDropTarget && styles.emptyActive)}>
        拖拽组件到此处
      </div>
    )
  }
  return <div ref={ref} className={cx(styles.gap, isDropTarget && styles.active)} />
}
