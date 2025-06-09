"use client"
import { Card, Form, Input, Button, App } from "antd"
import { sendingMessage } from "@/api/system/message"
export default function Page() {
    const [form] = Form.useForm()
    const { message } = App.useApp()
    const onFinish = (values: any) => {
        sendingMessage(values, message).then((res) => {
        }).catch((err) => {
            
        })
    }
    return (
        <Card title="发送消息">
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item name="title" label="消息标题" rules={[{ required: true, message: '请输入消息标题' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="content" label="消息内容" rules={[{ required: true, message: '请输入消息内容' }]}>
                    <Input.TextArea rows={6} />
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" htmlType="submit">发送</Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
