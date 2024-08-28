import {ColorPicker, FloatButton} from "antd"
import {Icon} from "@/components"
import {useThemeSettingStore, useThemeStore} from "@/store"
import {themeColorList} from "@/utils"
import {useEffect, useState} from "react"

let lastClick

export function ThemeSetting() {
    const [open, setOpen] = useState(false)
    const themeStore = useThemeStore()
    const themeSettingStore = useThemeSettingStore()

    function spaNavigate(e) {
        lastClick = event
        // Fallback for browsers that don’t support this API:
        if (!document.startViewTransition) {
            useThemeStore.setState({darkMode: !themeStore.darkMode})
            return;
        }
        // Get the click position, or fallback to the middle of the screen
        const x = lastClick?.clientX ?? innerWidth / 2;
        const y = lastClick?.clientY ?? innerHeight / 2;
        // Get the distance to the furthest corner
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
        );
        // Create a transition:
        const transition = document.startViewTransition(() => {
            useThemeStore.setState({darkMode: !themeStore.darkMode})
        });
        // Wait for the pseudo-elements to be created:
        transition.ready.then(() => {
            // Animate the root’s new view
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0 at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 600,
                    easing: "ease-in",
                    // Specify which pseudo-element to animate
                    pseudoElement: "::view-transition-new(root)",
                },
            );
        });
    }

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
                             onChange={(v: any) => {
                                 useThemeStore.setState({themeColor: v.metaColor.originalInput})
                             }}
                             arrow={false}
                             default={themeStore.themeColor}
                             placement={"left"}
                             presets={[{colors: themeColorList}]}
                             children={<Icon name={"Platte"}/>}></ColorPicker>}></FloatButton> : null}
        {themeSettingStore.isEnableDarkMode ?
            <FloatButton
                tooltip={<div>暗黑模式</div>}
                type={themeStore.darkMode ? "primary" : "default"}
                onClick={spaNavigate} icon={<Icon name={"Moon"}/>}/> : null}
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