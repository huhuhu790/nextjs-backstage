"use client"
import { LocalMenu } from '@/types/api';
import { UserOutlined, SyncOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense, useMemo } from 'react';

const initialMenuItem = [
  {
    key: '/',
    icon: <UserOutlined />,
    label: '首页'
  },
];

// 递归构建目录树
function buildTree(items: LocalMenu[], parentId: string | null): MenuProps["items"] {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => {
      const Icon = dynamic(() => import(`@ant-design/icons/lib/icons/${item.iconPath}`));
      const data = {
        key: item.path,
        icon: <Suspense fallback={<SyncOutlined spin />}> <Icon /> </Suspense>,
        label: item.name,
      }
      if (item.type === "folder") {
        const children = buildTree(items, item.id) || [];
        return { ...data, children }
      } else {
        return data
      }
    });
}

function buildMenuItems(dbMenuData: LocalMenu[]): MenuProps["items"] {
  const menuTree = buildTree(dbMenuData, null) || []
  return [...initialMenuItem, ...menuTree]
}

export default function MenuTree({
  activeKey,
  menuItems,
}: {
  activeKey: string,
  menuItems: LocalMenu[]
}) {
  const router = useRouter();
  const items = useMemo(() => {
    return buildMenuItems(menuItems) || [];
  }, [menuItems])
  return (
    <Menu
      style={{ border: "none" }}
      mode="inline"
      defaultSelectedKeys={[activeKey]}
      selectedKeys={[activeKey]}
      onSelect={(info) => {
        router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX + info.key);
      }}
      items={items}
    />
  )
}