"use client"
import type { FormProps } from 'antd';
import { Button, Form, Input, Card, Layout, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation'
import { useAtom } from 'jotai';
import { userInfoAtom } from '@/store/user/userAtom';
import { useEffect } from 'react';
import type { LoginFieldType } from '@/app/login/loginType';
import { handleLogin } from '@/api/login';

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openNotification = (message: string) => {
    notification.error({
      message: '登出失败',
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
  const [user, setUser] = useAtom(userInfoAtom);
  const onFinish: FormProps<LoginFieldType>['onFinish'] = async (values) => {
    try {
      const data = await handleLogin(values);
      if (data) {
        setUser(data);
      }
      notification.destroy();
      router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX!);
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishFailed: FormProps<LoginFieldType>['onFinishFailed'] = (errorInfo) => {
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
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<LoginFieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginFieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          {/* <Form.Item<LoginFieldType> name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  )
};

export default Page;
