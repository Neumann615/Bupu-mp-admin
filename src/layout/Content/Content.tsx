import {createStyles} from "antd-style"
import React, {useRef} from 'react'
import {useLocation, useOutlet} from 'react-router'
import {CSSTransition, SwitchTransition} from "react-transition-group"
import {useAppStore, useMainPageStore} from "@/store"
import {Icon} from "@/components"
import {transitionTypeSet} from "@/utils"

const useStyles = createStyles(({token, css}) => ({
    content: {
        width: "auto",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        backgroundColor: token.colorBgLayout
    },
    maxContent: css`
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background-color: ${token.colorBgLayout};
      position: fixed;
      left: 0;
    `,
    exitMaxBtn: css`
      position: absolute;
      width: 48px;
      height: 48px;
      background-color: red;
      right: 0;
      z-index: 999;
      cursor: pointer;
      border-radius: 0 0 0 100%;
      background-color: ${token.colorBgSpotlight};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${token.colorTextLightSolid};


      :hover {
        background-color: ${token.colorBgMask};
      }
    `,
    exitMaxBtnIcon: css`
      transform: translateX(5px);
    `,
    outletContainer: {
        width: "100%",
        height: "100%"
    }
}))

export function Content() {
    const {styles} = useStyles()
    const {nodeRef} = useRef(null)
    const currentOutlet = useOutlet()
    const location = useLocation()
    const {startGlobalProgressLoading, stopGlobalProgressLoading, globalProgressLoading} = useAppStore()
    const {transitionType, isMaximize, changeIsMaximize} = useMainPageStore()
    return <div className={isMaximize ? styles.maxContent : styles.content}
                style={{overflow: globalProgressLoading ? "hidden" : "auto"}}>
        {isMaximize ? <div className={styles.exitMaxBtn} onClick={changeIsMaximize}>
            <Icon size={22} class={styles.exitMaxBtnIcon} name={"InternalReduction"}></Icon>
        </div> : null}
        <SwitchTransition mode="out-in">
            <CSSTransition
                nodeRef={nodeRef}
                unmountOnExit
                onEntered={stopGlobalProgressLoading}
                onExit={startGlobalProgressLoading}
                key={location.key}
                timeout={500}
                classNames={transitionTypeSet[transitionType]}>
                <div className={styles["outletContainer"]} ref={nodeRef}>
                    {currentOutlet}
                </div>
            </CSSTransition>
        </SwitchTransition>
    </div>
}