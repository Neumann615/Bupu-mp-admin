import {create} from 'zustand'
import defaultSetting from "@/defaultSetting"
import {persist, createJSONStorage} from 'zustand/middleware'

export const useBreadcrumbStore: any = create(
    persist((set: any) => ({
        ...defaultSetting.breadcrumb,
        breadcrumbList: defaultSetting.homePage.isEnable ? [{
            icon: "Home",
            id: "/",
            key: "/",
            label: defaultSetting.homePage.title
        }] : [],
        setBreadcrumbList: (v: any) => set(() => ({breadcrumbList: v})),
    }), {
        name: defaultSetting.app.storagePrefix + "breadcrumb",
        storage: defaultSetting.app.isEnableMemory ? (createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)) : undefined
    })
)