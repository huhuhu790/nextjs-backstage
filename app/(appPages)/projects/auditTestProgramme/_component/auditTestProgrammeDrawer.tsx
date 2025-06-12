import { GetRelativePathApiProps, LocalAuditTestProgramme } from "@/types/projects/auditTestProgramme";
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
    const pathType = useRef<GetRelativePathApiProps['type']>('backup');

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
            const filename = await uploadFile(values.programmeFile[0], message)
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
    const handleCloseSelectPathModal = (key?: string) => {
        setOpenSelectPathModal(false);
        if (key) {
            if (pathType.current === "save") {
                if (key === "/") return message.error('请选择正确路径');
                const lastSlashIndex = key.lastIndexOf('/');
                if (lastSlashIndex === -1) return message.error('请选择正确路径');
                form.setFieldValue("originFileName", key.substring(lastSlashIndex + 1))
                form.setFieldValue(formName.current, key.substring(0, lastSlashIndex + 1))
            } else form.setFieldValue(formName.current, key)
        }
    }
    const handleOpenSelectPathModal = (name: string, typeName: GetRelativePathApiProps['type']) => {
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
                    rules={[{ required: true, message: '请选择原文件路径' }]}
                >
                    <Input.Search onSearch={() => handleOpenSelectPathModal('originFilePath', 'save')} />
                </Form.Item>
                <Form.Item
                    label="原文件名"
                    name="originFileName"
                    rules={[{ required: true, message: '请选择原文件路径' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="新文件路径"
                    name="newFilePath"
                    rules={[{ required: true, message: '请选择新文件路径' }]}
                >
                    <Input.Search onSearch={() => handleOpenSelectPathModal('newFilePath', 'savePath')} />
                </Form.Item>
                <Form.Item
                    label="备份路径"
                    name="backupPath"
                    rules={[{ required: true, message: '请选择备份路径' }]}
                >
                    <Input.Search onSearch={() => handleOpenSelectPathModal('backupPath', 'backup')} />
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
                {"正在提交中，请勿关闭！"}
            </Spin>
            <SelectPathModal open={openSelectPathModal} onClose={handleCloseSelectPathModal} type={pathType} />
        </Drawer>
    )
}

