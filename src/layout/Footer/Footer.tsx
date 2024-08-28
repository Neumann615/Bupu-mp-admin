import React from 'react'
import { createStyles } from "antd-style"
import { useCopyrightStore } from '@/store'

const useStyles = createStyles(({ token, css }) => ({
    footer: {
        width: "100%",
        height: "42px",
        lineHeight: "42px",
        boxSizing: "border-box",
        color: token.colorTextSecondary,
        textAlign: "center",
        backgroundColor: token.colorBgContainer,
        fontSize: token.fontSizeSM
    },
    company: css`
    margin-left:${token.marginXS}px;
    `,
    website: css`
    transition: all .2s;
     cursor:pointer;
     :hover{
        transition: all .2s;
        color:${token.colorTextBase};
     }
    `
}))

export function Footer() {
    const { isEnable, date, company, website } = useCopyrightStore()
    const { styles } = useStyles()
    return isEnable ? <div className={styles.footer}>
        <span>Copyright © {date}-{new Date().getFullYear()}</span>
        <span onClick={() => {
            if (!website?.length) return
            window.open(website)
        }} className={styles["company"] + " " + (website?.length ? styles["website"] : "")} >{company}版权所有</span>
    </div> : null
}