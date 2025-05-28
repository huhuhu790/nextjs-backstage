"use client"
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Card, Flex, Menu } from 'antd';
import { useState } from "react";
import UserSetting from "./_component/userSetting";
import PasswordManagement from './_component/passwordManagement';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '1',
        label: '用户设置',
        icon: <AppstoreOutlined />,
    },
    {
        key: '2',
        label: '密码管理',
        icon: <SettingOutlined />,
    },
];

const Page: React.FC = () => {
    const [currentItem, setCurrentItem] = useState<string>('1');
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrentItem(e.key);
    };

    const RenderContent = () => {
        switch (currentItem) {
            case '1':
                return <UserSetting />;
            case '2':
                return <PasswordManagement />;
        }
    };
    return (
        <Card>
            <Flex>
                <Menu
                    onClick={onClick}
                    style={{ width: 240 }}
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                />
                <div style={{ padding: '8px 0px 8px 40px', flex: 1 }}>
                    <RenderContent />
                </div>
            </Flex>
        </Card>
    );
};

export default Page;
