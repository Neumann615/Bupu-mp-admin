import {Result as AntdResult, ResultProps, Button} from "antd"
import React from "react"
import {createStyles} from "antd-style"

const useStyles = createStyles(({token, css}) => ({
    resultContainer: css`
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    `
}))

export function Result(props: ResultProps) {
    const {styles} = useStyles()
    return <div className={styles["resultContainer"]}>
        {props.status == 403 ? <AntdResult title={"403"} subTitle={"抱歉，您无权访问该页面"} {...props}
                                           extra={<Button type={"primary"}>回到首页</Button>}></AntdResult> : null}
        {props.status == 404 ? <AntdResult title={"404"} subTitle={"抱歉，您访问的页面不存在"} {...props}
                                           extra={<Button type={"primary"}>回到首页</Button>}></AntdResult> : null}
        {props.status == 500 ? <AntdResult title={"500"} subTitle={"抱歉，服务器出错了"} {...props}
                                           extra={<Button type={"primary"}>回到首页</Button>}></AntdResult> : null}
        {props.status == "success" ? <AntdResult title={"操作成功"} subTitle={""} {...props}
                                                 extra={<Button type={"primary"}>确定</Button>}></AntdResult> : null}
        {props.status == "warning" ? <AntdResult title={"操作警告"} subTitle={""} {...props}
                                                 extra={<Button type={"primary"}>确定</Button>}></AntdResult> : null}
        {props.status == "error" ? <AntdResult title={"操作失败"} subTitle={""} {...props}
                                               extra={<Button type={"primary"}>确定</Button>}></AntdResult> : null}
        {props.status == "info" ? <AntdResult title={"提示"} subTitle={""} {...props}
                                              extra={<Button type={"primary"}>确定</Button>}></AntdResult> : null}
    </div>
}