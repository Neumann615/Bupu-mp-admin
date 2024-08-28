/**页面切换过渡类型 */
type TransitionType = "slide-right" | "fade-in" | "fade-up" | "lightspeed-left" | "roll"

/**菜单类型 */
type MenuType = "side" | "only-side" | "head" | "only-head" | "simple"

export interface LayoutConfig {
    /**应用配置 */
    app: {
        /**项目名称 */
        name: string
        /**Logo */
        logo: string
        /**生产环境是否开始全局配置*/
        isEnableProductionAppSetting: boolean
        /**开启记忆功能*/
        isEnableMemory: boolean
        /**全局页面加载*/
        isEnablePageLoadProgress: boolean
        /**收藏功能*/
        isEnableFavorite: boolean
        /**本地存储前缀*/
        storagePrefix: string
        /**客户端存储方式*/
        storageType: string
        /**样式类名前缀*/
        styleClassNamePrefix: string
    }
    /**主题*/
    theme: {
        /**主题色*/
        themeColor: string
        /**暗色模式*/
        darkMode: false
        /**紧凑模式*/
        compactMode: false
        /**快乐特效*/
        happyEffect: false
    }
    /**主题编辑器*/
    themeSetting: {
        /**启用主题编辑器*/
        isEnable: boolean
        /**启用编辑主题色*/
        isEnableThemeColor: boolean
        /**启用开启暗色模式*/
        isEnableDarkMode: false
        /**启用开启紧凑模式*/
        isEnableCompactMode: false
        /**启用开启快乐特效*/
        isEnableHappyEffect: false
    }
    /**主页*/
    homePage: {
        /**启用主页*/
        isEnable: boolean
        /**主页标题*/
        title: string
    }
    /**菜单*/
    menu: {
        menuType: MenuType
        menuFillStyle: string
        menuActiveStyle: string
        /**次导航只保持展开一个*/
        subMenuUniqueOpened: boolean
        subMenuCollapse: false
        isEnableSubMenuCollapse: boolean
    }
    /**主内容*/
    mainPage: {
        /**开启页面切换过渡*/
        isEnableTransition: boolean
        /**过渡类型*/
        transitionType: TransitionType
    }
    /**版权*/
    copyright: {
        isEnable: boolean
        date: string
        company: string
        website: string
    }
    /**顶部工具栏*/
    topBar: {
        isEnable: boolean
        position: string
    }
    /**工具栏*/
    toolbar: {
        isEnable: boolean
        /**搜索*/
        isEnableSearch: boolean
        /**国际化*/
        isEnableI18n: boolean
        /**重载*/
        isEnablePageReload: boolean
    }
    /**面包屑*/
    breadcrumb: {
        isEnable: boolean
        style: string
        /**是否显示主导航*/
        isEnableMainNav: boolean
    }
    /**标签页*/
    tabBar: {
        isEnable: boolean
        showIcon: boolean
        style: string
        position: string
    }
}