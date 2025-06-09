import { LocalAuditTestProgramme } from "@/types/projects/auditTestProgramme";
import { addAuditTestProgramme, updateAuditTestProgramme } from "@/api/projects/auditTestProgramme";
import { Drawer, Form, Input, Button, Space, App, Upload, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { RcFile } from "antd/es/upload";
import { uploadFile } from "@/api/file";
import SelectPathModal from "./selectPath";

type FormValues = LocalAuditTestProgramme & {
    programmeFile?: RcFile[] | null
}

export default function DictDrawer({ open, onClose, title, currentItem }: {
    open: boolean,
    onClose: (option: { update: boolean }) => void,
    title: string,
    currentItem: Partial<LocalAuditTestProgramme>
}) {
    const [form] = Form.useForm();
    const { message } = App.useApp()
    const [spinning, setSpinning] = useState(false);
    const [openSelectPathModal, setOpenSelectPathModal] = useState(false);
    const formName = useRef<string>('');
    const pathType = useRef<string>('');

    useEffect(() => {
        if (open && currentItem) {
            form.setFieldsValue(currentItem);
        }
    }, [currentItem, open]);
    const handleSubmit = () => {
        setSpinning(true);
        form.validateFields().then(async (values: FormValues) => {
            if (!values.programmeFile || values.programmeFile.length === 0) {
                message.error('请上传程序文件');
                return;
            }
            const filename = await uploadFile(values.programmeFile[0])
            const data = {
                newFileName: filename,
                name: values.name,
                originFilePath: values.originFilePath,
                originFileName: values.originFileName,
                newFilePath: values.newFilePath,
                backupPath: values.backupPath,
            }
            if (currentItem.id) {
                await updateAuditTestProgramme(data, message);
            } else {
                await addAuditTestProgramme(data, message);
            }
            handleClose({ update: true });
        }).catch((error) => {

        }).finally(() => {
            setSpinning(false);
        });
    }
    const handleClose = (options: { update: boolean } = { update: false }) => {
        form.resetFields();
        onClose(options);
    }
    const normFile = (e: { file: File }) => {
        return [e.file]
    };
    const beforeUpload = (file: RcFile) => {
        return false
    }
    const handleCloseSelectPathModal = (key?: string[]) => {
        setOpenSelectPathModal(false);
        if (key) {
            console.log(key);

        }
    }
    const handleOpenSelectPathModal = (name: string, typeName: string) => {
        formName.current = name;
        pathType.current = typeName;
        setOpenSelectPathModal(true);
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
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: '请输入名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="原文件路径"
                    name="originFilePath"
                    rules={[{ required: true, message: '请输入原文件路径' }]}
                >
                    <Input onClick={() => handleOpenSelectPathModal('originFilePath', 'ftp')} />
                </Form.Item>
                <Form.Item
                    label="原文件名"
                    name="originFileName"
                    rules={[{ required: true, message: '请输入原文件名' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="新文件路径"
                    name="newFilePath"
                    rules={[{ required: true, message: '请输入新文件路径' }]}
                >
                    <Input onClick={() => handleOpenSelectPathModal('newFilePath', 'ftp')} />
                </Form.Item>
                <Form.Item
                    label="备份路径"
                    name="backupPath"
                    rules={[{ required: true, message: '请输入备份路径' }]}
                >
                    <Input onClick={() => handleOpenSelectPathModal('backupPath', 'bak')} />
                </Form.Item>
                <Form.Item
                    label="程序文件"
                    name="programmeFile"
                    valuePropName="programmeFile"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        name="programmeFile"
                        beforeUpload={beforeUpload}
                        maxCount={1}
                    >
                        <Button>选择程序</Button>
                    </Upload>
                </Form.Item>
            </Form>
            <Spin spinning={spinning} fullscreen percent="auto">
                {"正在上传文件中，请勿关闭！"}
            </Spin>
            <SelectPathModal open={openSelectPathModal} onClose={handleCloseSelectPathModal} />
        </Drawer>
    )
}

