import React, {useEffect} from 'react'
import {Button, Checkbox, Form, Input, message, Typography} from 'antd'
import {EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined} from '@ant-design/icons'
import {useNavigate} from "react-router"
import SliderCaptch from 'rc-slider-captcha';
import {login} from '@/api/index'
import {useAppStore, useMenuStore} from "@/store";
import {menuData} from "@/utils";
import {createStyles} from "antd-style";

const {Link} = Typography
const MainStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundImage: 'url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg)',
    paddingTop: '160px'
}
const TitleImgStyle = {
    width: "44px",
    height: '44px',
    marginRight: '16px'
}
const TitleStyle = {
    display: "flex",
    justifyContent: 'center',
    marginBottom: "36px"
}
const TitleTextStyle: React.CSSProperties = {
    position: 'relative',
    top: '2px',
    color: 'rgba(0,0,0,.85)',
    fontWeight: '600',
    fontSize: '33px'
}
const ContentStyle: React.CSSProperties = {
    width: '350px',
    display: 'flex',
    flexDirection: 'column',
}
const BottomStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: "border-box",
    padding: "16px 0px 20px 0px"
}
const PassWordStyle = {
    display: 'flex'
}
const PassWordValidStyle = {
    marginRight: '10px'
}
const LanguageStyle: React.CSSProperties = {
    position: "absolute",
    top: '20px',
    right: "20px"
}
const TitleContentStyle = {
    marginTop: '12px',
    marginBottom: '40px',
    color: 'rgba(0,0,0,.45)',
    fontSize: '14px',
}
const items = [
    {
        label: '中文简体',
        key: '1',
    },
    {
        label: '繁体中文',
        key: '2',
    },
    {
        label: '英文',
        key: '3',
    },
    {
        label: '缅甸文',
        key: '4',
    },
    {
        label: '越南文',
        key: '5',
    },
];

const useStyles = createStyles(({token, css}) => ({
    customSlider: {
        "--rcsc-primary": token["blue-5"],
        "--rcsc-primary-light": token['blue-2'],
        "--rcsc-error": token["red-5"],
        "--rcsc-error-light": token['red-2'],
        "--rcsc-success": token["purple-5"],
        "--rcsc-success-light": token['purple-2']
    }
}))

export default function Login() {
    const {styles, theme} = useStyles()
    const initData = {
        userName: 18483628931,
        userId: 18483628931
    }
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const appStore = useAppStore()

    const onFinish = async () => {
        useMenuStore.setState({
            mainNavData: menuData,
            // asideBarSelection: menuData[0].id,
            menuData: menuData[0].children,
            // menuDataSelection: "/"
        })

        // window.localStorage.setItem("token", result.token);
        // navigate("/")
        const {autoLogin, userName, userId} = form.getFieldsValue();
        let result = await login({
            account: userName,
            password: userId
        });
        result = {
            token: "wxx"
        }
        if (autoLogin) {
            window.localStorage.setItem("remeber", JSON.stringify({autoLogin, userName, userId}));
        }
        setTimeout(() => {
            navigate("/")
        }, 300)
        window.localStorage.setItem("token", result.token);
        navigate("/")
        return
        message.error(result?.message && '登录失败');
    }

    const onFinishFailed = () => {
    }

    useEffect(() => {
        // if (initData) {
        //     onFinish()
        // }
    }, [])

    return <div style={MainStyle}>
        <div style={TitleStyle}>
            <img src={appStore.logo} style={TitleImgStyle}/>
            <div style={TitleTextStyle}>{appStore.name}</div>
        </div>
        <div style={ContentStyle}>
            <Form
                size="large"
                name="basic"
                form={form}
                wrapperCol={{span: 24}}
                style={{maxWidth: 600}}
                initialValues={initData}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off">
                <Form.Item
                    name="userName"
                    rules={[{required: true, message: '请输入用户名!'}]}>
                    <Input
                        size="large"
                        placeholder="请输入用户名"
                        allowClear
                        prefix={<UserOutlined/>}
                    />
                </Form.Item>
                <Form.Item
                    name="userId"
                    rules={[{required: true, message: '请输入密码!'}]}>
                    <Input.Password
                        size="large"
                        placeholder="请输入密码"
                        prefix={<LockOutlined/>}
                        iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                    />
                </Form.Item>
                <SliderCaptch
                    bgSize={{width: 350}}
                    mode="slider"
                    className={styles.customSlider}
                    tipText={{
                        default: '请按住滑块，拖动到最右边',
                        moving: '请按住滑块，拖动到最右边',
                        error: '验证失败，请重新操作',
                        success: '验证成功'
                    }}
                    errorHoldDuration={1000}
                    onVerify={(data) => {
                        console.log(data, 'data');
                        return Promise.resolve();
                    }}
                />
                <div style={BottomStyle}>
                    <Checkbox>自动登录</Checkbox>
                    <Link>
                        忘记密码?
                    </Link>
                </div>
                <Form.Item>
                    <Button htmlType="submit" style={{width: "100%"}}
                        // onClick={() => {
                        //     window.localStorage.setItem("token", "zym-LOGIN-HAHHA")
                        //     setTimeout(() => {
                        //         navigate("/")
                        //     }, 300)
                        // }}
                            type='primary' size="large">登录</Button>
                </Form.Item>
            </Form>
        </div>
    </div>
}