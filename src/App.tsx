import {ConfigProvider, theme} from "antd"
import React, {Suspense, useMemo} from "react"
import {Navigate, useRoutes} from "react-router"
import {useAppStore, useThemeStore} from "@/store"
import {HappyProvider} from '@ant-design/happy-work-theme'
import {useLocation} from 'react-router-dom'
import {StyleProvider} from "antd-style"
import routes from '~react-pages'
import "./App.css"

//路由守卫
function RouteGuard(props) {
    if (localStorage.getItem("token")) {
        return props.children
    } else {
        return <Navigate to="/login"/>
    }
}

for (let i = 0; i < routes.length; i++) {
    if (routes[i].meta?.auth) {
        routes[i].element = <RouteGuard>{routes[i].element}</RouteGuard>
    }
}

export default function App() {
    let appStore = useAppStore()
    let themeStore = useThemeStore()
    let location = useLocation()
    let globalAlgorithm = useMemo(() => {
        let globalAlgorithmData = []
        if (themeStore.darkMode) {
            globalAlgorithmData.push(theme.darkAlgorithm)
        }
        if (themeStore.compactMode) {
            globalAlgorithmData.push(theme.compactAlgorithm)
        }
        return globalAlgorithmData
    }, [themeStore.darkMode, themeStore.compactMode])

    // useEffect(() => {
    //     console.log("路由变化了")
    //     appStore.startGlobalProgressLoading()
    //     setTimeout(() => {
    //         appStore.stopGlobalProgressLoading()
    //     }, 2500)
    // }, [location])

    return <StyleProvider prefix={appStore.styleClassNamePrefix.toLocaleLowerCase()}>
        <ConfigProvider theme={{algorithm: globalAlgorithm, token: {colorPrimary: themeStore.themeColor}}}>
            <HappyProvider disabled={!themeStore.happyEffect}>
                <Suspense fallback={<p>Loading...</p>}>
                    {useRoutes(routes)}
                </Suspense>
            </HappyProvider>
        </ConfigProvider>
    </StyleProvider>
}