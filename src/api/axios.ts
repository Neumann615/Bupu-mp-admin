import axios from 'axios';
import { message } from 'antd';

const service = axios.create({
    baseURL: "", // 设置基础URL
    timeout: 200000, // 设置超时时间
    headers: {
        'Content-Type': 'application/json',
    },
});

// 添加请求拦截器
service.interceptors.request.use(
    config => {
        // 显示加载指示器
        // 如果你的antd版本支持，请使用 message.loading 或 antd的Spin组件
        message.loading('Loading...');

        // 在这里可以添加例如token等信息到headers
        if (localStorage.getItem('token')) {
            config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        }

        return config;
    },
    error => {
        // 错误处理
        message.error('Request error');
        //return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    response => {
        // 关闭加载指示器
        message.destroy();

        // 处理成功的响应
        return response.data;
    },
    error => {
        // 关闭加载指示器
        message.destroy();

        // 处理错误响应
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message.error('Unauthorized');
                    break;
                case 403:
                    message.error('Forbidden');
                    break;
                case 404:
                    message.error('Not Found');
                    break;
                default:
                    message.error('Error');
                    break;
            }
        } else if (error.request) {
            message.error('No response received');
        } else {
            message.error('Something went wrong');
        }

        //return Promise.reject(error);
    }
);

export default service;