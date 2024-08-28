import {Menu} from "antd"
import {createStyles} from "antd-style"
import React from 'react'
import {Icon} from "@/components"
import {useControlTab} from "@/hooks"
import {useAppStore, useHomePageStore, useMenuStore} from "@/store"

//@ts-ignore
const useStyles = createStyles(({token, css}) => ({
    asideBar: {
        width: "84px",
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: token.colorPrimaryBg,
        display: "flex",
        flexDirection: "column"
    },
    logoContainer: {
        width: "48px",
        height: "48px",
        margin: "12px auto",
        display: "block",
        border: "none"
    },
    moduleContainer: {
        width: "100%",
        flex: 1,
        height: "1px",
    },
    moduleItem: {
        boxSizing: "border-box",
        padding: token.paddingXS,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    moduleIcon: {
        marginBottom: token.marginXXS,
        marginTop: token.marginXS
    },
    moduleTitle: {
        marginBottom: token.marginXXS,
        padding: 0
    },
    moduleItemContainer: css`
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      font-size: ${token.fontSize}px;
      margin-bottom: ${token.marginXXS}px;
      border-radius: ${token.borderRadius}px;
      color: ${token.colorTextHeading};
      cursor: pointer;
      transition: all .3s;

      &:hover {
        background-color: ${token.colorPrimaryBgHover};
        transition: all .3s;
      }
    `,
    moduleItemSelection: {
        backgroundColor: token.colorPrimaryBgHover
    },
    onlyModuleTitle: css`
      padding: 0;
      font-size: 13px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    onlySubMenu: css`
      text-align: center;
      display: grid;
      place-items: center;

      .ant-menu-submenu-arrow {
        display: none;
      }

      .ant-menu-submenu {
        border: none !important;
      }

      .ant-menu-title-content {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
      }

      .ant-menu-submenu-title {
        height: auto !important;
        line-height: 1 !important;
        width: 64px;
        height: 64px !important;
        padding: 0;
      }
    `,

    TopAsideMenuTitle: {
        fontSize: '24px',
        color: token.colorText,
        margin: '0 64px 0 12px',
        letterSpacing: "2px"
    },
    TopModuleContainer: {
        display: 'flex',
        moduleTitle: {
            color: 'red',
        }
    },
    TopModuleItem: {
        boxSizing: "border-box",
        padding: token.paddingXS,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: '100px',
        height: '60px',
        marginRight: "5px",
    },
    TopAsideBar: {
        width: '100%',
        height: '84px',
        backgroundColor: token.colorPrimaryBg,
        padding: '0 18px',
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center'
    },
    TopLogoContainer: {
        width: '50px',
        height: '50px',
    },
    TopModuleIcon: {
        marginBottom: token.marginXXS,
        marginTop: token.marginXS
    },
    TopModuleTitle: {
        marginBottom: token.marginXXS,
        padding: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    ContentModuleIcon: {
        marginRight: '10px'
    },
    ContentModuleTitle: {
        lineHeight: '56px',
        margin: '0px'
    },
    ContentModuleContent: css`
      display: flex;
      height: 56px;
      padding: 0 10px;
      align-items: center;
      width: 200px;

      &:hover {
        background-color: rgb(225, 225, 225);
        transition: all .3s;
      }
    `,
    ContentModuleContentItem: {
        display: 'flex',
        height: '56px',
        alignItems: 'center',
        width: '200px'
    },

}))

export function MainNav() {
    const {styles, cx} = useStyles()
    let {mainNavData, asideBarSelection, menuType, mainNavCurrentKeys} = useMenuStore()
    let {logo, name} = useAppStore()
    let {isEnableHomePage, homePageTitle} = useHomePageStore((state) => {
        return {
            isEnableHomePage: state.isEnable,
            homePageTitle: state.title
        }
    })
    let {openTab} = useControlTab()


    //递归渲染menu数组,根据是否有子节点判断类型是不是submenu,记录
    function _generatorMenuItem(menuData: any) {
        return menuData.map((item: any, index: number) => {
            if (item.children?.length) {
                return <Menu.SubMenu key={item.key}
                                     title={item.label}
                                     icon={item.icon ? <Icon name={item.icon}></Icon> : null}
                >
                    {_generatorMenuItem(item.children)}
                </Menu.SubMenu>
            } else {
                return <Menu.Item key={item.key}
                                  onClick={() => {
                                      openTab(item)
                                  }}
                                  icon={<Icon name={item.icon}></Icon>}
                >
                    {item.label}
                </Menu.Item>
            }
        })
    }

    function generatorMenuItem(menuData: any, isRenderChildren: boolean = true) {
        return menuData.map((item: any, index: number) => {
            if (item.children?.length) {
                return <Menu.SubMenu key={item.key}
                                     onTitleClick={(v) => {
                                         if (menuType === "side" || menuType === "head") {
                                             useMenuStore.setState((store: any) => ({
                                                 menuData: mainNavData[index].children,
                                                 mainNavCurrentKeys: [item.key]
                                             }))
                                         }
                                     }}
                                     popupOffset={menuType === "only-head" ? [-70, 74] : [0, 0]}
                                     className={styles.onlySubMenu}
                                     title={<>
                                         <Icon size={24} name={item.icon}></Icon>
                                         <div className={styles.onlyModuleTitle}>{item.label}</div>
                                     </>}
                >
                    {isRenderChildren ? _generatorMenuItem(item.children) : null}
                </Menu.SubMenu>
            } else {
                return <Menu.Item key={item.key}
                                  onClick={() => {
                                      openTab(item)
                                  }}
                                  icon={<Icon name={item.icon}></Icon>}
                >
                    {item.label}
                </Menu.Item>
            }
        })
    }

    return <>
        {menuType === "side" ? <div className={styles.asideBar}>
                <img className={styles.logoContainer} onClick={() => {
                    if (isEnableHomePage) {
                        openTab({key: "/"})
                    }
                }} src={logo}/>
                <Menu
                    selectedKeys={mainNavCurrentKeys}
                    style={{
                        backgroundColor: "transparent"
                    }}>
                    {generatorMenuItem(mainNavData, false)}
                </Menu>
            </div>
            : null}
        {
            menuType === 'only-side' ? <div className={styles.asideBar}>
                <img className={styles.logoContainer} onClick={() => {
                    if (isEnableHomePage) {
                        openTab({key: "/"})
                    }
                }} src={logo}/>
                <Menu
                    selectedKeys={mainNavCurrentKeys}
                    style={{
                        backgroundColor: "transparent"
                    }}>
                    {generatorMenuItem(mainNavData)}
                </Menu>
            </div> : null
        }
        {menuType === 'head' ? <div className={styles.TopAsideBar}>
            <img className={styles.TopLogoContainer} onClick={() => {
                if (isEnableHomePage) {
                    openTab({key: "/"})
                }
            }} src={logo}/>
            <div className={styles.TopAsideMenuTitle}>{name}</div>
            <Menu
                selectedKeys={mainNavCurrentKeys}
                style={{
                    backgroundColor: "transparent",
                    display: "flex"
                }}>
                {generatorMenuItem(mainNavData, false)}
            </Menu>
        </div> : null
        }
        {
            menuType === 'only-head' ? <div className={styles.TopAsideBar}>
                <img className={styles.TopLogoContainer} onClick={() => {
                    if (isEnableHomePage) {
                        openTab({key: "/"})
                    }
                }} src={logo}/>
                <div className={styles.TopAsideMenuTitle}>{name}</div>
                <Menu
                    selectedKeys={mainNavCurrentKeys}
                    style={{
                        backgroundColor: "transparent",
                        display: "flex"
                    }}
                >
                    {generatorMenuItem(mainNavData)}
                </Menu>
            </div> : null
        }
    </>
}