import { Avatar, Flex, Dropdown, MenuProps, Button, Badge, notification } from "antd";
import { SearchOutlined, UserOutlined, NotificationOutlined } from '@ant-design/icons';
import { userInfoAtom } from '@/store/user/userAtom';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from "react";
import { handleLogout } from "@/api/login";
import { useRouter } from "next/navigation";
import { downloadFile } from "@/api/fetchApi";
import { pushingMessage } from "@/api/message";
import { LocalMenu, LocalMessage } from "@/types/api";
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

const AvatarArea = ({ menuData }: { menuData: LocalMenu[] }) => {
    const user = useAtomValue(userInfoAtom);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [showSearch, setShowSearch] = useState(false);


    const onClick: MenuProps['onClick'] = async (e) => {
        switch (e.key) {
            case '0':
                router.push('/user/center');
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

    const handleShowSearch = () => {
        setShowSearch(!showSearch)
    }

    return (
        <Flex align='center'>
            {contextHolder}
            <SelectMenu menuData={menuData} showSearch={showSearch} />
            <Button
                type="text"
                icon={<SearchOutlined style={{ fontSize: '20px' }} />}
                onClick={handleShowSearch}
                style={{
                    width: 40,
                    height: 40,
                    margin: "0 8px"
                }}
            />
            <Button
                type="text"
                icon={<Badge dot={hasNewMessage}>
                    <NotificationOutlined style={{ fontSize: '20px' }} />
                </Badge>}
                onClick={handleMessage}
                style={{
                    width: 40,
                    height: 40,
                    marginRight: 8
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