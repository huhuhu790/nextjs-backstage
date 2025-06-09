import { addDict, updateDict } from "@/api/system/dict";
import { LocalDict } from "@/types/api";
import { Drawer, Form, Input, Button, Space, App } from "antd";
import { useEffect } from "react";
export default function DictDrawer({ open, onClose, title, currentItem }: {
    open: boolean,
    onClose: (option: { update: boolean }) => void,
    title: string,
    currentItem: Partial<LocalDict>
}) {
    const [form] = Form.useForm();
    const { message } = App.useApp()
    useEffect(() => {
        if (open && currentItem) {
            form.setFieldsValue(currentItem);
        }
    }, [currentItem, open]);
    const handleSubmit = () => {
        form.validateFields().then(async (values) => {
            if (currentItem.id) {
                await updateDict({
                    id: currentItem.id,
                    ...values
                }, message);
            } else {
                await addDict(values, message);
            }
            handleClose({ update: true });
        }).catch((error) => {
         
        });
    }
    const handleClose = (options: { update: boolean } = { update: false }) => {
        form.resetFields();
        onClose(options);
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

