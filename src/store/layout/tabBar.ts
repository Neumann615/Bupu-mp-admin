import {create} from 'zustand'
import defaultSetting from "@/defaultSetting";
import {persist, createJSONStorage} from 'zustand/middleware'

function setFixedTabHandler(tabs, tabId) {
    tabs.forEach((tabItem: any) => {
        if (tabItem.tabId === tabId) {
            tabItem.isFixed = !tabItem.isFixed
            console.log("更新固定", tabItem)
        }
    })
    tabs.sort((a, b) => b.isFixed - a.isFixed)
    return tabs
}

export const useTabBarStore: any = create(
    persist((set: any) => ({
        ...defaultSetting.tabBar,
        tabs: defaultSetting.homePage.isEnable ? [
            {
                menuData: {
                    icon: "Home",
                    id: "/",
                    key: "/",
                    title: defaultSetting.homePage.title
                },
                tabId: "/",
                title: defaultSetting.homePage.title,
                icon: "Home"
            }
        ] : [],
        nowTab: defaultSetting.homePage.isEnable ? {
            tabId: "/",
            title: defaultSetting.homePage.title,
            icon: "Home"
        } : {
            tabId: "",
            title: "",
            icon: ""
        },
        setTabs: (v: any) => set(() => ({tabs: v})),
        setNowTab: (v: any) => set(() => ({nowTab: v})),
        setFixedTab: (tabId: string) => set((state: any) => ({tabs: setFixedTabHandler(state.tabs, tabId)}))
    }), {
        name: defaultSetting.app.storagePrefix + "tabBar",
        storage: defaultSetting.app.isEnableMemory ? (createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)) : undefined
    })
)