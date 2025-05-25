import { Drawer, Form, Input, Space, Button } from "antd";

export default function EditDictValueDrawer({ open, onClose, title }: { open: boolean, onClose: (option: { update: boolean }) => void, title: string }) {
    const [form] = Form.useForm();
    const handleSubmit = () => {
        form.validateFields().then(async (values) => {
            handleClose({ update: true });
        }).catch((error) => {
            console.log(error);
        });
    }
    const handleClose = (options: { update: boolean }) => {
        onClose(options);
        form.resetFields();
    }
    return (
        <Drawer
            title={title}
            open={open}
            onClose={() => handleClose({ update: false })}
            width={500}
            maskClosable={false}
            placement={"left"}
            forceRender
            extra={
                <Space>
                    <Button onClick={() => handleClose({ update: false })}>取消</Button>
                    <Button type="primary" onClick={handleSubmit}>提交</Button>
                </Space>
            }
        >
            <Form
                form={form}
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