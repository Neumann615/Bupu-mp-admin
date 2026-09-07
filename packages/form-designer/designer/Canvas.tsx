import { Form } from 'antd'
import { createStyles } from 'antd-style'
import { CanvasItem } from './CanvasItem'
import { DropGap } from './DropGap'
import { useDesignerStore } from './store'

const useStyles = createStyles(({ token, css }) => ({
  canvas: css`
    max-width: 900px;
    margin: 0 auto;
    min-height: 100%;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    padding: ${token.paddingLG}px;
    box-shadow: ${token.boxShadowTertiary};
  `,
  empty: css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: ${token.colorTextTertiary};
    border: 1px dashed ${token.colorBorder};
    border-radius: ${token.borderRadiusLG}px;
  `,
}))

export function Canvas() {
  const { styles } = useStyles()
  const schema = useDesignerStore(s => s.schema)
  const select = useDesignerStore(s => s.select)

  return (
    <div className={styles.canvas} onClick={() => select(null)}>
      <Form {...schema.form} component={false}>
        {schema.children.length === 0
          ? (
              <div className={styles.empty}>
                <DropGap parentId={null} index={0} empty />
              </div>
            )
          : (
              <>
                {schema.children.map((c, i) => (
                  <span key={c.id} style={{ display: 'contents' }}>
                    <DropGap parentId={null} index={i} />
                    <CanvasItem node={c} />
                  </span>
                ))}
                <DropGap parentId={null} index={schema.children.length} />
              </>
            )}
      </Form>
    </div>
  )
}
