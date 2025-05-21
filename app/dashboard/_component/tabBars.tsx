"use client"
import { Dropdown,  MenuProps, Tabs, TabsProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LocalMenu } from '@/types/api';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const tabDropDownMenuItems: MenuProps['items'] = [
    {
        label: '关闭',
        key: '0',
    },
    {
        label: '关闭其他',
        key: '1',
    },
    {
        label: '关闭右侧',
        key: '2',
    },
    {
        label: '关闭所有',
        key: '3',
    },
];

const initialItems = [
    { label: '首页', children: '', key: '/', closable: false, },
];

export default function TabsBar({
    activeKey,
    menuData,
    className
}: {
    activeKey: string,
    menuData: LocalMenu[],
    className?: string,
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [items, setItems] = useState(initialItems);
    // 处理切换tab
    const onChange = (key: string) => {
        router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX + key);
    };
    // 路由变化时新增tab
    useEffect(() => {
        if (pathname === process.env.NEXT_PUBLIC_SYSTEM_PREFIX) return;
        const systemPath = pathname.replace(process.env.NEXT_PUBLIC_SYSTEM_PREFIX!, '');
        if (items.findIndex((pane) => pane.key === systemPath) > -1) return;
        const menuitem = menuData.find((pane) => pane.path === systemPath)!;
        const newPanes = [...items];
        newPanes.push({ label: menuitem?.name, children: '', key: systemPath, closable: true });
        setItems(newPanes);
    }, [pathname])
    // 处理关闭所选tab
    const remove = (targetKey: TargetKey) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey);
        const newPanes = items.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
            router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX + key);
        }
        setItems(newPanes);
    };
    // 处理关闭其他tab,保留首页和当前tab
    const removeOthers = (targetKey: TargetKey) => {
        const newPanes = items.filter((pane) => pane.key === targetKey || pane.key === initialItems[0].key);
        router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX! + targetKey);
        setItems(newPanes);
    }
    // 处理关闭所有tab
    const removeAll = () => {
        router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX!);
        setItems(initialItems);
    }
    // 处理关闭右侧tab
    const removeRight = (targetKey: TargetKey) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey);
        const newPanes = items.filter((pane, index) => index <= targetIndex || pane.key === initialItems[0].key);
        router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX! + targetKey);
        setItems(newPanes);
    }
    const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
        if (action === 'remove') {
            remove(targetKey);
        }
    };
    const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => {
        const handleClick = (menuKey: string, nodeKey: string) => {
            switch (menuKey) {
                case '0':
                    remove(nodeKey);
                    break;
                case '1':
                    removeOthers(nodeKey);
                    break;
                case '2':
                    removeRight(nodeKey);
                    break;
                case '3':
                    removeAll();
                    break;
            }
        }
        return (
            <DefaultTabBar {...props}>
                {(node) => {
                    return node.key === '/' ? node : (
                        <Dropdown
                            menu={{
                                items: tabDropDownMenuItems,
                                onClick: (e) => handleClick(e.key, node.key!),
                            }}
                            trigger={['contextMenu']}>
                            {node}
                        </Dropdown>
                    )
                }}
            </DefaultTabBar>
        )
    }
    return (
        <Tabs
            className={className}
            hideAdd
            size='middle'
            onChange={onChange}
            activeKey={activeKey}
            type="editable-card"
            onEdit={onEdit}
            items={items}
            renderTabBar={renderTabBar}
        />
    )
}