import {create} from 'zustand'
import defaultSetting from "@/defaultSetting";

export const useTopBarStore = create((set) => (defaultSetting.topBar))