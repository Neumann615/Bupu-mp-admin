import {useNavigate} from "react-router"
import {useMenuStore, useTabBarStore, useBreadcrumbStore, useAppStore, useHomePageStore} from "@/store"

export function useControlTab() {
    let {mainNavData, setMenuCurrentKeys, setMainNavCurrentKeys, menuType, mainNavCurrentKeys} = useMenuStore()
    let {isEnableHomePage, homePageTitle} = useHomePageStore((state) => {
        return {
            isEnableHomePage: state.isEnable,
            homePageTitle: state.title
        }
    })
    let {tabs, setTabs, setNowTab, nowTab} = useTabBarStore()
    let {setBreadcrumbList} = useBreadcrumbStore()
    const navigate = useNavigate()

    function getPathByKey(curKey: string, data: any) {
        let result: any = [] // 记录路径结果
        let traverse = (curKey: string, path: any, data: any) => {
            if (data.length === 0) {
                return
            }
            for (let item of data) {
                path.push(item)
                if (item.key === curKey) {
                    result = JSON.parse(JSON.stringify(path))
                    return
                }
                const children = Array.isArray(item.children) ? item.children : []
                traverse(curKey, path, children) // 遍历
                path.pop() // 回溯
            }
        }
        traverse(curKey, [], data)
        return result
    }

    //打开页面
    function openTab(v: any) {
        let pathList = getPathByKey(v.key, mainNavData)
        if (v.key === "/") {
            pathList = [{
                icon: "Home",
                id: "/",
                key: "/",
                label: homePageTitle
            }]
        }
        else {
            if (isEnableHomePage) {
                pathList.unshift({
                    icon: "Home",
                    id: "/",
                    key: "/",
                    label: homePageTitle
                })
            }
        }
        if (pathList?.length) {
            //设置面包屑导航
            setBreadcrumbList(pathList)
            let _pathList = pathList.map((item: any) => item.key)
            setMainNavCurrentKeys(_pathList)
            setMenuCurrentKeys(_pathList)
            if (["side", "head"].includes(menuType)) {
                for (let i = 0; i < mainNavData.length; i++) {
                    if (mainNavData[i].key === _pathList[0]) {
                        useMenuStore.setState((store: any) => ({
                            menuData: mainNavData[i].children,
                        }))
                    }
                }
            }
            let targetRoute = pathList[pathList.length - 1]
            let tabData = {
                tabId: targetRoute.key,
                title: targetRoute.label,
                icon: targetRoute.icon,
                menuData: targetRoute
            }
            if (tabs.findIndex((tab: any) => tab.tabId === targetRoute.key) === -1) {
                tabs.push(tabData)
                setTabs(tabs)
            }
            if (tabData.tabId === nowTab.tabId) return
            setNowTab(tabData)
            navigate(v.key)
        }
    }

    type closeTabAction = "left" | "right" | "other" | "default"

    //关闭页面
    function closeTab(tabId: string, action: closeTabAction = "default") {
        let delIndex: number = -1
        let nowTabIndex: number = -1
        tabs.forEach((tabItem: any, index: number) => {
            if (tabItem.tabId === tabId) {
                delIndex = index
            }
            if (tabItem.tabId === nowTab.tabId) {
                nowTabIndex = index
            }
        })
        if (delIndex === -1) return
        if (action === "default") {
            let openIndex: number = 0
            //打开新页面,移动tab
            if (nowTab.tabId === tabId) {
                //最左边
                if (delIndex === 0) {
                    openIndex = 1
                }
                //最右边
                else if (delIndex === tabs.length - 1) {
                    openIndex = delIndex - 1
                }
                //中间
                else if (delIndex > 0 && delIndex < tabs.length - 1) {
                    openIndex = delIndex + 1
                }
                openTab(tabs[openIndex].menuData)
            }
            setTabs(tabs.filter((item: any) => item.tabId !== tabId))
        } else if (action === "left") {
            //直接删除左侧的tab
            if (nowTab.tabId !== tabId) {
                if (nowTabIndex < delIndex) {
                    openTab(tabs[delIndex].menuData)
                }
            }
            setTabs(tabs.filter((item: any, index: number) => index >= delIndex))
        } else if (action === "right") {
            if (nowTab.tabId !== tabId) {
                if (nowTabIndex > delIndex) {
                    openTab(tabs[delIndex].menuData)
                }
            }
            setTabs(tabs.filter((item: any, index: number) => index <= delIndex))
        } else if (action === "other") {
            if (nowTab.tabId !== tabId) {
                openTab(tabs[delIndex].menuData)
            }
            setTabs(tabs.filter((item: any) => item.tabId === tabId))
        }

    }

    //切换页面顺序
    function swapTab(index1: number, index2: number) {
        let arr = JSON.parse(JSON.stringify(tabs))
        let temp = arr[index1]
        arr[index1] = arr[index2]
        arr[index2] = temp
        setTabs(arr)
    }

    //固定tab页面
    function fixedTab(tabId: string) {
        let _tabs = JSON.parse(JSON.stringify(tabs))
        _tabs.forEach((tabItem: any) => {
            if (tabItem.tabId === tabId) {
                tabItem.isFixed = !tabItem.isFixed
            }
        })
        _tabs.sort((a: any, b: any) => {
            if (a.isFixed === b.isFixed) {
                return 0
            }
            return a.isFixed ? -1 : 1
        })
        setTabs(_tabs)
    }

    return {
        openTab,
        closeTab,
        swapTab,
        fixedTab
    }
}

