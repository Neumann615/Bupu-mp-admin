import * as iconSet from "@icon-park/react"
import React from "react"
import "@icon-park/react/styles/index.css"

export function Icon(props: any) {
    return iconSet[props.name] ? React.createElement(iconSet[props.name], { theme: "outline", ...props }) : null
}