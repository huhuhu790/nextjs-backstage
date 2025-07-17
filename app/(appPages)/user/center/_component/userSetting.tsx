"use client"
import { userInfoAtom } from "@/store/user/userAtom";
import { useAtom } from "jotai";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { App, Button, DatePicker, Flex, Form, Input, Select, Upload } from 'antd';
import { useEffect, useState } from "react";
import { RcFile } from "antd/es/upload";
import { downloadFile } from "@/api/fetchApi";
import { LocalUser } from "@/types/api";
import dayjs from "dayjs";
import { updateUserOwnData } from "@/api/system/user";

type UserFromProps = Omit<LocalUser, "avatar" | "birthday"> & {
    avatar: RcFile[]
    birthday: dayjs.Dayjs
}

export default function UserSetting() {
    const [form] = Form.useForm();
    const [user, setUser] = useAtom(userInfoAtom);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp()
    useEffect(() => {
        if (!user) return;
        const { avatar, birthday, ...rest } = user;
        // 下载头像
        if (avatar)
            downloadFile(avatar, message).then((file) => {
                setImageUrl(URL.createObjectURL(file));
            }).catch((error) => {
               
            });
        form.setFieldsValue({
            birthday: birthday ? dayjs(birthday) : null,
            ...rest
        });
    }, [user]);
    const normFile = (e: { file: File }) => {
        return [e.file]
    };
    const uploadButton = (
        <div style={{ border: 0, background: 'none', cursor: 'pointer' }}>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
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
    const onFinish: FormProps<UserFromProps>['onFinish'] = async ({ avatar, birthday, ...values }) => {
        try {
            if (!user) return;
            const formData = new FormData();
            // 存在文件且与原文件名不一致时更新
            if (avatar && avatar.length > 0 && avatar[0].name !== user.avatar) {
                formData.append('avatar', avatar[0].name);
                formData.append('file', avatar[0]);
            }
            if (birthday) {
                formData.append('birthday', birthday.format('YYYY-MM-DD'));
            }
            if (values.email) {
                formData.append('email', values.email);
            }
            if (values.address) {
                formData.append('address', values.address);
            }
            formData.append('name', values.name);
            formData.append('gender', values.gender);
            formData.append('phone', values.phone);
            formData.append('id', user.id!);
            const result = await updateUserOwnData(formData, message);
            if (result) {
                setUser(result);
            }
        } catch (error) {
            
        }
    };
    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            layout="vertical"
            onFinish={onFinish}
        >
            <h2>用户设置</h2>
            <Flex>
                <div style={{ flex: 1.5 }}>
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '请输入姓名' }]}
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
                         rules={[{ required: true, message: '请输入邮箱' }]}
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
                    <Form.Item label={null} noStyle>
                        <Button type="primary" htmlType="submit">
                            更新基本信息
                        </Button>
                    </Form.Item>
                </div>
                <div style={{ flex: 1 }}>
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
                </div>
            </Flex>
        </Form>
    );
};