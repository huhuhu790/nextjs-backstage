"use client"

import { useState } from "react";
import { Button, Table, Space, Input, Drawer, Form, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { UserDrawerDataType } from "./userPageType";
import { PaginationResponse } from "@/types/database";
import { LocalUser } from "@/types/api";

export default function ClientPage({ initData }: { initData: PaginationResponse<LocalUser[]> }) {
    const [data, setData] = useState(initData);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState<string | undefined>();

    const columns = [
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "邮箱",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "电话",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "操作",
            key: "action",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const handleEdit = (record: any) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setDrawerVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {

            message.success("删除成功");

        } catch (error) {
            message.error("删除失败");
        }
    };

    const handleSubmit = async (values: UserDrawerDataType) => {
        try {
            if (editingId) {

                message.success("更新成功");
            } else {

                message.success("创建成功");
            }
            setDrawerVisible(false);
            form.resetFields();
            setEditingId(undefined);
            // 刷新数据
            // TODO: 实现数据刷新逻辑
        } catch (error) {
            message.error(editingId ? "更新失败" : "创建失败");
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between">
                <Input
                    placeholder="搜索用户名或邮箱"
                    prefix={<SearchOutlined />}
                    className="w-64"
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingId(undefined);
                        form.resetFields();
                        setDrawerVisible(true);
                    }}
                >
                    新建用户
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data.data}
                rowKey="id"
                pagination={{
                    total: data.total,
                    current: data.currentPage,
                    pageSize: data.pageSize,
                }}
            />
            <Drawer
                title={editingId ? "编辑用户" : "新建用户"}
                open={drawerVisible}
                onClose={() => {
                    setDrawerVisible(false);
                    form.resetFields();
                    setEditingId(undefined);
                }}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: "请输入用户名" }]}
                    >
                        <Input />
                    </Form.Item>
                    {!editingId && (
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[{ required: true, message: "请输入密码" }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="email"
                        label="邮箱"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="电话"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingId ? "更新" : "创建"}
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
} 