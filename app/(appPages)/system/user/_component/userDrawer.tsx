import { Drawer, Form, Input, Button, Space, Select, DatePicker, Upload, App } from "antd";
import { useEffect, useRef, useState } from "react";
import { LocalUser } from "@/types/api";
import { RcFile } from "antd/lib/upload";
import { addUser, updateUserSingle } from "@/api/system/user";
import dayjs from "dayjs";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { downloadFile } from "@/api/fetchApi";

type UserFromProps = Omit<LocalUser, "avatar" | "birthday"> & {
    avatar: RcFile[]
    birthday: dayjs.Dayjs
}

export default function UserDrawer({ open, onClose, title, currentItem }: {
    open: boolean,
    onClose: (option: { update: boolean }) => void,
    title: string,
    currentItem: Partial<LocalUser>
}) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const originalFilename = useRef<string | null>(null);
    const { message } = App.useApp()

    const uploadButton = (
        <div style={{ border: 0, background: 'none', cursor: 'pointer' }}>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        if (!open) return
        const { avatar, birthday, ...rest } = currentItem;
        originalFilename.current = avatar || null
        // 下载头像
        if (avatar) {
            downloadFile(avatar, message).then((file) => {
                setImageUrl(URL.createObjectURL(file));
                form.setFieldsValue({
                    birthday: birthday ? dayjs(birthday) : null,
                    ...rest
                });
            }).catch((error) => {

            });
        } else form.setFieldsValue({
            avatar: [],
            birthday: birthday ? dayjs(birthday) : null,
            ...rest
        });
    }, [currentItem, open]);

    const normFile = (e: { file: File }) => {
        return [e.file]
    };

    const handleSubmit = () => {
        form.validateFields().then(async ({ avatar, birthday, ...values }: UserFromProps) => {
            const formData = new FormData();
            // 存在文件且与原文件名不一致时更新
            if (avatar && avatar.length > 0 && avatar[0].name !== originalFilename.current) {
                formData.append('avatar', avatar[0].name);
                formData.append('file', avatar[0]);
            }
            if (birthday) {
                formData.append('birthday', birthday.toISOString());
            }
            if (values.email) {
                formData.append('email', values.email);
            }
            if (values.address) {
                formData.append('address', values.address);
            }
            // if (values.department) {
            //     formData.append('department', values.department.join(','));
            // }
            formData.append('username', values.username);
            formData.append('name', values.name);
            formData.append('workingId', values.workingId);
            formData.append('gender', values.gender);
            formData.append('phone', values.phone);
            if (title === "新增") {
                await addUser(formData, message);
            } else {
                formData.append('id', currentItem.id!);
                await updateUserSingle(formData, message);
            }
            handleClose({ update: true });
        }).catch((error) => {

        });
    }
    const handleClose = (options: { update: boolean }) => {
        form.resetFields();
        setImageUrl(null);
        originalFilename.current = null
        onClose(options);
    }
    const beforeUpload = (file: RcFile) => {
        setLoading(true);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传JPG/PNG文件!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
            return false;
        }
        setImageUrl(URL.createObjectURL(file));
        setLoading(false);
        return false
    }
    return (
        <Drawer
            title={title}
            open={open}
            width={500}
            maskClosable={false}
            placement={"right"}
            onClose={() => handleClose({ update: false })}
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
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item
                    label="头像"
                    name="avatar"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        name="logo"
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                    >
                        {imageUrl ?
                            <img
                                src={imageUrl}
                                alt="avatar"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 8,
                                    objectFit: "cover"
                                }}
                            /> :
                            uploadButton
                        }
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
                    label="姓名"
                    name="name"
                    rules={[{ required: true, message: '请输入姓名' }]}
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
                        <Select.Option value="其他">其他</Select.Option>
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
                    rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
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
                {/* <Form.Item
                    label="部门"
                    name="department"
                >
                    <Select mode="multiple">
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                    </Select>
                </Form.Item> */}
            </Form>
        </Drawer>
    )
}