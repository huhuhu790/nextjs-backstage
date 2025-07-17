"use client"
import { Card, Form, Input, Button, App, Select, Row, Col } from "antd"
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
            <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{
                type: "success",
                to: "*",
                title: "",
                content: ""
            }}>
                <Row>
                    <Col span={12}>
                        <Form.Item name="type" label="消息类型" rules={[{ required: true, message: '请选择消息类型' }]}>
                            <Select
                                options={[
                                    { label: "success", value: "success" },
                                    { label: "info", value: "info" },
                                    { label: "error", value: "error" },
                                    { label: "warning", value: "warning" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="to" label="发送给">
                            <Select
                                options={[
                                    { label: "所有人", value: "*" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
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
