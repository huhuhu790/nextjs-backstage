"use client"
import React, { Suspense, useMemo, useRef, useState } from 'react';
import { App, Button, Popconfirm, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { LocalMenu } from '@/types/api';
import { deleteMenu, getMenuAll } from '@/api/system/menu';

type MenuTableDataType = Omit<LocalMenu, "children"> & {
  children?: MenuTableDataType[]
}

const MenuDrawer = dynamic(() => import('./menuDrawer'), { ssr: false })

// 递归构建目录树
function buildTree(items: LocalMenu[], parentId: string | null): MenuTableDataType[] {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => {
      const { children, ...result } = item
      if (children && children.length > 0) {
        (result as MenuTableDataType).children = buildTree(items, item.id!) || []
      }
      return result
    });
}

function defaultItem(): LocalMenu {
  return {
    name: '',
    path: '',
    iconPath: '',
    type: "folder",
    parentId: null
  }
}

function getParentName(items: LocalMenu[], id: string): string | null {
  const item = items.find(item => item.id === id);
  if (item) {
    return item.name;
  }
  return null;
}

export default function ClientPage({ initData }: { initData: LocalMenu[] }) {
  const rawData = useRef<LocalMenu[]>(initData)
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<MenuTableDataType[]>(buildTree(initData, null))
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<'新增' | '编辑'>('新增');
  const [currentItem, setCurrentItem] = useState<LocalMenu>(defaultItem());
  const [parentName, setParentName] = useState<string | null>(null);
  const parentId = useRef<string | null>(null);
  const { message } = App.useApp()
  const handleAdd = () => {
    setOpen(true);
    setTitle('新增');
    parentId.current = null;
    setParentName(null);
    setCurrentItem(defaultItem());
  };
  function updateTable() {
    setLoading(true)
    getMenuAll().then(res => {
      rawData.current = res || []
      setDataSource(buildTree(rawData.current, null));
    }).catch(error => { }).finally(() => setLoading(false))
  }
  const onClose = (result: { update: boolean }) => {
    setOpen(false);
    if (result.update) { updateTable() }
  };
  const columns: TableColumnsType<MenuTableDataType> = useMemo(() => {
    const handleAddSubItem = (record: MenuTableDataType) => {
      setOpen(true);
      setTitle('新增');
      parentId.current = record.id!;
      setParentName(record.name);
      setCurrentItem(defaultItem());
    };
    const handleEditItem = (record: MenuTableDataType) => {
      setOpen(true);
      setTitle('编辑');
      if (record.parentId) {
        parentId.current = record.id!;
        setParentName(getParentName(rawData.current, record.parentId));
      } else {
        parentId.current = null;
        setParentName(null);
      }
      setCurrentItem({
        id: record.id,
        name: record.name,
        path: record.path,
        iconPath: record.iconPath,
        type: record.type,
        parentId: parentId.current
      });
    };
    const handleDeleteItem = (record: MenuTableDataType) => {
      deleteMenu(record.id!, message).then(res => {
        updateTable()
      }).catch(error => { })
    }
    return [
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
        title: '权限码',
        dataIndex: 'id',
        key: 'id',
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
            const IconComponent = dynamic(() => import(`@ant-design/icons`).then((mod: any) => mod[value]), {});
            return <Suspense fallback={<SyncOutlined spin />}> <IconComponent /> </Suspense>
          }
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
              <Button type="link" onClick={() => handleAddSubItem(record)}>新增</Button>
              : <></>
            }
            <Button type="link" onClick={() => handleEditItem(record)}>编辑</Button>
            <Popconfirm
              title="删除"
              description="确定删除目录吗?"
              onConfirm={() => handleDeleteItem(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button variant="text" color='red'>删除</Button>
            </Popconfirm>
          </>
          )
        },
      },
    ]
  }, []);
  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 4 }}
        onClick={handleAdd}
        loading={loading}
      >新增</Button>
      <Table<MenuTableDataType>
        rowKey="id"
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 'max-content', y: 400 }}
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