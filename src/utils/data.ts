import type {LayoutConfig} from "@/types/config"

export const themeColorList = ["#1677ff", "#722ed1", "#eb2f96", "#f5222d", "#fa8c16", "#fa541c"]

export const menuFillStyleList = ["none", "radius"]

export const breadcrumbStyleList = [
    {
        label: "默认",
        value: "default"
    },
    {
        label: "时尚",
        value: "modern"
    }
]

export const topBarPositionList = [
    {
        label: "默认",
        value: "static"
    },
    {
        label: "固定",
        value: "fixed"
    },
    {
        label: "粘性",
        value: "sticky"
    }
]

export const tabBarPositionList = [
    {
        label: "默认",
        value: "static"
    },
    {
        label: "固定",
        value: "fixed"
    },
    {
        label: "粘性",
        value: "sticky"
    }
]

export const tabBarStyleList = [
    {
        label: "默认",
        value: "default"
    },
    {
        label: "卡片",
        value: "card"
    },
    {
        label: "方块",
        value: "block"
    }
]

export const menuActiveStyleList = ["none", "arrow", "line", "dot"]

export const storageTypeList = [
    {
        label: "本地存储",
        value: "local"
    },
    {
        label: "会话存储",
        value: "session"
    }
]

export const transitionTypeList = [
    {
        label: "滑动",
        value: "slide-right",
        classNames: {
            appear: "animate__animated",
            appearActive: "animate__slideInRight",
            enter: "animate__animated",
            enterActive: "animate__slideInRight",
            exit: "animate__animated",
            exitActive: "animate__slideOutLeft",
        }
    },
    {
        label: "淡入淡出1",
        value: "fade-in",
        classNames: {
            appear: "animate__animated",
            appearActive: "animate__fadeIn",
            enter: "animate__animated",
            enterActive: "animate__fadeIn",
            exit: "animate__animated",
            exitActive: "animate__fadeOut",
        }
    },
    {
        label: "淡入淡出2",
        value: "fade-up",
        classNames: {
            appear: "animate__animated",
            appearActive: "animate__fadeInUp",
            enter: "animate__animated",
            enterActive: "animate__fadeInUp",
            exit: "animate__animated",
            exitActive: "animate__fadeOutDown",
        }
    },
    {
        label: "闪动1",
        value: "lightspeed-left",
        classNames: {
            appear: "animate__animated",
            appearActive: "animate__lightSpeedInLeft",
            enter: "animate__animated",
            enterActive: "animate__lightSpeedInLeft",
            exit: "animate__animated",
            exitActive: "animate__lightSpeedOutRight",
        }
    },
    {
        label: "滚动",
        value: "roll",
        classNames: {
            appear: "animate__animated",
            appearActive: "animate__rollIn",
            enter: "animate__animated",
            enterActive: "animate__rollIn",
            exit: "animate__animated",
            exitActive: "animate__rollOut",
        }
    }
]

const transitionTypeSet: any = {}
transitionTypeList.forEach((transition: any) => {
    transitionTypeSet[transition.value] = transition.classNames
})

export {transitionTypeSet}

export const menuTypeList = [
    {
        label: "侧边栏模式",
        value: "side"
    },
    {
        label: "侧边栏精简模式",
        value: "only-side"
    },
    {
        label: "顶部模式",
        value: "head"
    },
    {
        label: "顶部精简模式",
        value: "only-head"
    },
    {
        label: "精简模式（不包含主导航）",
        value: "simple"
    }
]

