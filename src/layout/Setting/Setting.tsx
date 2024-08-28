import {createStyles} from "antd-style"
import {Icon} from "@/components"
import {Alert, Checkbox, Col, Divider, Drawer, Input, Radio, Row, Select, Switch, Button, Tooltip} from "antd"
import {
    breadcrumbStyleList,
    defaultSetting as _defaultSetting,
    storageTypeList,
    tabBarPositionList,
    tabBarStyleList,
    themeColorList,
    topBarPositionList,
    transitionTypeList,
    menuTypeList
} from "@/utils"
import {
    useAppStore,
    useBreadcrumbStore,
    useCopyrightStore,
    useHomePageStore,
    useMainPageStore,
    useMenuStore,
    useTabBarStore,
    useThemeSettingStore,
    useThemeStore,
    useToolbarStore,
    useTopBarStore
} from "@/store";
import {useEffect, useState} from "react"
//@ts-ignore
import {CSSTransition} from "react-transition-group"
import {useInterval, useUnmount} from "ahooks"
import React from "react";

const useStyles = createStyles(({token, css}) => {
    return {
        setting: css`
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0;
          top: 50%;
          box-sizing: border-box;
          background-color: ${token.colorPrimary};
          border-radius: ${token.borderRadius};
          cursor: pointer;
          border-radius: 8px 0 0 8px;
          z-index: 99999;
        `,
        configContainer: css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        `,
        configContent: css`
          flex: 1;
          height: 1px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px 20px;
        `,
        configButton: css`
          width: 100%;
          box-sizing: border-box;
          padding: 8px 16px;
        `,
        configItem: css`
          box-sizing: border-box;
          margin-bottom: 12px;
          height: 44px;
          line-height: 44px;
          color: ${token.colorText}
        `,
        menuType: css`
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        `,
        themeItem: css`
          width: 12%;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        `,
        themeItemColor: css`
          width: 20px;
          height: 20px;
          border-radius: 50%;
        `,
        checkedIcon: css`
          position: absolute;
          bottom: 0px;
          right: 0px;
          width: 100%;
          height: 100%;
          border: 2px solid ${token.colorPrimaryBorder};
          border-radius: ${token.borderRadius}px;
        `,
        unCheckedIcon: css`
          position: absolute;
          bottom: 0px;
          right: 0px;
          width: 100%;
          height: 100%;
          border: 2px solid ${token.colorBorderSecondary};
          border-radius: ${token.borderRadius}px;
        `,
        transitionContainer: css`
          width: 20%;
          aspect-ratio: 1.35;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${token.boxShadow};
          box-sizing: border-box;
          position: relative;
          padding: 12px;
          border-radius: ${token.borderRadius}px;
        `,
        transitionContent: css`
          width: 100%;
          height: 100%;
          border-radius: ${token.borderRadius}px;
          background-color: ${token.colorPrimaryBg};
        `,
        layoutContainer: css`
          width: 20%;
          aspect-ratio: 1.35;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${token.boxShadow};
          box-sizing: border-box;
          padding: 8px;
          border-radius: ${token.borderRadius}px;
          position: relative;
        `,
        layoutContent: css`
          width: 100%;
          height: 100%;
          border-radius: ${token.borderRadiusSM}px;
          overflow: hidden;
        `,
        resetDrawer: css`
          .ant-drawer-body {
            padding: 0px;
          } `
    }
})

type LayoutType = "side" | "only-side" | "head" | "only-head" | "simple"

function mergeAttribute(obj1: any, obj2: any) {
    for (const key in obj1) {
        obj1[key] = obj2[key]
    }
    return obj1
}

export function Setting() {
    const appStore = useAppStore()
    const breadcrumbStore = useBreadcrumbStore()
    const copyrightStore = useCopyrightStore()
    const homePageStore = useHomePageStore()
    const mainPageStore = useMainPageStore()
    const menuStore = useMenuStore()
    const tabBarStore = useTabBarStore()
    const themeStore = useThemeStore()
    const themeSettingStore = useThemeSettingStore()
    const toolbarStore = useToolbarStore()
    const topBarStore = useTopBarStore()
    const {styles, cx, theme} = useStyles()
    const [open, setOpen] = useState(false)
    const [defaultSetting, setDefaultSetting] = useState({
        app: mergeAttribute(_defaultSetting.app, appStore),
        theme: mergeAttribute(_defaultSetting.theme, themeStore),
        themeSetting: mergeAttribute(_defaultSetting.themeSetting, themeSettingStore),
        homePage: mergeAttribute(_defaultSetting.homePage, homePageStore),
        menu: mergeAttribute(_defaultSetting.menu, menuStore),
        mainPage: mergeAttribute(_defaultSetting.mainPage, mainPageStore),
        copyright: mergeAttribute(_defaultSetting.copyright, copyrightStore),
        topBar: mergeAttribute(_defaultSetting.topBar, topBarStore),
        toolbar: mergeAttribute(_defaultSetting.toolbar, toolbarStore),
        breadcrumb: mergeAttribute(_defaultSetting.breadcrumb, breadcrumbStore),
        tabBar: mergeAttribute(_defaultSetting.tabBar, tabBarStore)
    })
    const [isTransition, setIsTransition] = useState(false)

    const showDrawer = () => {
        setOpen(true)
    }
    const onClose = () => {
        setOpen(false)
    }

    function renderLayout(type: LayoutType) {
        if (type === "side") {
            return <div style={{width: "100%", height: "100%", display: "flex", gap: 4}}>
                <div style={{width: "20%", height: "100%", backgroundColor: theme.colorPrimary}}></div>
                <div style={{width: "20%", height: "100%", backgroundColor: theme.colorPrimaryBgHover}}></div>
                <div style={{
                    flex: 1,
                    height: "100%",
                    border: "2px dashed " + theme.colorPrimaryBorder,
                    backgroundColor: theme.colorPrimaryBg
                }}></div>
            </div>
        } else if (type === "only-side") {
            return <div style={{width: "100%", height: "100%", display: "flex", gap: 4}}>
                <div style={{width: "20%", height: "100%", backgroundColor: theme.colorPrimary}}></div>
                <div style={{
                    flex: 1,
                    height: "100%",
                    border: "2px dashed " + theme.colorPrimaryBorder,
                    backgroundColor: theme.colorPrimaryBg
                }}></div>
            </div>
        } else if (type === "head") {
            return <div style={{width: "100%", height: "100%", display: "flex", gap: 4, flexDirection: "column"}}>
                <div style={{width: "100%", height: "23%", backgroundColor: theme.colorPrimary}}></div>
                <div style={{flex: 1, height: "1px", display: "flex", gap: 4}}>
                    <div style={{width: "20%", height: "100%", backgroundColor: theme.colorPrimaryBgHover}}></div>
                    <div style={{
                        flex: 1,
                        height: "100%",
                        border: "2px dashed " + theme.colorPrimaryBorder,
                        backgroundColor: theme.colorPrimaryBg
                    }}></div>
                </div>
            </div>
        } else if (type === "only-head") {
            return <div style={{width: "100%", height: "100%", display: "flex", gap: 4, flexDirection: "column"}}>
                <div style={{width: "100%", height: "23%", backgroundColor: theme.colorPrimary}}></div>
                <div style={{
                    flex: 1,
                    height: "1px",
                    width: "100%",
                    border: "2px dashed " + theme.colorPrimaryBorder,
                    backgroundColor: theme.colorPrimaryBg
                }}></div>
            </div>
        } else if (type === "simple") {
            return <div style={{width: "100%", height: "100%", display: "flex", gap: 4}}>
                <div style={{width: "20%", height: "100%", backgroundColor: theme.colorPrimaryBgHover}}></div>
                <div style={{
                    flex: 1,
                    height: "100%",
                    border: "2px dashed " + theme.colorPrimaryBorder,
                    backgroundColor: theme.colorPrimaryBg
                }}></div>
            </div>
        }

    }

    useEffect(() => {
        useAppStore.setState(defaultSetting.app)
        useThemeStore.setState(defaultSetting.theme)
        useThemeSettingStore.setState(defaultSetting.themeSetting)
        useMenuStore.setState(defaultSetting.menu)
        useHomePageStore.setState(defaultSetting.homePage)
        useMainPageStore.setState(defaultSetting.mainPage)
        useCopyrightStore.setState(defaultSetting.copyright)
        useTopBarStore.setState(defaultSetting.topBar)
        useToolbarStore.setState(defaultSetting.toolbar)
        useBreadcrumbStore.setState(defaultSetting.breadcrumb)
        useTabBarStore.setState(defaultSetting.tabBar)
    }, [defaultSetting])

    useEffect(() => {
        setDefaultSetting({
            app: mergeAttribute(_defaultSetting.app, appStore),
            theme: mergeAttribute(_defaultSetting.theme, themeStore),
            themeSetting: mergeAttribute(_defaultSetting.themeSetting, themeSettingStore),
            homePage: mergeAttribute(_defaultSetting.homePage, homePageStore),
            menu: mergeAttribute(_defaultSetting.menu, menuStore),
            mainPage: mergeAttribute(_defaultSetting.mainPage, mainPageStore),
            copyright: mergeAttribute(_defaultSetting.copyright, copyrightStore),
            topBar: mergeAttribute(_defaultSetting.topBar, topBarStore),
            toolbar: mergeAttribute(_defaultSetting.toolbar, toolbarStore),
            breadcrumb: mergeAttribute(_defaultSetting.breadcrumb, breadcrumbStore),
            tabBar: mergeAttribute(_defaultSetting.tabBar, tabBarStore)
        })
    }, [open])

    const clearInterval = useInterval(() => {
        setIsTransition(!isTransition)
    }, 3000, {immediate: true})

    useUnmount(() => {
        clearInterval()
    })

    return <div className={styles.setting}>
        <Icon className={"infinite-rotate"} name={"Config"} size={28} fill={"#fff"} onClick={showDrawer}></Icon>
        <Drawer
            rootClassName={styles.resetDrawer}
            getContainer={() => document.getElementById("root")}
            width={480}
            destroyOnClose
            title={"应用配置"} placement="right" onClose={onClose}
            open={open}>
            <div className={styles.configContainer}>
                <div className={styles.configContent}>
                    <Alert
                        type={"error"}
                        message={"应用配置可实时预览效果，但只是临时生效，要想真正作用于项目，可以点击下方的“复制配置”按钮，并将配置粘贴到 src/defaultSettings.ts 文件中。同时建议在生产环境隐藏应用配置功能。"}></Alert>
                    <Divider>应用</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            生产环境启用全局配置
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.app.isEnableProductionAppSetting}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            app: {...defaultSetting.app, isEnableProductionAppSetting: v}
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            开启记忆功能
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.app.isEnableMemory} onChange={(v: boolean) => {
                                setDefaultSetting({...defaultSetting, app: {...defaultSetting.app, isEnableMemory: v}})
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            开启全局页面加载
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.app.isEnablePageLoadProgress}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            app: {
                                                ...defaultSetting.app,
                                                isEnablePageLoadProgress: v
                                            }
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            开启收藏功能
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.app.isEnableFavorite} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    app: {...defaultSetting.app, isEnableFavorite: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Divider>主题</Divider>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            marginBottom: 12
                        }}>
                        {themeColorList.map((color: string) => {
                            return <div
                                key={color}
                                onClick={() => {
                                    setDefaultSetting({
                                        ...defaultSetting,
                                        theme: {...defaultSetting.theme, themeColor: color}
                                    })
                                }} className={styles.themeItem}>
                                <div className={styles.themeItemColor} style={{backgroundColor: color}}></div>
                                <div
                                    className={defaultSetting.theme.themeColor === color ? styles.checkedIcon : styles.unCheckedIcon}></div>
                            </div>
                        })}
                    </div>

                    <Row align={"middle"} justify={"center"} className={styles.configItem}>
                        <Col>
                            <Checkbox.Group
                                defaultValue={[(defaultSetting.theme.darkMode ? "dark" : "", defaultSetting.theme.compactMode ? "compact" : "", defaultSetting.theme.happyEffect ? "happy" : "")]}
                                onChange={(v: any) => {
                                    setDefaultSetting({
                                        ...defaultSetting, theme: {
                                            ...defaultSetting.theme,
                                            darkMode: v.includes("dark"),
                                            compactMode: v.includes("compact"),
                                            happyEffect: v.includes("happy")
                                        }
                                    })
                                }} options={[
                                {
                                    label: "暗黑模式",
                                    value: "dark"
                                },
                                {
                                    label: "紧凑模式",
                                    value: "compact"
                                },
                                {
                                    label: "快乐特效",
                                    value: "happy"
                                }
                            ]}></Checkbox.Group>
                        </Col>
                    </Row>
                    <Divider>主题编辑器</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用主题编辑器
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.themeSetting.isEnable} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    themeSetting: {...defaultSetting.themeSetting, isEnable: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用自定义主题色
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.themeSetting.isEnableThemeColor}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            themeSetting: {...defaultSetting.themeSetting, isEnableThemeColor: v}
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用暗黑模式
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.themeSetting.isEnableDarkMode}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            themeSetting: {...defaultSetting.themeSetting, isEnableDarkMode: v}
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用紧凑模式
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.themeSetting.isEnableCompactMode}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            themeSetting: {...defaultSetting.themeSetting, isEnableCompactMode: v}
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用快乐特效
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.themeSetting.isEnableHappyEffect}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            themeSetting: {...defaultSetting.themeSetting, isEnableHappyEffect: v}
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Divider>页面过渡动画</Divider>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                            marginBottom: 12
                        }}>
                        {transitionTypeList.map((transition: any, index: number) => {
                            return <Tooltip title={transition.label} key={index}>
                                <div className={styles.transitionContainer} onClick={() => {
                                    setDefaultSetting({
                                        ...defaultSetting,
                                        mainPage: {...defaultSetting.mainPage, transitionType: transition.value}
                                    })
                                }}>
                                    <CSSTransition
                                        timeout={800}
                                        in={isTransition}
                                        unmountOnExit
                                        classNames={transition.classNames}>
                                        <div className={styles.transitionContent}>
                                        </div>
                                    </CSSTransition>
                                    {defaultSetting.mainPage.transitionType === transition.value ?
                                        <div className={styles.checkedIcon}></div> : null}
                                </div>
                            </Tooltip>
                        })}
                    </div>
                    <Divider>导航模式</Divider>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                            marginBottom: 12
                        }}>
                        {menuTypeList.map((item: any, index: number) => {
                            return <Tooltip title={item.label} key={index}>
                                <div className={styles.layoutContainer} onClick={() => {
                                    setDefaultSetting({
                                        ...defaultSetting,
                                        menu: {...defaultSetting.menu, menuType: item.value}
                                    })
                                }}>
                                    {defaultSetting.menu.menuType === item.value ?
                                        <div className={styles.checkedIcon}></div> : null}
                                    <div className={styles.layoutContent}>
                                        {renderLayout(item.value)}
                                    </div>
                                </div>
                            </Tooltip>
                        })}
                    </div>
                    <Divider>导航栏</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            次导航手风琴模式
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.menu.subMenuUniqueOpened} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    menu: {...defaultSetting.menu, subMenuUniqueOpened: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用次导航折叠按钮
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.menu.isEnableSubMenuCollapse}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            menu: {...defaultSetting.menu, isEnableSubMenuCollapse: v}
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            次导航折叠
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.menu.subMenuCollapse} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    menu: {...defaultSetting.menu, subMenuCollapse: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Divider>面包屑导航</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.breadcrumb.isEnable} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    breadcrumb: {...defaultSetting.breadcrumb, isEnable: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            是否显示主导航
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.breadcrumb.isEnableMainNav}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            breadcrumb: {...defaultSetting.breadcrumb, isEnableMainNav: v}
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            风格
                        </Col>
                        <Col>
                            <Radio.Group value={defaultSetting.breadcrumb.style} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    breadcrumb: {...defaultSetting.breadcrumb, style: v.target.value}
                                })
                            }}>
                                {breadcrumbStyleList.map((item, index: number) => {
                                    return <Radio.Button key={index} value={item.value}>{item.label}</Radio.Button>
                                })}
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Divider>顶栏</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.topBar.isEnable} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    topBar: {...defaultSetting.topBar, isEnable: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            定位
                        </Col>
                        <Col>
                            <Radio.Group value={defaultSetting.topBar.position} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    topBar: {...defaultSetting.topBar, position: v.target.value}
                                })
                            }}>
                                {topBarPositionList.map((item) => {
                                    return <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>
                                })}
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Divider>工具栏</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.toolbar.isEnable} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    toolbar: {...defaultSetting.toolbar, isEnable: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用搜索
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.toolbar.isEnableSearch} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    toolbar: {...defaultSetting.toolbar, isEnableSearch: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用国际化
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.toolbar.isEnableI18n} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    toolbar: {...defaultSetting.toolbar, isEnableI18n: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用页面重载
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.toolbar.isEnablePageReload}
                                    onChange={(v: boolean) => {
                                        setDefaultSetting({
                                            ...defaultSetting,
                                            toolbar: {...defaultSetting.toolbar, isEnablePageReload: v}
                                        })
                                    }}></Switch>
                        </Col>
                    </Row>
                    <Divider>标签栏</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.tabBar.isEnable} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    tabBar: {...defaultSetting.tabBar, isEnable: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            显示图标
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.tabBar.showIcon} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    tabBar: {...defaultSetting.tabBar, showIcon: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            样式风格
                        </Col>
                        <Col>
                            <Radio.Group value={defaultSetting.tabBar.style} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    tabBar: {...defaultSetting.tabBar, style: v.target.value}
                                })
                            }}>
                                {tabBarStyleList.map((item) => {
                                    return <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>
                                })}
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            定位
                        </Col>
                        <Col>
                            <Radio.Group value={defaultSetting.tabBar.position} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    tabBar: {...defaultSetting.tabBar, position: v.target.value}
                                })
                            }}>
                                {tabBarPositionList.map((item) => {
                                    return <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>
                                })}
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Divider>主页</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.homePage.isEnable} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    homePage: {...defaultSetting.homePage, isEnable: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            主页名称
                        </Col>
                        <Col>
                            <Input defaultValue={defaultSetting.homePage.title} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    homePage: {...defaultSetting.homePage, title: v.target.value}
                                })
                            }}></Input>
                        </Col>
                    </Row>
                    <Divider>版权信息</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            启用
                        </Col>
                        <Col>
                            <Switch defaultChecked={defaultSetting.copyright.isEnable} onChange={(v: boolean) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    copyright: {...defaultSetting.copyright, isEnable: v}
                                })
                            }}></Switch>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            日期
                        </Col>
                        <Col>
                            <Input defaultValue={defaultSetting.copyright.date} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    copyright: {...defaultSetting.copyright, date: v.target.value}
                                })
                            }}></Input>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            公司
                        </Col>
                        <Col>
                            <Input defaultValue={defaultSetting.copyright.company} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    copyright: {...defaultSetting.copyright, company: v.target.value}
                                })
                            }}></Input>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            网址
                        </Col>
                        <Col>
                            <Input defaultValue={defaultSetting.copyright.website} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    copyright: {...defaultSetting.copyright, website: v.target.value}
                                })
                            }}></Input>
                        </Col>
                    </Row>
                    <Divider>其他</Divider>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            项目名称
                        </Col>
                        <Col>
                            <Input defaultValue={defaultSetting.app.name} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    app: {...defaultSetting.app, name: v.target.value}
                                })
                            }}></Input>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            logo
                        </Col>
                        <Col>
                            <Input defaultValue={defaultSetting.app.logo} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    app: {...defaultSetting.app, logo: v.target.value}
                                })
                            }}></Input>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            客户端存储方式
                        </Col>
                        <Col>
                            <Select defaultValue={defaultSetting.app.storageType} onChange={(v: string) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    app: {...defaultSetting.app, storageType: v}
                                })
                            }} style={{width: 110}} options={storageTypeList}></Select>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            本地存储前缀
                        </Col>
                        <Col>
                            <Input defaultValue={defaultSetting.app.storagePrefix} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    app: {...defaultSetting.app, storagePrefix: v.target.value}
                                })
                            }}></Input>
                        </Col>
                    </Row>
                    <Row align={"middle"} className={styles.configItem}>
                        <Col flex={1}>
                            样式类名前缀
                        </Col>
                        <Col>
                            <Input defaultValue={defaultSetting.app.styleClassNamePrefix} onChange={(v: any) => {
                                setDefaultSetting({
                                    ...defaultSetting,
                                    app: {...defaultSetting.app, styleClassNamePrefix: v.target.value}
                                })
                            }}></Input>
                        </Col>
                    </Row>
                </div>
                <div className={styles.configButton}>
                    <Button size={"large"} style={{width: "100%"}} type={"primary"}>复制配置</Button>
                </div>
            </div>
        </Drawer>
    </div>
}