import React, {useEffect, useMemo, useRef, useState} from "react"
import type {MenuProps} from 'antd'
import {Breadcrumb, Col, Dropdown, Popover, Row, Tooltip} from "antd"
import {useNavigate} from "react-router-dom"
import {createStyles} from "antd-style"
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd"
import {Icon} from "@/components"
import {useControlTab} from "@/hooks"
import {useBreadcrumbStore, useMainPageStore, useMenuStore, useTabBarStore} from "@/store"
import {useMount} from "ahooks"
import {CaretDownOutlined} from "@ant-design/icons"
import {preventDefaultEvents} from "@/utils"
import Toolbar from "../Toolbar/Toolbar"

const useStyles = createStyles(({token, css}) => ({
    header: {
        width: "100%",
        height: "auto",
        boxShadow: token.boxShadowTertiary,
        boxSizing: "border-box",
        borderBottom: "1px solid" + token.colorBorderSecondary
    },
    headerTabs: {
        boxSizing: "border-box",
        backgroundColor: token.colorBgLayout,
        display: "flex",
        alignItems: "center"
    },
    headerTabsLeft: {
        flex: 1,
        width: "1px"
    },
    headerTabsRight: {
        display: "grid",
        placeItems: "center",
        borderRadius: token.borderRadiusLG,
        backgroundColor: token.colorBgContainer,
        boxSizing: "border-box",
        padding: token.paddingXS,
        overflow: "hidden",
        marginRight: token.marginXS,
        marginLeft: token.marginXS
    },
    headerTabsContent: css`
      width: 100%;
      display: flex;
      height: 48px;
      align-items: flex-end;
      overflow-x: auto;

      ::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    `,
    headerTabItem: css`
      width: 144px;
      height: 40px;
      text-align: center;
      font-size: ${token.fontSize}px;
      border-radius: ${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0;
      color: ${token.colorTextTertiary};
      cursor: pointer;
      transition: all .4s;
      margin-left: ${token.marginXXS}px;
      padding: 0 ${token.paddingXS}px;

      :hover {
        background-color: ${token.colorBgContainer};
        transition: all .4s;
      }
    `,
    nowTabItem: css`
      width: 144px;
      height: 40px;
      text-align: center;
      font-size: ${token.fontSize}px;
      border-radius: ${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0;
      color: ${token.colorTextTertiary};
      cursor: pointer;
      transition: all .4s;
      margin-left: ${token.marginXXS}px;
      padding: 0 ${token.paddingXS}px;
      background-color: ${token.colorBgContainer};
    `,
    tabTitle: css`
      width: 84px;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
    `,
    tabClose: css`
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      transition: all .2s;
      display: grid;
      place-items: center;

      :hover {
        transition: all .2s;
        background-color: ${token.colorFillSecondary};
      }
    `,
    headerModule: {
        boxSizing: "border-box",
        padding: token.paddingSM,
        backgroundColor: token.colorBgContainer
    },
    contextMenuIcon: css`
      .i-icon {
        display: grid;
        place-items: center;
        width: 15px;
        height: 15px;
      }
    `,
    tabPopover: {
        width: "166px",
        height: "auto"
    },
    tabPopoverHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    tabPopoverHeaderItem: {
        boxSizing: "border-box",
        padding: token.paddingXS,
        display: "grid",
        placeItems: "center",
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
        backgroundColor: token.colorBgLayout,
        cursor: "pointer"
    },
    tabPopoverHeaderItemDisabled: {
        cursor: "not-allowed"
    },
    tabPopoverMain: {
        width: "100%",
        height: "auto",
        maxHeight: "180px",
        marginTop: token.marginXS,
        overflow: "auto"
    },
    tabPopoverMainItem: css`
      width: 100%;
      height: 36px;
      line-height: 36px;
      cursor: pointer;
      transition: all .3s;
      box-sizing: border-box;
      padding: 0 ${token.paddingXS}px;
      border-radius: ${token.borderRadiusLG}px;
      overflow: "hidden";
      font-size: ${token.fontSizeSM}px;

      .i-icon {
        display: grid;
        place-items: center;
        width: 15px;
        height: 15px;
      }

      .close-icon {
        display: none;
        transition: all .3s;
        box-sizing: border-box;
        padding: 2px;
      }


      &:hover {
        background-color: ${token.colorBgLayout};
        transition: all .3s;

        .close-icon {
          transition: all .3s;
          display: block;
          box-sizing: border-box;
          padding: 2px;
        }
      }
    `,
    tabPopoverMainItemSelection: {
        backgroundColor: token.colorBgLayout
    }

}))

