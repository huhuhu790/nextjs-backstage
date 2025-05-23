"use client"
import { LocalMenu } from '@/types/api';
import { UserOutlined, SyncOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

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

function getOpenKeys(menuItems: LocalMenu[], activeKey: string, keys: string[]) {
  const menuItem = menuItems.find(item => item.id === activeKey)
  if (menuItem) {
    keys.unshift(menuItem.path)
    if (menuItem.parentId) {
      return getOpenKeys(menuItems, menuItem.parentId, keys)
    }
  }
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
  const [openKeys, setOpenKeys] = useState<string[]>([])
  useEffect(() => {
    if (activeKey === "/") return setOpenKeys([activeKey])
    const item = menuItems.find(item => item.path === activeKey)!
    const keys: string[] = [item.id]
    if (item.parentId) getOpenKeys(menuItems, item.parentId, keys)
    setOpenKeys(keys)
  }, [])
  const handleSelect: MenuProps["onSelect"] = (info) => {
    router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX + info.key);
  }
  return (
    <Menu
      style={{ border: "none" }}
      mode="inline"
      openKeys={openKeys}
      defaultSelectedKeys={[activeKey]}
      selectedKeys={[activeKey]}
      onSelect={handleSelect}
      onOpenChange={setOpenKeys}
      items={items}
    />
  )
}