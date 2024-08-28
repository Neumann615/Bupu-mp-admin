import {create} from 'zustand'
import defaultSetting from "@/defaultSetting";

export const useThemeSettingStore = create((set) => (defaultSetting.themeSetting))