export const defaultSetting: LayoutConfig = {
    app: {
        //项目名称
        name: "",
        //LOGO
        logo: "",
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
        themeColor: "#1677ff",
        darkMode: false,
        compactMode: false,
        happyEffect: false
    },
    //主题编辑器
    themeSetting: {
        isEnable: true,
        isEnableThemeColor: true,
        isEnableDarkMode: false,
        isEnableCompactMode: false,
        isEnableHappyEffect: false
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
        transitionType: "slide-right"
    },
    //版权
    copyright: {
        isEnable: true,
        date: "2023.10.16",
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

export const menuData = [
    {
        id: "wxx",
        label: "管理员",
        icon: "Application",
        key: "/admin",
        children: [
            {
                label: "用户",
                icon: "TextStyle",
                key: "/admin/user/user",
            },
            {
                label: "小程序",
                icon: "TextStyle",
                key: "/admin/mp/mp",
            },
            {
                label: "模板",
                icon: "TextStyle",
                key: "/admin/template/template",
            },
        ]
    },
    {
        id: "1",
        label: "功能演示",
        icon: "Application",
        key: "/demo",
        children: [
            {
                label: "插件",
                icon: "Puzzle",
                key: "/demo/plugins",
                children: [
                    {
                        label: "富文本",
                        icon: "TextStyle",
                        key: "/demo/plugins/react-quill",
                    },
                    {
                        label: "代码编辑器",
                        icon: "TextStyle",
                        key: "/demo/plugins/react-codemirror"
                    },
                    {
                        label: "滑块验证",
                        icon: "TextStyle",
                        key: "/demo/plugins/react-slider"
                    },
                    {
                        label: "拖动",
                        icon: "TextStyle",
                        key: "/demo/plugins/react-beautiful-dnd"
                    },
                    {
                        label: "加载",
                        icon: "TextStyle",
                        key: "/demo/plugins/react-spinners"
                    },
                    {
                        label: "虚拟列表",
                        icon: "TextStyle",
                        key: "/demo/plugins/rc-virtual-list"
                    }
                ]
            },
            {
                label: "内置功能组件",
                icon: "Components",
                key: "/demo/component",
                children: [
                    {
                        label: "Markdown预览",
                        icon: "TextStyle",
                        key: "/demo/component/markdown",
                    },
                    {
                        label: "地图坐标拾取",
                        icon: "TextStyle",
                        key: "/demo/component/coordinate-picker",
                    },
                ]
            },
        ]
    },
    {
        id: "2",
        label: "页面模板",
        icon: "PageTemplate",
        key: "/page",
        children: [
            {
                label: "登录页面",
                icon: "Login",
                key: "/page/login",
                children: [
                    {
                        label: "登陆模板1",
                        icon: "",
                        key: "/page/login/login1",
                    },
                    {
                        label: "登录模板2",
                        icon: "",
                        key: "/page/login/login2",
                    },
                    {
                        label: "登陆模板3",
                        icon: "",
                        key: "/page/login/login3",
                    }
                ]
            },
            {
                label: "仪表盘",
                icon: "Dashboard",
                key: "/page/dashboard",
                children: [
                    {
                        label: "仪表盘1",
                        icon: "",
                        key: "/page/dashboard/dashboard1",
                    },
                    {
                        label: "仪表盘2",
                        icon: "",
                        key: "/page/dashboard/dashboard2",
                    },
                    {
                        label: "仪表盘3",
                        icon: "",
                        key: "/page/dashboard/dashboard3",
                    }
                ]
            },
            {
                label: "列表页面",
                icon: "ListView",
                key: "/page/list",
                children: [
                    {
                        label: "基础列表",
                        icon: "",
                        key: "/page/list/basic-list",
                    },
                    {
                        label: "卡片列表",
                        icon: "",
                        key: "/page/list/card-list",
                    },
                    {
                        label: "双栏列表",
                        icon: "",
                        key: "/page/list/between-list",
                    }
                ]
            },
            {
                label: "表单页面",
                icon: "FormOne",
                key: "/page/form",
                children: [
                    {
                        label: "表单1",
                        icon: "",
                        key: "/page/form/form1",
                    },
                    {
                        label: "表单2",
                        icon: "",
                        key: "/page/form/form2",
                    },
                    {
                        label: "表单3",
                        icon: "",
                        key: "/page/form/form3",
                    }
                ]
            },
            {
                label: "状态页面",
                icon: "CheckOne",
                key: "/page/status",
                children: [
                    {
                        label: "信息页",
                        icon: "",
                        key: "/page/status/info",
                    },
                    {
                        label: "成功页",
                        icon: "",
                        key: "/page/status/success",
                    },
                    {
                        label: "警告页",
                        icon: "",
                        key: "/page/status/warning",
                    },
                    {
                        label: "失败页",
                        icon: "",
                        key: "/page/status/error",
                    }
                ]
            },
            {
                label: "异常页面",
                icon: "Abnormal",
                key: "/page/abnormal",
                children: [
                    {
                        label: "403",
                        icon: "",
                        key: "/page/abnormal/403",
                    },
                    {
                        label: "404",
                        icon: "",
                        key: "/page/abnormal/404",
                    },
                    {
                        label: "500",
                        icon: "",
                        key: "/page/abnormal/500",
                    }
                ]
            }
        ]
    },
    {
        id: "3",
        label: "相关资料",
        icon: "DocumentFolder",
        key: "/information",
        children: [
            {
                label: "项目信息",
                icon: "Book",
                key: "/information/project"
            },
            {
                label: "关于我",
                icon: "IdCardH",
                key: "/information/personal"
            }
        ]
    },
]

