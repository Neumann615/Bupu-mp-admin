import React from 'react';
import type {ProColumns} from '@ant-design/pro-components'
import {ProColumns, ProTable, TableDropdown} from "@ant-design/pro-components"
import {Button} from "antd";
import {DownOutlined} from "@ant-design/icons"

function User() {

    const valueEnum = {
        0: 'close',
        1: 'running',
        2: 'online',
        3: 'error',
    };

    type TableListItem = {
        key: number;
        name: string;
        containers: number;
        creator: string;
        status: string;
        createdAt: number;
        memo: string;
        createTime: string | Date;
        updateTime: string | Date
    };
    const tableListDataSource: TableListItem[] = [];

    const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];

    for (let i = 0; i < 25; i += 1) {
        tableListDataSource.push({
            key: i,
            name: 'AppName',
            containers: Math.floor(Math.random() * 20),
            creator: creators[Math.floor(Math.random() * creators.length)],
            status: valueEnum[((Math.floor(Math.random() * 10) % 4) + '') as '0'],
            createdAt: Date.now() - Math.floor(Math.random() * 100000),
            createTime: new Date(),
            updateTime: new Date(),
            memo:
                i % 2 === 1
                    ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴'
                    : '简短备注文案',
        });
    }

    const columns: ProColumns<TableListItem>[] = [
        {
            title: '应用名称',
            width: 120,
            dataIndex: 'name',
            render: (_) => <a>{_}</a>,
        },
        {
            title: '容器数量',
            dataIndex: 'containers',
            align: 'center',
            sorter: (a, b) => a.containers - b.containers,
        },
        {
            title: '创建时间',
            width: 220,
            dataIndex: 'createTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '更新时间',
            width: 220,
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '状态',
            width: 120,
            dataIndex: 'status',
            initialValue: 'all',
            valueEnum: {
                all: {text: '全部', status: 'Default'},
                close: {text: '关闭', status: 'Default'},
                running: {text: '运行中', status: 'Processing'},
                online: {text: '已上线', status: 'Success'},
                error: {text: '异常', status: 'Error'},
            },
        },
        {
            title: '创建者',
            width: 120,
            dataIndex: 'creator',
            valueEnum: {
                all: {text: '全部'},
                付小小: {text: '付小小'},
                曲丽丽: {text: '曲丽丽'},
                林东东: {text: '林东东'},
                陈帅帅: {text: '陈帅帅'},
                兼某某: {text: '兼某某'},
            },
        },
        {
            title: '操作',
            width: 180,
            key: 'option',
            valueType: 'option',
            render: () => [
                <a key="link">链路</a>,
                <a key="link2">报警</a>,
                <a key="link3">监控</a>,
                <TableDropdown
                    key="actionGroup"
                    menus={[
                        {key: 'copy', name: '复制'},
                        {key: 'delete', name: '删除'},
                    ]}
                />,
            ],
        },
    ]

    return <ProTable<TableListItem>
        dataSource={tableListDataSource}
        rowKey="key"
        pagination={{
            showQuickJumper: true,
            pageSize: 10
        }}
        columns={columns}
        search={false}
        dateFormatter="string"
        headerTitle="统计表格"
        toolBarRender={() => [
            <Button key="show">查看日志</Button>,
            <Button key="out">
                导出数据
                <DownOutlined/>
            </Button>,
            <Button type="primary" key="primary">
                创建应用
            </Button>,
        ]}
    />
}

export default User;
