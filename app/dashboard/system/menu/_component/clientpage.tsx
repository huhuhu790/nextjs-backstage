"use client"
import React, { Suspense, useState } from 'react';
import { Button, Drawer, Flex, Table } from 'antd';
import type { DrawerProps, TableColumnsType } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { MenuTableDataType } from './menuPage';
import { MenuItemWithID } from '@/types/menu';
import dynamic from 'next/dynamic';

// 递归构建目录树
function buildTree(items: MenuItemWithID[], parentId: string | null): MenuTableDataType[] {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => {
      const { id, children, ...rest } = item
      if (children && children.length > 0) {
        return { key: id, ...rest, children: buildTree(items, item.id) || [] }
      }
      return { key: id, ...rest }
    });
}

const columns: TableColumnsType<MenuTableDataType> = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left'
  },
  {
    title: '路径',
    dataIndex: 'path',
    key: 'path',
    minWidth: 400
  },
  {
    title: '图标',
    dataIndex: 'iconPath',
    width: 100,
    key: 'iconPath',
    align: 'center',
    render(value: string, record, index) {
      if (value) {
        const Icon = dynamic(() => import(`@ant-design/icons/lib/icons/${value}`));
        return <Suspense fallback={<SyncOutlined spin />}> <Icon /> </Suspense>
      }
      return (<></>)
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 100,
    key: 'type',
    align: 'center',
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    align: 'center',
    width: 250,
    render(_, record, index) {
      return (<>
        {record.type !== "button" ? <Button variant="text" color='default'>新增</Button> : <></>}
        <Button variant="text" color='yellow'>编辑</Button>
        <Button variant="text" color='red'>删除</Button>
      </>
      )
    },
  },
];

function MenuDrawer({ open, onClose }: { open: boolean, onClose: () => void }) {
  return (
    <Drawer
      title="Drawer with extra actions"
      placement={"right"}
      width={1000}
      onClose={onClose}
      open={open}
      maskClosable={false}
      extra={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onClose}>
            OK
          </Button>
        </>
      }
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  )
}

export default function ClientPage({ dataSource }: { dataSource: MenuItemWithID[] }) {
  const menuTree = buildTree(dataSource, null) || []
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 4 }}
        onClick={showDrawer}
      >新增</Button>
      <Table<MenuTableDataType>
        pagination={false}
        columns={columns}
        dataSource={menuTree}
        scroll={{ x: 'max-content', y: 600 }}
      />
      <MenuDrawer open={open} onClose={onClose} />
    </>
  );
};