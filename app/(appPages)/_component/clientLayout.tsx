"use client"
import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, Layout, theme, Flex } from 'antd';
import { usePathname } from 'next/navigation';
import styles from './page.module.css';
import AvatarArea from './avatarArea';
import MenuTree from './menuTree';
import TabsBar from './tabBars';
import { LocalMenu } from '@/types/api';
import { useAtomValue } from "jotai/index";
import { darkModeAtom } from "@/store/system/themeAtom";

const { Header, Sider, Content } = Layout;

const layoutCSS: React.CSSProperties = {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden'
}

const RootLayout = (
    { children, menuData }:
        React.PropsWithChildren<{ menuData: LocalMenu[] }>) => {
    // 收缩目录
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const darkMode = useAtomValue(darkModeAtom)
    // 主题配置
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={layoutCSS}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
                style={{
                    overflow: 'auto'
                }}
            >
                <div className={styles.logo} />
                <MenuTree
                    activeKey={pathname}
                    menuItems={menuData}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        marginLeft: 8,
                        padding: 8,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        height: 112
                    }}>
                    <Flex justify='space-between' align='center' style={{ marginBottom: 8 }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 48,
                            }}
                        />
                        <AvatarArea menuData={menuData} />
                    </Flex>
                    <TabsBar
                        className={`${styles.tabs} ${darkMode ? styles.tabsDark : styles.tabsLight}`}
                        activeKey={pathname}
                        menuData={menuData}
                    />
                </Header>
                <Content
                    style={{
                        padding: 8,
                        margin: "8px 0 0 8px",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'auto'
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default RootLayout;