import { create } from 'zustand'
import defaultSetting from "@/defaultSetting";
import { persist, createJSONStorage } from 'zustand/middleware'
export const useThemeStore:any = create(persist((set:any) => (defaultSetting.theme), {
    name: defaultSetting.app.storagePrefix + "theme",
    storage: defaultSetting.app.isEnableMemory?(createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)):undefined
}))