import {ConfigProvider} from "antd"
import {createStyles} from "antd-style"
import React from 'react'
import {useLocation} from "react-router-dom"
import {Content} from "@/layout/Content/Content"
import {Footer} from "@/layout/Footer/Footer"
import {GlobalProgress} from "@/layout/GlobalProgress/GlobalProgress"
import {Header} from "@/layout/Header/Header"
import {MainNav} from "@/layout/MainNav/MainNav"
import {Menu} from "@/layout/Menu/Menu"
import {Setting} from "@/layout/Setting/Setting"
import {useAppStore, useMenuStore} from "@/store"
import {ThemeSetting} from "./ThemeSetting/ThemeSetting"


const useStyles = createStyles(({token, css}) => ({
    //侧边栏模式布局
    layoutContainerStyle: {
        display: "flex",
        width: "100%",
        height: "100vh"
    },
    layoutSiderStyle: {
        width: "auto",
        display: "flex"
    },
    layoutMainStyle: {
        flex: 1,
        width: "1px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        // boxShadow: token.boxShadowSecondary,
    },
    //顶部模式布局
    headContainer: {
        display: "flex",
        width: "100%",
        height: "100vh",
        flexDirection: "column"
    },
    headTop: {
        width: "100%",
        height: 'auto',
    },
    headContent: {
        flex: 1,
        height: "1px",
        display: 'flex'
    },
    headContentMenu: {
        width: "auto",
        height: "100%",
        backgroundColor: token.colorBgContainer
    },
    headContentMain: {
        height: "100%",
        flex: 1,
        width: "1px",
        display: "flex",
        flexDirection: "column",
        //boxShadow: token.boxShadowSecondary
    },
    onlyHeadContent: {
        flex: 1,
        height: "1px",
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    //精简模式布局
    singleMain: {
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    singleMainLeft: {
        width: 'auto',
        height: "100%",
        backgroundColor: token.colorBgContainer
    },
    singleMainContent: {
        flex: 1,
        width: "1px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        //boxShadow: token.boxShadowSecondary
    }
}))

export function Layout() {

    const {styles, theme} = useStyles()
    const {menuType} = useMenuStore()
    const {globalProgressLoading} = useAppStore()
    const location = useLocation()

    function renderLayout() {
        if (menuType === "side") {
            return <div className={styles.layoutContainerStyle}>
                <div className={styles.layoutSiderStyle}>
                    <MainNav></MainNav>
                    <Menu></Menu>
                </div>
                <div className={styles.layoutMainStyle}>
                    <Header></Header>
                    <Content></Content>
                    <Footer></Footer>
                </div>
            </div>
        } else if (menuType === "only-side") {
            return <div className={styles.layoutContainerStyle}>
                <div className={styles.layoutSiderStyle}>
                    <MainNav></MainNav>
                </div>
                <div className={styles.layoutMainStyle}>
                    <Header></Header>
                    <Content></Content>
                    <Footer></Footer>
                </div>
            </div>
        } else if (menuType === "head") {
            return <div className={styles.headContainer}>
                <div className={styles.headTop}>
                    <MainNav></MainNav>
                </div>
                <div className={styles.headContent}>
                    <div className={styles.headContentMenu}>
                        <Menu></Menu>
                    </div>
                    <div className={styles.headContentMain}>
                        <Header></Header>
                        <Content></Content>
                    </div>
                </div>
            </div>
        } else if (menuType === "only-head") {
            return <div className={styles.headContainer}>
                <div className={styles.headTop}>
                    <MainNav></MainNav>
                </div>
                <div className={styles.onlyHeadContent}>
                    <Header></Header>
                    <Content></Content>
                </div>
            </div>
        } else if (menuType === "simple") {
            return <div className={styles.singleMain}>
                <div className={styles.singleMainLeft}>
                    <Menu></Menu>
                </div>
                <div className={styles.singleMainContent}>
                    <Header></Header>
                    <Content></Content>
                </div>
            </div>
        }
    }

    return <ConfigProvider theme={{
        components: {
            Menu: {
                itemBg: theme.colorBgContainer,
                subMenuItemBg: theme.colorBgContainer,
                subMenuItemBorderRadius: theme.borderRadiusLG,
                itemHeight: 48,
                collapsedWidth: 64,
                dropdownWidth: 180
            },
        },
    }}>
        {renderLayout()}
        <Setting></Setting>
        <ThemeSetting></ThemeSetting>
        <GlobalProgress isAnimating={globalProgressLoading} key={location.key}></GlobalProgress>
    </ConfigProvider>
}