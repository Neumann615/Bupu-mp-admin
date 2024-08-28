import {createStyles} from "antd-style"
import templateImage from "./bg-image/bg.svg"

type LoginProps = {
    type: "template1" | "template2" | "template3",
    loginHandler: (v: {
        username: string,
        password: string
    }) => {}
}

const useStyles = createStyles(({token, css}) => ({
    template1: css`
      width: 100%;
      height: 100%;
      display: flex
    `,
    template1Left: css`
      width: 50%;
      height: 100%;
      display: grid;
      place-items: center;
    `
}))

function Login(props: LoginProps) {
    const {styles, theme} = useStyles()
    return <>
        {props.type === "template1" ? <div className={styles.template1}>
            <div className={styles.template1Left}>
                <img src={templateImage}/>
            </div>
            <div className={styles.template1Right}></div>
        </div> : null}
    </>
}