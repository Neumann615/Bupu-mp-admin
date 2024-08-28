import {create} from 'zustand'
import defaultSetting from "@/defaultSetting"
import {persist, createJSONStorage} from 'zustand/middleware'

export const useAppStore: any = create(
    persist((set: any) => ({
        ...defaultSetting.app,
        globalProgressLoading: false,
        startGlobalProgressLoading: () => set(() => ({globalProgressLoading: true})),
        stopGlobalProgressLoading: () => set(() => ({globalProgressLoading: false}))
    }), {
        name: defaultSetting.app.storagePrefix + "app",
        storage: defaultSetting.app.isEnableMemory?(createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)):undefined
    })
)