import { Button, Drawer, Form, Input, Radio, Space } from "antd";
import { MenuDrawerDataType } from "./menuPageType";
import { RefObject, useEffect, useState } from "react";
import IconSelectModal from "./iconSelectModal";
import { addMenu, updateMenu } from "@/api/menu";
export default function MenuDrawer({ open, onClose, title, currentItem, parentId, parentName }:
    {
        open: boolean,
        onClose: () => void,
        title: string,
        currentItem: MenuDrawerDataType,
        parentId: RefObject<string | null>,
        parentName: string | null
    }) {
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const onCloseModal = () => {
        setOpenModal(false);
    }
    const onSelect = (iconName: string) => {
        form.setFieldsValue({
            iconPath: iconName
        })
    }
    useEffect(() => {
        form.setFieldsValue(currentItem);
    }, [currentItem])
    const handleSubmit = async () => {
        form.validateFields().then(async (values) => {
            try {
                const data = { ...currentItem, ...values }
                if (title === "新增") {
                    await addMenu(data, parentId.current);
                } else {
                    await updateMenu(data, parentId.current);
                }
                onClose()
            } catch (error) {
                console.log(error);
            }
        }).catch((error) => {
            console.log(error);
        })
    }
    return (
        <>
            <Drawer
                title={title}
                placement={"right"}
                width={1000}
                onClose={onClose}
                open={open}
                maskClosable={false}
                forceRender
                extra={
                    <>
                        <Button onClick={onClose}>取消</Button>
                        <Button type="primary" onClick={handleSubmit}>
                            提交
                        </Button>
                    </>
                }
            >
                <Form
                    form={form}
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 22 }}
                >
                    <Form.Item label="权限ID">
                        {currentItem.id || "-"}
                    </Form.Item>
                    {
                        parentName &&
                        <Form.Item label="父级名称">
                            {parentName}
                        </Form.Item>
                    }
                    <Form.Item label="类型" name="type" rules={[{ required: true, message: "请选择类型" }]}>
                        <Radio.Group>
                            <Radio value="folder">目录</Radio>
                            <Radio value="menu">菜单</Radio>
                            <Radio value="button">按钮</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入名称" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="路径" name="path" rules={[{ required: true, message: "请输入路径" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="图标">
                        <Space.Compact style={{ width: '100%' }}>
                            <Form.Item name="iconPath" noStyle rules={[{ required: true, message: "请选择图标" }]}><Input disabled /></Form.Item>
                            <Button type="primary" onClick={() => setOpenModal(true)}>请选择图标</Button>
                        </Space.Compact>
                    </Form.Item>
                </Form>
            </Drawer>
            <IconSelectModal open={openModal} onClose={onCloseModal} onSelect={onSelect} />
        </>
    )
}