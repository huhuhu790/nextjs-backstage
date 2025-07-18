"use client"
import { App, Button, Drawer, Form, Input, Space } from "antd";
import { LocalRole } from "@/types/api";
import { useEffect } from "react";
import { addRole, updateRole } from "@/api/system/role";

export default function RoleDrawer({
    open,
    onClose,
    title,
    currentItem,
}: {
    open: boolean;
    onClose: (result: { update: boolean }) => void;
    title: string;
    currentItem: LocalRole;
}) {
    const [form] = Form.useForm();
    const { message } = App.useApp()
    useEffect(() => {
        form.setFieldsValue(currentItem);
    }, [currentItem]);

    const handleSubmit = async () => {
        form.validateFields().then(async (values) => {
            const data = { id: currentItem.id, ...values };
            if (title === "新增") {
                await addRole(data, message);
            } else {
                await updateRole(data, message);
            }
            handleClose({ update: true });
        }).catch((error) => {
           
        });
    };
    const handleClose = (options: { update: boolean }) => {
        form.resetFields();
        onClose(options);
    }

    return (
        <Drawer
            title={title}
            placement={"right"}
            width={800}
            onClose={() => handleClose({ update: false })}
            open={open}
            maskClosable={false}
            forceRender
            extra={
                <Space>
                    <Button onClick={() => handleClose({ update: false })}>取消</Button>
                    <Button type="primary" onClick={handleSubmit}>
                        提交
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item
                    label="角色名称"
                    name="name"
                    rules={[{ required: true, message: "请输入角色名称" }]}
                >
                    <Input placeholder="请输入角色名称" />
                </Form.Item>
                <Form.Item
                    label="描述"
                    name="description"
                >
                    <Input.TextArea
                        placeholder="请输入角色描述"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                </Form.Item>
            </Form>
        </Drawer>
    );
} 