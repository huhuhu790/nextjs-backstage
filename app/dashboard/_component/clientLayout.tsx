"use client"
import { useMemo, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, Layout, theme, Flex } from 'antd';
import { usePathname } from 'next/navigation';
import styles from './page.module.css';
import { MenuItemWithID } from '@/types/menu';
import AvatarArea from './avatarArea';
import MenuTree from './menuTree';
import TabsBar from './tabBars';

const { Header, Sider, Content } = Layout;

const layoutCSS: React.CSSProperties = {
  height: '100vh',
  width: '100vw',
  overflow: 'hidden'
}

const RootLayout = (
  { children, menuData }:
    React.PropsWithChildren<{ menuData: MenuItemWithID[] }>) => {
  // 收缩目录
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  // 设置当前激活的目录与tab
  const activeKey = useMemo(() => {
    if (pathname === process.env.NEXT_PUBLIC_SYSTEM_PREFIX) return '/';
    return pathname.replace(process.env.NEXT_PUBLIC_SYSTEM_PREFIX!, '');
  }, [pathname])
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
          activeKey={activeKey}
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
            <AvatarArea />
          </Flex>
          <TabsBar
            className={styles.tabs}
            activeKey={activeKey}
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