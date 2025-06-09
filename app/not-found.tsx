"use client"
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider, theme } from 'antd';
import { useEffect } from "react";
import { darkModeAtom } from "@/store/system/themeAtom";
import { useAtom } from "jotai";

const layoutCSS: React.CSSProperties = {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden'
}

const Page: React.FC = () => {
    const router = useRouter();
    const [darkMode, setDarkMode] = useAtom(darkModeAtom)
    useEffect(() => {
        const mediaQueryList = matchMedia('(prefers-color-scheme: dark)');
        setDarkMode(mediaQueryList.matches);
    }, [])
    return (
        <AntdRegistry>
            <ConfigProvider locale={zhCN} theme={{
                algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
            }}>
                <Result
                    style={{ backgroundColor: darkMode ? 'black' : 'white', ...layoutCSS }}
                    status="404"
                    title="404"
                    subTitle="抱歉，您访问的页面不存在。"
                    extra={<Button type="primary" onClick={() => { router.push("/") }}>返回主页</Button>}
                />
            </ConfigProvider>
        </AntdRegistry>
    );
}

export default Page;