import { Space } from "antd"
import { useFullscreen } from "ahooks"
import { Icon } from "@/components"
import { theme } from "antd"
import React from "react"

const { useToken } = theme

export default () => {
    const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body)
    const { token } = useToken()
    return <Space>
        <Icon fill={token.colorText}
            name={isFullscreen ? "OffScreenTwo" : "FullScreenTwo"} size={24}
            onClick={toggleFullscreen}></Icon>
        <Icon fill={token.colorText} name={"Refresh"} size={24}></Icon>
    </Space>
}