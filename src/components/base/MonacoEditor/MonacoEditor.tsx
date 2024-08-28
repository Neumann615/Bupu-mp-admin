import React, {useState} from 'react'
import MonacoEditor from 'react-monaco-editor'
//导入语言包
import "monaco-editor/esm/vs/basic-languages/monaco.contribution"
//支持主题切换
import {useThemeStore} from "@/store"
import {createStyles} from "antd-style"

const useStyles = createStyles(({token, css}) => ({
    markdown: css`
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: ${token.paddingMD}px;
      gap: ${token.paddingMD}px;
    `
}))


interface MonacoEditorProps {

}

export function MonacoEditor() {
    const {styles, theme} = useStyles()
    const themeStore = useThemeStore()
    const [code, setCode] = useState("")
    return <MonacoEditor
        width="50%"
        height="100%"
        language={"markdown"}
        value={code}
        theme={themeStore.darkMode ? "vs-dark" : ""}
        onChange={setCode}
        options={{}}
    />
}
