import {create} from 'zustand'
import defaultSetting from "@/defaultSetting";

export const useToolbarStore = create((set) => ({
    ...defaultSetting.toolbar
}))