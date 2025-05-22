"use client"

import { useState } from "react";
import { Button, Table, Space, Input, Drawer, Form, message, Switch } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { DictDrawerDataType } from "./dictPageType";
import { PaginationResponse } from "@/types/database";
import { BasicDict } from "@/types/system/dictionary";

export default function ClientPage({ initData }: { initData: PaginationResponse<BasicDict[]> }) {
    const [data, setData] = useState(initData);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState<string | undefined>();

    const columns = [
        {
            title: "字典类型",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "字典标签",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "字典值",
            dataIndex: "value",
            key: "value",
        },
        {
            title: "排序",
            dataIndex: "sort",
            key: "sort",
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (status: boolean) => (
                <Switch checked={status} disabled />
            ),
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
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
            // 刷新数据
        } catch (error) {
            message.error("删除失败");
        }
    };

    const handleSubmit = async (values: DictDrawerDataType) => {
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
                    placeholder="搜索字典类型或标签"
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
                    新建字典
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
                title={editingId ? "编辑字典" : "新建字典"}
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
                        name="type"
                        label="字典类型"
                        rules={[{ required: true, message: "请输入字典类型" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="label"
                        label="字典标签"
                        rules={[{ required: true, message: "请输入字典标签" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="value"
                        label="字典值"
                        rules={[{ required: true, message: "请输入字典值" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="sort"
                        label="排序"
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="状态"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="备注"
                    >
                        <Input.TextArea />
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