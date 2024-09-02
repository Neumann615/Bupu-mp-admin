import {ColorPicker, FloatButton} from "antd"
import React, {useEffect, useRef, useState} from "react"
import {flushSync} from "react-dom"
import {Icon} from "@/components"
import {useThemeSettingStore, useThemeStore} from "@/store"
import {themeColorList} from "@/utils"
import "./view-transition.css"

export function ThemeSetting() {
    const [open, setOpen] = useState(false)
    const themeStore = useThemeStore()
    const themeSettingStore: any = useThemeSettingStore()
    const darkBtnRef = useRef<any>()

    function toggleDarkMode() {
        if (
            !darkBtnRef.current ||
            !document.startViewTransition
        ) {
            useThemeStore.setState({darkMode: !themeStore.darkMode})
            return
        }
        const {top, left, width, height} = darkBtnRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const right = window.innerWidth - left
        const bottom = window.innerHeight - top
        const maxRadius = Math.hypot(
            Math.max(left, right),
            Math.max(top, bottom),
        )
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                useThemeStore.setState({darkMode: !themeStore.darkMode})
            })
        })
        transition.ready.then(() => {
            let clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
            ]
            let clipPath2 = [
                `circle(${maxRadius}px at ${x}px ${y}px)`,
                `circle(0px at ${x}px ${y}px)`,
            ]
            document.documentElement.animate(
                {
                    clipPath: !themeStore.darkMode ? clipPath : clipPath2
                },
                {
                    duration: 600,
                    easing: 'ease-in',
                    pseudoElement: !themeStore.darkMode ? '::view-transition-new(root)' : '::view-transition-old(root)',
                }
            )
        })
    }

    useEffect(() => {
        if (themeStore.darkMode) {
            document.documentElement.setAttribute('theme', 'dark')
        } else {
            document.documentElement.removeAttribute('theme')
        }
    }, [themeStore.darkMode]);

    return themeSettingStore.isEnable ? <FloatButton.Group
        onClick={() => {
            setOpen(!open)
        }}
        tooltip={"主题编辑器"}
        trigger={"click"}
        open={open}
        style={{right: 24}}
        icon={<Icon name={"Theme"}/>}
    >
        {themeSettingStore.isEnableThemeColor ?
            <FloatButton tooltip={<div>自定义主题色</div>}
                         icon={<ColorPicker
                             onChange={(v: any, color: string) => {
                                 useThemeStore.setState({themeColor: color})
                             }}
                             arrow={false}
                             defaultValue={themeStore.themeColor}
                             placement={"topLeft"}
                             presets={[{colors: themeColorList}]}
                             children={<Icon name={"Platte"}/>}></ColorPicker>}></FloatButton> : null}
        {themeSettingStore.isEnableDarkMode ?
            <FloatButton
                ref={darkBtnRef}
                tooltip={<div>暗黑模式</div>}
                type={themeStore.darkMode ? "primary" : "default"}
                onClick={toggleDarkMode}
                icon={<Icon name={"Moon"}/>}/> : null}
        {themeSettingStore.isEnableCompactMode ?
            <FloatButton
                tooltip={<div>紧凑模式</div>}
                type={themeStore.compactMode ? "primary" : "default"}
                onClick={() => {
                    useThemeStore.setState({compactMode: !themeStore.compactMode})
                }} icon={<Icon name={"OverallReduction"}/>}/>
            : null}
        {themeSettingStore.isEnableHappyEffect ?
            <FloatButton
                tooltip={<div>{"快乐工作特效" + (themeStore.happyEffect ? "关闭" : "开启")}</div>}
                type={themeStore.happyEffect ? "primary" : "default"} onClick={() => {
                useThemeStore.setState({happyEffect: !themeStore.happyEffect})
            }}
                icon={<Icon name={"SmilingFaceWithSquintingEyes"}/>}/> : null}
    </FloatButton.Group> : null
}