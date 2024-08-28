export default {
    app: {
        //项目名称
        name: "Bupu管理平台",
        //LOGO
        logo: "https://xiaonuo.love/logo_small.png",
        //生产环境是否开始全局配置
        isEnableProductionAppSetting: true,
        //开启记忆功能
        isEnableMemory: true,
        //全局页面加载
        isEnablePageLoadProgress: true,
        //收藏功能
        isEnableFavorite: true,
        //本地存储前缀
        storagePrefix: "Bupu_",
        //客户端存储方式
        storageType: "local",
        //样式类名前缀
        styleClassNamePrefix: "xiaonuoxiaonuo"
    },
    //主题
    theme: {
        themeColor: "#722ed1",
        darkMode: false,
        compactMode: false,
        happyEffect: false
    },
    //主题编辑器
    themeSetting: {
        isEnable: true,
        isEnableThemeColor: true,
        isEnableDarkMode: true,
        isEnableCompactMode: true,
        isEnableHappyEffect: true
    },
    //主页
    homePage: {
        isEnable: true,
        title: "主页"
    },
    //菜单
    menu: {
        menuType: "side",
        menuFillStyle: "radius",
        menuActiveStyle: "arrow",
        //次导航只保持展开一个
        subMenuUniqueOpened: true,
        subMenuCollapse: false,
        isEnableSubMenuCollapse: true
    },
    //主内容
    mainPage: {
        //开启过渡
        isEnableTransition: true,
        //过渡类型
        transitionType: "lightspeed-left"
    },
    //版权
    copyright: {
        isEnable: true,
        date: "2022",
        company: "Bupu-admin",
        website: "https://ant-design.github.io/antd-style",
    },
    //顶部工具栏
    topBar: {
        isEnable: true,
        position: "static"
    },
    //工具栏
    toolbar: {
        isEnable: true,
        //搜索
        isEnableSearch: true,
        //国际化
        isEnableI18n: true,
        //重载
        isEnablePageReload: true,
    },
    //面包屑
    breadcrumb: {
        isEnable: true,
        style: "modern",
        //是否显示主导航
        isEnableMainNav: true,
    },
    //标签页
    tabBar: {
        isEnable: true,
        showIcon: true,
        style: "default",
        position: "static"
    }
}