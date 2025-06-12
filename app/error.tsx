"use client"
import { Button } from 'antd';
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
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
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
        <Button onClick={reset} >
          Something went wrong!Try again
        </Button>
      </ConfigProvider>
    </AntdRegistry>
  )
}