export function Header() {
    const {openTab, closeTab, swapTab, fixedTab} = useControlTab()
    const {styles, theme} = useStyles()
    const {tabs, nowTab} = useTabBarStore()
    const {changeSubMenuCollapse, subMenuCollapse, menuType, isEnableSubMenuCollapse} = useMenuStore()
    const {breadcrumbList, isEnable} = useBreadcrumbStore()
    const [nowOpenTab, setNowOpenTab] = useState({tabId: "", isFixed: false})
    const [isOpenTab, setIsOpenTab] = useState(false)
    const headerTabsRef = useRef(null)
    const navigate = useNavigate()
    const {changeIsMaximize} = useMainPageStore()


    const tabItems = useMemo<MenuProps['items']>(() => {
        let nowOpenTabIndex = -1
        tabs.forEach((tabItem: any, index: number) => {
            if (tabItem.tabId === nowOpenTab.tabId) {
                nowOpenTabIndex = index
            }
        })
        let leftCount: number = 0
        let rightCount: number = 0
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].tabId !== nowOpenTab.tabId && !tabs[i].isFixed) {
                if (i < nowOpenTabIndex) {
                    leftCount += 1
                } else if (i > nowOpenTabIndex) {
                    rightCount += 1
                }
            }
        }
        return [
            {
                label: '重新加载',
                key: '1',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"Refresh"}></Icon>
                </div>,
                onClick: () => {
                    navigate(0)
                },
                disabled: nowOpenTab.tabId !== nowTab.tabId
            },
            {
                label: nowOpenTab.isFixed ? '取消固定' : "固定",
                key: '3',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={nowOpenTab.isFixed ? "Pin" : "Pushpin"}></Icon>
                </div>,
                onClick: () => {
                    fixedTab(nowOpenTab.tabId)
                }
            },
            {
                label: '最大化',
                key: '4',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"InternalExpansion"}></Icon>
                </div>,
                onClick: () => {
                    openTab(nowOpenTab.menuData)
                    changeIsMaximize()
                }
            },
            {
                label: '关闭标签页',
                key: '2',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"Close"}></Icon>
                </div>,
                onClick: () => {
                    closeTab(nowOpenTab.tabId)
                },
                disabled: tabs?.length === 1
            },
            {
                label: '关闭其他标签页',
                key: '5',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"Other"}></Icon>
                </div>,
                onClick: () => {
                    closeTab(nowOpenTab.tabId, "other")
                },
                disabled: tabs?.length === 1
            },
            {
                label: '关闭左侧标签页',
                key: '6',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"HandLeft"}></Icon>
                </div>,
                onClick: () => {
                    closeTab(nowOpenTab.tabId, "left")
                },
                disabled: !Boolean(leftCount)
            },
            {
                label: '关闭右侧标签页',
                key: '7',
                icon: <div className={styles["contextMenuIcon"]}>
                    <Icon name={"HandRight"}></Icon>
                </div>,
                onClick: () => {
                    closeTab(nowOpenTab.tabId, "right")
                },
                disabled: !Boolean(rightCount)
            }
        ]
    }, [nowTab, nowOpenTab, isOpenTab, tabs])

    const popoverItems = useMemo(() => {
        let nowTabIndex = -1
        tabs.forEach((tabItem: any, index: number) => {
            if (tabItem.tabId === nowTab.tabId) {
                nowTabIndex = index
            }
        })
        let leftCount: number = 0
        let rightCount: number = 0
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].tabId !== nowTab.tabId && !tabs[i].isFixed) {
                if (i < nowTabIndex) {
                    leftCount += 1
                } else if (i > nowTabIndex) {
                    rightCount += 1
                }
            }
        }
        return [
            {
                tooltip: "搜索",
                icon: <Icon name={"Search"}></Icon>,
                onClick: () => {
                },
                disabled: false
            },
            {
                tooltip: "关闭其他标签页",
                icon: <Icon name={"Close"}></Icon>,
                onClick: () => {
                },
                disabled: tabs?.length === 1
            },
            {
                tooltip: "关闭左侧标签页",
                icon: <Icon name={"HandLeft"}></Icon>,
                onClick: () => {
                    if (!Boolean(leftCount)) return
                    closeTab(nowTab.tabId, "left")
                },
                disabled: !Boolean(leftCount)
            },
            {
                tooltip: "关闭右侧标签页",
                icon: <Icon name={"HandRight"}></Icon>,
                onClick: () => {
                    if (!Boolean(rightCount)) return
                    closeTab(nowTab.tabId, "right")
                },
                disabled: !Boolean(rightCount)
            }
        ]
    }, [nowTab, tabs])

    useEffect(() => {
        let dom = document.getElementById("header-tab-" + nowTab.tabId)
        if (dom) {
            dom.scrollIntoView()
        }
    }, [tabs, nowTab])

    useMount(() => {
        if (headerTabsRef.current) {
            console.log(headerTabsRef.current.children)
            headerTabsRef.current.addEventListener("mousewheel", (e: Event) => {
                let wheelDelta = e.wheelDelta ? e.wheelDelta : (-e.detail * 50)
                let scrollSpace = Math.abs(wheelDelta)
                if (wheelDelta > 0) {
                    headerTabsRef.current.children[0].scrollLeft -= scrollSpace
                }
                if (wheelDelta < 0) {
                    headerTabsRef.current.children[0].scrollLeft += scrollSpace
                }
            })
        }
    })


    return <div className={styles.header}>
        <div className={styles.headerTabs}>
            <div className={styles.headerTabsLeft} ref={headerTabsRef}>
                <DragDropContext onDragEnd={(result: any) => {
                    if (!result.destination) return // 判断是否有结束参数
                    //console.log("初始索引", result.source.index)
                    //console.log("结束索引", result.destination.index)
                    swapTab(result.source.index, result.destination.index)
                }}>
                    <Droppable droppableId='droppable' direction={"horizontal"}>
                        {(droppableProvided: any) => <div className={styles.headerTabsContent}
                                                          ref={droppableProvided.innerRef}>
                            {tabs.map((tabItem: any, index: number) => {
                                return <Draggable key={tabItem.tabId}
                                                  draggableId={tabItem.tabId} index={index}>
                                    {(provided: any, snapshot: any) => <div
                                        id={"header-tab-" + tabItem.tabId}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.7 : 1,
                                        }}
                                    >
                                        <Dropdown
                                            key={tabItem.tabId}
                                            placement={"bottomLeft"}
                                            trigger={["contextMenu"]}
                                            onOpenChange={(v) => {
                                                setIsOpenTab(v)
                                                if (v) {
                                                    setNowOpenTab(tabItem)
                                                }
                                            }}
                                            menu={{items: tabItems}}>
                                            <div
                                                onClick={() => {
                                                    openTab(tabItem.menuData)
                                                }}
                                                className={nowTab.tabId === tabItem.tabId ? styles.nowTabItem : styles.headerTabItem}
                                                key={tabItem.tabId}>
                                                <div className={"flex-sb"} style={{width: "100%", height: "100%"}}>
                                                    <div className={"flex-start"}>
                                                        {tabItem.icon ?
                                                            <Icon size={16} style={{marginRight: theme.marginXS}}
                                                                  name={tabItem.icon}></Icon> : null}
                                                        <div className={styles.tabTitle}>
                                                            {tabItem.title}
                                                        </div>
                                                    </div>
                                                    {tabs?.length > 1 ? <div className={styles.tabClose}>
                                                        {tabItem.isFixed ? <Icon size={10} onClick={(e: Event) => {
                                                                fixedTab(tabItem.tabId)
                                                                preventDefaultEvents(e)
                                                            }} name={"Pin"}></Icon> :
                                                            <Icon size={10} onClick={(e: Event) => {
                                                                closeTab(tabItem.tabId)
                                                                preventDefaultEvents(e)
                                                            }} name={"Close"}></Icon>}
                                                    </div> : null}
                                                </div>
                                            </div>
                                        </Dropdown>
                                    </div>}
                                </Draggable>
                            })}
                        </div>}
                    </Droppable>
                </DragDropContext>
            </div>
            {tabs?.length > 1 ? <Popover placement={"bottomLeft"} content={<div className={styles.tabPopover}>
                <div className={styles.tabPopoverHeader}>
                    {popoverItems.map((item: any, index: number) => {
                        return <Tooltip title={item.tooltip} key={index}>
                            <div
                                className={styles.tabPopoverHeaderItem + " " + (item.disabled ? styles.tabPopoverHeaderItemDisabled : "")}>
                                {item.icon}
                            </div>
                        </Tooltip>
                    })}
                </div>
                <div className={styles.tabPopoverMain}>
                    {tabs.map((tabItem: any, index: number) => {
                        return <div
                            key={index}
                            onClick={() => {
                                openTab(tabItem.menuData)
                            }}
                            className={styles.tabPopoverMainItem + " " + (nowTab.tabId === tabItem.tabId ? styles.tabPopoverMainItemSelection : "")}>
                            <div className={"flex-sb"} style={{width: "100%", height: "100%"}}>
                                <div className={"flex-start"}>
                                    {tabItem.icon ?
                                        <Icon size={16} style={{marginRight: theme.marginXS}}
                                              name={tabItem.icon}></Icon> : null}
                                    <div className={styles.tabTitle}>
                                        {tabItem.title}
                                    </div>
                                </div>
                                <div className={"close-icon"} onClick={(e: Event) => {
                                    closeTab(tabItem.tabId)
                                    preventDefaultEvents(e)
                                }}>
                                    <Icon size={10} name={"Close"}></Icon>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>} trigger="hover">
                <div className={styles.headerTabsRight}>
                    <CaretDownOutlined style={{fontSize: theme.fontSizeXL}} fill={theme.colorText}/>
                </div>
            </Popover> : null}
        </div>
        <Row align={"middle"} className={styles.headerModule}>
            <Col span={12}>
                {isEnable ? <Breadcrumb
                    items={breadcrumbList.map((menuItem: any) => {
                        return {
                            title: menuItem.label,
                            onClick: () => {
                                menuItem?.children?.length ? null : openTab(menuItem)
                            }
                        }
                    })}></Breadcrumb> : null}
            </Col>
            <Col span={12} align={"right"}>
                <Toolbar></Toolbar>
            </Col>
        </Row>
    </div>
}