import {create} from 'zustand'
import defaultSetting from "@/defaultSetting"
import {createJSONStorage, persist} from 'zustand/middleware'

export const useMainPageStore = create(persist((set) => ({
    isMaximize: true,
    ...defaultSetting.mainPage,
    changeIsMaximize: () => set((state: any) => ({isMaximize: !state.isMaximize})),
}), {
    name: defaultSetting.app.storagePrefix + "mainPage",
    storage: defaultSetting.app.isEnableMemory ? (createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)) : undefined
}))