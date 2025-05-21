import { Avatar, Flex, Dropdown, MenuProps, Button } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { userInfoAtom } from '@/store/user/userAtom';
import { useAtom } from 'jotai';
import { useMemo } from "react";
import { handleLogout } from "@/api/login";

const items: MenuProps['items'] = [
    {
        label: '登出',
        key: '1',
        icon: <UserOutlined />,
    },
];

const AvatarArea = () => {
    const [user, setUser] = useAtom(userInfoAtom);
    const onClick: MenuProps['onClick'] = async () => {
        try {
            await handleLogout();
            location.reload();
        } catch (error) {
            console.log(error);
        }
    };
    const userIcon = useMemo(() => {
        const username = user?.username;
        return username ? username.slice(0, 1).toUpperCase() : "";
    }, [user])
    return (
        <Dropdown menu={{ items, onClick }} trigger={['click']} >
            <Button type="text" size="large" style={{ marginRight: 16 }}>
                <Flex justify='left' align='center'>
                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>{userIcon}</Avatar>
                    <div style={{ marginLeft: 8, lineHeight: "14px" }}>{user?.username}</div>
                </Flex>
            </Button>
        </Dropdown>
    )
}

export default AvatarArea;