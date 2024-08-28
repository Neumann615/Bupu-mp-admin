import {createStyles} from "antd-style"
import {Responsive, WidthProvider} from "react-grid-layout"
import {CaretUpOutlined, CaretDownOutlined} from "@ant-design/icons";
import {Card, Space, Statistic, Button} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Area} from '@ant-design/plots';
import {Tiny} from '@ant-design/plots';

const ResponsiveReactGridLayout = WidthProvider(Responsive)
const useStyles = createStyles(({token, css}) => ({
    template1Header: css`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    template1HeaderTitle1: css`
      height: 22px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 22px;
    `,
    template1HeaderTitle2: css`
      height: 38px;
      margin-top: 4px;
      margin-bottom: 0;
      overflow: hidden;
      color: rgba(0, 0, 0, 0.88);
      font-size: 30px;
      line-height: 38px;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    `,
    template1HeaderMain: css`
      flex: 1;
      height: 1px;
      height: 100%;
      width: 100%;
      margin-bottom: 12px;
    `,
    template1HeaderFooter: css`
      box-sizing: border-box;
      border-top: 1px solid ${token.colorBorderSecondary};
      line-height: 22px;
      padding-top: 8px;
    `
}))
type DashboardProps = {
    type: "template1" | "template2" | "template3"
}

let a = [
    {
        i: 'a',
        x: 0,
        y: 0,
        w: 3,
        h: 5.5,
    },
    {
        i: 'b',
        x: 3,
        y: 0,
        w: 3,
        h: 5.5
    },
    {
        i: 'c',
        x: 6,
        y: 0,
        w: 3,
        h: 5.5
    },
    {
        i: 'd',
        x: 9,
        y: 0,
        w: 3,
        h: 5.5
    },
    {
        i: 'e',
        x: 0,
        y: 5.5,
        w: 12,
        h: 10
    },
    {
        i: 'f',
        x: 0,
        y: 15.5,
        w: 6,
        h: 10
    },
    {
        i: 'g',
        x: 6,
        y: 15.5,
        w: 6,
        h: 10
    },
    {
        i: 'h',
        x: 0,
        y: 25.5,
        w: 12,
        h: 10
    }
]
const templateLayouts1 = {
    lg: a,
    md: a,
    sm: a,
    xs: a,
    xxs: a
}

function Template1LayoutArea() {
    const data = [
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
    ].map((value, index) => ({value, index}));
    const config = {
        data,
        width: 220,
        height: 54,
        shapeField: 'smooth',
        xField: 'index',
        yField: 'value',
        style: {
            fill: '#d6e3fd',
            fillOpacity: 0.6,
        },
    };
    return <Tiny.Area {...config} />;
}

function a1() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, 3000)
    })
}

export function Dashboard(props: DashboardProps) {
    const {styles, theme} = useStyles()
    const [count, setCount] = useState(0)

    return <>
        {props.type === "template1" ? <ResponsiveReactGridLayout
            autoSize
            style={{position: "relative"}}
            layouts={templateLayouts1}
            margin={[18, 18]}
            isDroppable={false}
            isDraggable={false}
            breakpoints={{lg: 1000, md: 1000, sm: 1000, xs: 1000, xxs: 1000}}
            cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
            rowHeight={20}
        >
            <Card key={"a"} bodyStyle={{height: "100%", padding: "20px 24px 8px"}}>
                <div className={styles.template1Header}>
                    <div className={styles.template1HeaderTitle1}>总销售额</div>
                    <div className={styles.template1HeaderTitle2}>
                        ¥ 126,560
                    </div>
                    <Space className={styles.template1HeaderMain} size={16} align={"end"}>
                        <div>
                            周同比
                            <span style={{marginLeft: "8px"}}>12%</span>
                            <CaretUpOutlined style={{color: theme.red6}}/>
                        </div>
                        <div>
                            日同比
                            <span style={{marginLeft: "8px"}}>11%</span>
                            <CaretDownOutlined style={{color: theme.green6}}/>
                        </div>
                    </Space>
                    <Space className={styles.template1HeaderFooter} align={"center"}>
                        <div>日销售额</div>
                        <div>￥930,000</div>
                    </Space>
                </div>
            </Card>
            <Card key={"b"} bodyStyle={{height: "100%", padding: "20px 24px 8px"}}>
                <div className={styles.template1Header}>
                    <div className={styles.template1HeaderTitle1}>总销售额</div>
                    <div className={styles.template1HeaderTitle2}>
                        8,864
                    </div>
                    <div className={styles.template1HeaderMain}>
                        <Template1LayoutArea></Template1LayoutArea>
                    </div>
                    <Space className={styles.template1HeaderFooter} align={"center"}>
                        <div>日销售额</div>
                        <div>￥930,000</div>
                    </Space>
                </div>
            </Card>
            <Card key={"c"} bodyStyle={{height: "100%", padding: "20px 24px 8px"}}>
                <div className={styles.template1Header}>
                    <div className={styles.template1HeaderTitle1}>总销售额</div>
                    <div className={styles.template1HeaderTitle2}>
                        ¥ 126,560
                    </div>
                    <Space className={styles.template1HeaderMain} size={16} align={"end"}>
                        <div>
                            周同比
                            <span style={{marginLeft: "8px"}}>12%</span>
                            <CaretUpOutlined style={{color: theme.red6}}/>
                        </div>
                        <div>
                            日同比
                            <span style={{marginLeft: "8px"}}>11%</span>
                            <CaretDownOutlined style={{color: theme.green6}}/>
                        </div>
                    </Space>
                    <Space className={styles.template1HeaderFooter} align={"center"}>
                        <div>日销售额</div>
                        <div>￥930,000</div>
                    </Space>
                </div>
            </Card>
            <Card key={"d"} bodyStyle={{height: "100%", padding: "20px 24px 8px"}}>
                <div className={styles.template1Header}>
                    <div className={styles.template1HeaderTitle1}>总销售额</div>
                    <div className={styles.template1HeaderTitle2}>
                        ¥ 126,560
                    </div>
                    <Space className={styles.template1HeaderMain} size={16} align={"end"}>
                        <div>
                            周同比
                            <span style={{marginLeft: "8px"}}>12%</span>
                            <CaretUpOutlined style={{color: theme.red6}}/>
                        </div>
                        <div>
                            日同比
                            <span style={{marginLeft: "8px"}}>11%</span>
                            <CaretDownOutlined style={{color: theme.green6}}/>
                        </div>
                    </Space>
                    <Space className={styles.template1HeaderFooter} align={"center"}>
                        <div>日销售额</div>
                        <div>￥930,000</div>
                    </Space>
                </div>
            </Card>

            <div key={"e"} style={{border: "1px solid red"}}>
                <Template1LayoutArea></Template1LayoutArea>
            </div>
            <div key={"f"} style={{border: "1px solid red"}}>
                {count}
                <Button onClick={() => {
                    setCount(count + 1)
                }}>测试</Button>
            </div>
            <div key={"g"} style={{border: "1px solid red"}}></div>
            <div key={"h"} style={{border: "1px solid red"}}></div>
        </ResponsiveReactGridLayout> : null}
        {props.type === "template2" ? <div>模板2</div> : null}
        {props.type === "template3" ? <div>模板3</div> : null}
    </>
}