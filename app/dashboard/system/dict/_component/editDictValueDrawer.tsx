import { Drawer, Form, Input, Space, Button } from "antd";

export default function EditDictValueDrawer({ open, onClose, title }: { open: boolean, onClose: (option: { update: boolean }) => void, title: string }) {
    const [form] = Form.useForm();
    const onFinish = () => {
    }
    const handleSubmit = () => {
        form.submit();
    }
    const handleClose = () => {
        onClose({ update: false });
        form.resetFields();
    }
    return (
        <Drawer
            title={title}
            open={open}
            onClose={handleClose}
            width={500}
            maskClosable={false}
            placement={"left"}
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
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item label="字典值名称" name="name" rules={[{ required: true, message: '请输入字典值名称' }]}>
                    <Input />
                </Form.Item >
                <Form.Item label="字典值数据" name="value" rules={[{ required: true, message: '请输入字典值数据' }]}>
                    <Input />
                </Form.Item >
                <Form.Item label="字典值描述" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item >
            </Form >
        </Drawer >
    )
}