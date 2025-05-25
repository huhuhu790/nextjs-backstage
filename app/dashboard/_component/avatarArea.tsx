import { Avatar, Flex, Dropdown, MenuProps, Button } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { userInfoAtom } from '@/store/user/userAtom';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from "react";
import { handleLogout } from "@/api/login";
import { useRouter } from "next/navigation";
import { downloadFile } from "@/api/fetchApi";

const items: MenuProps['items'] = [
    {
        label: '个人中心',
        key: '0',
        icon: <UserOutlined />,
    },
    {
        label: '登出',
        key: '1',
        icon: <UserOutlined />,
    },
];

const AvatarArea = () => {
    const user = useAtomValue(userInfoAtom);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const onClick: MenuProps['onClick'] = async (e) => {
        switch (e.key) {
            case '0':
                router.push('/dashboard/user/center');
                break;
            case '1':
                try {
                    await handleLogout();
                    location.reload();
                } catch (error) {
                    console.log(error);
                }
                break;
        }
    };
    const userIcon = useMemo(() => {
        const username = user?.username;
        return username ? username.slice(0, 1).toUpperCase() : "";
    }, [user])
    useEffect(() => {
        // 下载头像
        if (user && user.avatar)
            downloadFile(user.avatar).then((file) => {
                setImageUrl(URL.createObjectURL(file));
            }).catch((error) => {
                console.log(error);
            });
    }, [user]);
    return (
        <Dropdown menu={{ items, onClick }} trigger={['click']} >
            <Button type="text" size="large" style={{ marginRight: 16 }}>
                <Flex justify='left' align='center'>
                    {imageUrl ? <Avatar src={imageUrl} /> :
                        <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>{userIcon}</Avatar>
                    }
                    <div style={{ marginLeft: 8, lineHeight: "14px" }}>{user?.username}</div>
                </Flex>
            </Button>
        </Dropdown>
    )
}

export default AvatarArea;