import { handleLogout } from "@/api/auth";
import { updateUserOwnPassword } from "@/api/system/user";
import { App, Button, Form, Input } from "antd";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { userInfoAtom } from "@/store/user/userAtom";


export default function PasswordManagement() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const user = useAtomValue(userInfoAtom);
    const { message } = App.useApp()
    const onFinish = (values: any) => {
        setLoading(true);
        updateUserOwnPassword({
            originPassword: values.originPassword,
            newPassword: values.newPassword,
            id: user?.id || ""
        }, message).then((res) => {
            form.resetFields();
            message.success("密码更新成功,请重新登录");
            setTimeout(() => {
                handleLogout(message).then(() => {
                    location.reload();
                }).catch((err) => {

                })
            }, 1000);
        }).catch((err) => {
            setLoading(false);
        }).finally(() => {
            setLoading(false);
        })
    };
    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 12 }}
            layout="vertical"
            onFinish={onFinish}
        >
            <h2>密码管理</h2>
            <Form.Item label="原密码" name="originPassword" rules={[{ required: true, message: '请输入原密码' }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码' }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item label="确认密码" name="confirmPassword" rules={[
                { required: true, message: '请再次输入密码' },
                {
                    validator: (rule, value) => {
                        if (!value) {
                            return Promise.reject('请输入确认密码');
                        }
                        if (value !== form.getFieldValue('newPassword')) {
                            return Promise.reject('两次密码不一致');
                        }
                        return Promise.resolve();
                    }
                }
            ]}>
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 16 }} noStyle>
                <Button type="primary" htmlType="submit" loading={loading}>
                    更新密码
                </Button>
            </Form.Item>
        </Form>
    );
};