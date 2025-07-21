"use client"
import type { FormProps } from 'antd';
import { Button, Form, Input, Card, Layout, Checkbox, App } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation'
import { useSetAtom } from 'jotai';
import { userInfoAtom } from '@/store/user/userAtom';
import { Suspense, useEffect } from 'react';
import { handleLogin } from '@/api/auth';
import { sha256 } from '@/utils/clientUtils';
import { LoginFieldType } from '@/types/api';
import { permissionsAtom } from '@/store/user/permissionsAtom';

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notification, message } = App.useApp()
  const openNotification = (message: string) => {
    notification.error({
      message: '登录失败',
      description: message,
      duration: 0,
    });
  };
  useEffect(() => {
    const message = searchParams.get('revoked');
    switch (message) {
      case "0":
        openNotification('您的账号登录已过期，请重新登录。');
        break;
      case "1":
        openNotification('您的账号已在其他地方登录，您已被强制下线。');
        break;
    }
  }, [searchParams])
  const setUser = useSetAtom(userInfoAtom)
  const setPermissions = useSetAtom(permissionsAtom)
  const onFinish: FormProps<LoginFieldType>['onFinish'] = async (values) => {
    try {
      const data = await handleLogin({
        username: values.username!.trim(),
        password: await sha256(values.password!.trim()),
      }, message);
      if (data) {
        setUser(data.userInfo);
        setPermissions(data.permission);
      }
      notification.destroy();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Layout style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: 400 }}>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<LoginFieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginFieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<LoginFieldType> name="remember" valuePropName="checked" label={null}>
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  )
};

export default function Page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  )
}
