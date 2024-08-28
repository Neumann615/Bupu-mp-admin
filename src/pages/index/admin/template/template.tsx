import React from 'react';
import {createStyles} from "antd-style"
import {Input} from "antd"

const useStyles = createStyles(({token, css}) => ({
    container: css`
        width: 100%;
        height: 100%;
     
        display: flex;
        flex-direction: column;
    `,
    header: css`
        box-sizing: border-box;
        padding: ${token.paddingMD}px;
    `,
    main: css`
        flex: 1;
        height: 1px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: ${token.marginMD}px;
        box-sizing: border-box;
        padding: 0 ${token.paddingMD}px ${token.paddingMD}px ${token.paddingMD}px;
        overflow-y: scroll;
    `,
    mainItem:css`
        background-color: ${token.colorPrimary};
        //aspect-ratio: 375/580;
        border-radius: ${token.borderRadiusLG}px;
        max-height: 600px;
    `
}))

function Template() {
    const {styles, theme} = useStyles()
    return <div className={styles.container}>
        <div className={styles.header}>
            <Input></Input>
        </div>
        <div className={styles.main}>
            <div className={styles.mainItem}></div>
            <div className={styles.mainItem}></div>
            <div className={styles.mainItem}></div>
        </div>
    </div>
}

export default Template;
