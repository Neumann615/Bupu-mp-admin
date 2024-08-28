import {Coordinate, CoordinatePicker} from "@/components";
import {createStyles} from "antd-style"
import {Card} from "antd"
import {useState} from "react";

const useStyles = createStyles(({token, css}) => ({
    module: css`
      overflow: hidden;
      margin-bottom: ${token.marginSM}px;
    `,
    container: css`
      padding: ${token.paddingSM}px;
    `
}))

export default () => {
    const [coords, setCoords] = useState([])
    const {styles, theme} = useStyles()
    return <div className={styles.container}>
        <Card title={"大屏使用"} className={styles.module}>
            <Coordinate></Coordinate>
        </Card>
        <Card title={"简单选择"}>
            <CoordinatePicker onChange={(v) => {
                console.log("我在变化", v)
            }} coords={coords}></CoordinatePicker>
        </Card>
    </div>
}