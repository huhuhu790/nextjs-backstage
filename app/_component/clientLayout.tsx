"use client"
import {UserWithID} from '@/types/system/user';
import {AntdRegistry} from '@ant-design/nextjs-registry';
import {userInfoAtom} from '@/store/user/userAtom';
import {useHydrateAtoms} from 'jotai/utils';
import '@ant-design/v5-patch-for-react-19';
import zhCN from 'antd/locale/zh_CN';
import {App, ConfigProvider, theme} from 'antd';
import {permissionsAtom} from '@/store/user/permissionsAtom';
import {useEffect} from "react";
import {darkModeAtom} from "@/store/system/themeAtom";
import {useAtom} from "jotai";

const ClientLayout = ({children, userData, permissions}:
                      React.PropsWithChildren<{ userData: UserWithID | null, permissions: string[] }>) => {
    useHydrateAtoms([[userInfoAtom, userData], [permissionsAtom, permissions]])
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
                <App component={false}>
                    {children}
                </App>
            </ConfigProvider>
        </AntdRegistry>
    )
};

export default ClientLayout;