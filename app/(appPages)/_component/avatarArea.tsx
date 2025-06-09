import { App, Avatar, Badge, Button, Dropdown, Flex, MenuProps } from "antd";
import { BellFilled, MoonFilled, SearchOutlined, SunFilled, UserOutlined } from '@ant-design/icons';
import { userInfoAtom } from '@/store/user/userAtom';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef, useState } from "react";
import { handleLogout } from "@/api/auth";
import { useRouter } from "next/navigation";
import { downloadFile } from "@/api/fetchApi";
import { pushingMessage } from "@/api/system/message";
import { LocalMenu, LocalMessage } from "@/types/api";
import SelectMenu from "./selectMenu";
import { darkModeAtom } from "@/store/system/themeAtom";

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
    const { notification, message } = App.useApp()
    const [showSearch, setShowSearch] = useState(false);
    const [darkMode, setDarkMode] = useAtom(darkModeAtom)
    const eventSource = useRef<EventSource>(null)

    const onClick: MenuProps['onClick'] = async (e) => {
        switch (e.key) {
            case '0':
                router.push('/user/center');
                break;
            case '1':
                try {
                    await handleLogout(message);
                    location.reload();
                } catch (error) {
                    
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
            downloadFile(user.avatar, message).then((file) => {
                setImageUrl(URL.createObjectURL(file));
            }).catch((error) => {
                
            });
    }, [user]);

    useEffect(() => {
        if (!eventSource.current) {
            eventSource.current = pushingMessage((event) => {
                try {
                    const data: LocalMessage = JSON.parse(event.data);
                    if (data.id) {
                        setHasNewMessage(true)
                        notification.info({
                            message: '新消息',
                            description: `${data.title}, ${data.content}`,
                            duration: null
                        });
                    }
                } catch (error) {
                    
                }
            });
            return () => {
                eventSource.current?.close();
                eventSource.current = null;
            }
        }
    }, []);

    const handleMessage = () => {
        setHasNewMessage(false)
        router.push('/user/message')
    }

    const handleShowSearch = () => {
        setShowSearch(!showSearch)
    }

    const handleModeChange = () => {
        setDarkMode(!darkMode)
    }

    return (
        <Flex align='center'>
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
                    <BellFilled style={{ fontSize: '20px' }} />
                </Badge>}
                onClick={handleMessage}
                style={{
                    width: 40,
                    height: 40,
                    marginRight: 8
                }}
            />
            <Button
                type="text"
                icon={darkMode ?
                    <MoonFilled style={{ fontSize: '20px' }} /> :
                    <SunFilled style={{ fontSize: '20px' }} />}
                onClick={handleModeChange}
                style={{
                    width: 40,
                    height: 40,
                    marginRight: 8
                }}
            />
            <Dropdown menu={{ items, onClick }} trigger={['click']}>
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