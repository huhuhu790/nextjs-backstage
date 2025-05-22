"use client"
import { Button, Drawer, Form, Input } from "antd";
import { RoleDataBasicWithoutPermissions } from "./rolePageType";
import { useEffect } from "react";
import { addRole, updateRole } from "@/api/role";

export default function RoleDrawer({
    open,
    onClose,
    title,
    currentItem,
}: {
    open: boolean;
    onClose: (result: { update: boolean }) => void;
    title: string;
    currentItem: RoleDataBasicWithoutPermissions;
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(currentItem);
    }, [currentItem]);

    const handleSubmit = async () => {
        form.validateFields().then(async (values) => {
            try {
                const data = { id: currentItem.id, ...values };
                if (title === "新增") {
                    await addRole(data);
                } else {
                    await updateRole(data);
                }
                onClose({ update: true });
            } catch (error) {
                console.log(error);
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <Drawer
            title={title}
            placement={"right"}
            width={800}
            onClose={() => onClose({ update: false })}
            open={open}
            maskClosable={false}
            forceRender
            extra={
                <>
                    <Button onClick={() => onClose({ update: false })}>取消</Button>
                    <Button type="primary" onClick={handleSubmit}>
                        提交
                    </Button>
                </>
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