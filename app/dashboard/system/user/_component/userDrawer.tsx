import { Drawer, Form, Input, Button, Space, Select, DatePicker, Upload  } from "antd";
import { useState } from "react";


export default function UserDrawer({ open, onClose, title }: { open: boolean, onClose: (option: { update: boolean }) => void, title: string }) {
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState("https://img.yzcdn.cn/vant/ipad.png");
    const onFinish = () => {
    }
    const handleSubmit = () => {

    }
    const handleClose = () => {
        onClose({ update: false });
        form.resetFields();
        setAvatar("https://img.yzcdn.cn/vant/ipad.png");
    }
    return (
        <Drawer
            title={title}
            open={open}
            width={500}
            maskClosable={false}
            placement={"right"}
            onClose={handleClose}
            forceRender
            extra={
                <Space>
                    <Button onClick={handleClose}>取消</Button>
                    <Button type="primary" onClick={handleSubmit}>提交</Button>
                </Space>
            }
        >
            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item
                    label="头像"
                    name="avatar"
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
                        <img src={avatar} alt="avatar" style={{ width: '100%' }} />
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="工作ID"
                    name="workingId"
                    rules={[{ required: true, message: '请输入工作ID' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="性别"
                    name="gender"
                    rules={[{ required: true, message: '请选择性别' }]}
                >
                    <Select>
                        <Select.Option value="男">男</Select.Option>
                        <Select.Option value="女">女</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="电话"
                    name="phone"
                    rules={[{ required: true, message: '请输入电话' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="生日"
                    name="birthday"
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="地址"
                    name="address"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="部门"
                    name="department"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Drawer>
    )
}