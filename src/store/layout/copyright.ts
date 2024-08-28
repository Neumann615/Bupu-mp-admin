import {create} from 'zustand'
import defaultSetting from "@/defaultSetting"
import {persist, createJSONStorage} from 'zustand/middleware'

export const useCopyrightStore: any = create(persist((set: any) => (defaultSetting.copyright), {
    name: defaultSetting.app.storagePrefix + "copyright",
    storage: defaultSetting.app.isEnableMemory?(createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)):undefined
}))