"use client"
import React, { Suspense, useRef, useState } from 'react';
import { Button, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { MenuDrawerDataType, MenuTableDataType } from './menuPageType';
import dynamic from 'next/dynamic';
import { LocalMenu } from '@/types/api';

const MenuDrawer = dynamic(() => import('./menuDrawer'), { ssr: false })

// 递归构建目录树
function buildTree(items: LocalMenu[], parentId: string | null): MenuTableDataType[] {
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

function defaultItem(): MenuDrawerDataType {
  return {
    name: '',
    path: '',
    iconPath: '',
    type: "folder",
  }
}

function getParentName(items: LocalMenu[], id: string): string | null {
  const item = items.find(item => item.id === id);
  if (item) {
    return item.name;
  }
  return null;
}

export default function ClientPage({ dataSource }: { dataSource: LocalMenu[] }) {
  const menuTree = buildTree(dataSource, null) || []
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<'新增' | '编辑'>('新增');
  const [currentItem, setCurrentItem] = useState<MenuDrawerDataType>(defaultItem());
  const [parentName, setParentName] = useState<string | null>(null);
  const parentId = useRef<string | null>(null);
  const handleAdd = () => {
    setOpen(true);
    setTitle('新增');
    parentId.current = null;
    setParentName(null);
    setCurrentItem(defaultItem());
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleAddSubItem = (record: MenuTableDataType) => {
    setOpen(true);
    setTitle('新增');
    parentId.current = record.parentId;
    setParentName(getParentName(dataSource, record.parentId!));
    setCurrentItem(defaultItem());
  };
  const handleEditItem = (record: MenuTableDataType) => {
    setOpen(true);
    setTitle('编辑');
    if (record.parentId) {
      parentId.current = record.parentId;
      setParentName(getParentName(dataSource, record.parentId));
    } else {
      parentId.current = null;
      setParentName(null);
    }
    setCurrentItem({
      id: record.key,
      name: record.name,
      path: record.path,
      iconPath: record.iconPath,
      type: record.type,
    });
  };
  const handleDeleteItem = (record: MenuTableDataType) => {
  };
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
          {record.type !== "button" ?
            <Button variant="text" color='default' onClick={() => handleAddSubItem(record)}>新增</Button>
            : <></>
          }
          <Button variant="text" color='default' onClick={() => handleEditItem(record)}>编辑</Button>
          <Button variant="text" color='red' onClick={() => handleDeleteItem(record)}>删除</Button>
        </>
        )
      },
    },
  ];
  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 4 }}
        onClick={handleAdd}
      >新增</Button>
      <Table<MenuTableDataType>
        pagination={false}
        columns={columns}
        dataSource={menuTree}
        scroll={{ x: 'max-content', y: 600 }}
      />
      <MenuDrawer
        open={open}
        onClose={onClose}
        title={title}
        currentItem={currentItem}
        parentId={parentId}
        parentName={parentName}
      />
    </>
  );
};