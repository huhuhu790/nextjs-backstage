import { Drawer, Form, Input, Button, Space } from "antd";

export default function DictDrawer({ open, onClose, title }: { open: boolean, onClose: (option: { update: boolean }) => void, title: string }) {
    const [form] = Form.useForm();
    const handleSubmit = () => {
        form.validateFields().then(async (values) => {
            handleClose({ update: true });
        }).catch((error) => {
            console.log(error);
        });
    }
    const handleClose = (options: { update: boolean } = { update: false }) => {
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
            placement={"right"}
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
                <Form.Item
                    label="字典表名称"
                    name="name"
                    rules={[{ required: true, message: '请输入字典表名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="字典表描述"
                    name="description"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Drawer>
    )
}

