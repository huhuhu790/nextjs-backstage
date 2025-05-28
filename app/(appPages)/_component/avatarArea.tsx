import { Avatar, Flex, Dropdown, MenuProps, Button, Badge, notification } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { userInfoAtom } from '@/store/user/userAtom';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from "react";
import { handleLogout } from "@/api/login";
import { useRouter } from "next/navigation";
import { downloadFile } from "@/api/fetchApi";
import { NotificationOutlined } from "@ant-design/icons";
import { pushingMessage } from "@/api/message";
import { LocalMessage } from "@/types/api";
import SelectMenu from "./selectMenu";

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
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [api, contextHolder] = notification.useNotification();

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
        const name = user?.name;
        return name ? name.slice(0, 1).toUpperCase() : "";
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

    useEffect(() => {
        const close = pushingMessage((event) => {
            try {
                const data: LocalMessage = JSON.parse(event.data);
                if (data.id) {
                    setHasNewMessage(true)
                    api.info({
                        message: '新消息',
                        description: `${data.title}, ${data.content}`,
                        duration: null
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })
        return close;
    }, []);

    const handleMessage = () => {
        setHasNewMessage(false)
        router.push('/user/message')
    }


    return (
        <Flex>
            {contextHolder}
            <SelectMenu />
            <Button
                type="text"
                icon={<Badge dot={hasNewMessage}>
                    <NotificationOutlined />
                </Badge>}
                onClick={handleMessage}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 40,
                }}
            />
            <Dropdown menu={{ items, onClick }} trigger={['click']} >
                <Button type="text" size="large" style={{ marginRight: 16 }}>
                    <Flex justify='left' align='center'>
                        {imageUrl ? <Avatar src={imageUrl} /> :
                            <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>{userIcon}</Avatar>
                        }
                        <div style={{ marginLeft: 8, lineHeight: "14px" }}>{user?.name}</div>
                    </Flex>
                </Button>
            </Dropdown>
        </Flex>
    )
}

export default AvatarArea;