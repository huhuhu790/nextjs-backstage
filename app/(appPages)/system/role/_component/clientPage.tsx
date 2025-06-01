"use client"
import React, { useState } from 'react';
import { Button, Input, Table, Popconfirm, Space, App } from 'antd';
import type { TableColumnsType } from 'antd';
import { LocalRole } from '@/types/api';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { deleteRoleById, getRoleByPage } from '@/api/role';
import { PaginationResponse } from '@/types/database';
import dynamic from 'next/dynamic';

const PermissionDrawer = dynamic(() => import('./permissionDrawer'), { ssr: false })

const RoleDrawer = dynamic(() => import('./roleDrawer'), { ssr: false })

const UserDrawer = dynamic(() => import('./userDrawer'), { ssr: false })


function defaultItem(): LocalRole {
  return {
    name: '',
    description: '',
    permissions: [],
    users: []
  }
}

export default function ClientPage({ initData }: {
  initData: PaginationResponse<LocalRole[]>
}) {
  const [dataSource, setDataSource] = useState<LocalRole[]>(initData.data);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initData.currentPage!);
  const [pageSize, setPageSize] = useState(initData.pageSize!);
  const [total, setTotal] = useState(initData.total!);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<'新增' | '编辑'>('新增');
  const [currentItem, setCurrentItem] = useState<LocalRole>(defaultItem());
  const [openPermission, setOpenPermission] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const { message } = App.useApp()
  function updateTableData(keyword: string, currentPage: number, currentPageSize: number) {
    setLoading(true);
    getRoleByPage({
      keyword,
      currentPage: currentPage,
      pageSize: currentPageSize
    }).then(result => {
      if (result) {
        const { data, ...rest } = result
        setDataSource(data)
        setTotal(rest.total!)
        setCurrentPage(rest.currentPage!)
        setPageSize(rest.pageSize!)
      }
    }).catch(e => { }).finally(() => { setLoading(false); })
  }

  const handleSearch = () => {
    const keyword = searchText.trim()
    if (!keyword) {
      return;
    }
    setCurrentPage(1);
    updateTableData(keyword, 1, pageSize)
  };

  const handleReset = async () => {
    setSearchText('');
    setCurrentPage(1);
    updateTableData('', 1, pageSize)
  };

  const handleAdd = () => {
    setOpen(true);
    setTitle('新增');
    setCurrentItem(defaultItem());
  };

  const handleEdit = (record: LocalRole) => {
    setOpen(true);
    setTitle('编辑');
    setCurrentItem(record);
  };

  const handleDelete = (record: LocalRole) => {
    deleteRoleById(record.id!, message).then(res => {
      updateTableData(searchText, currentPage, pageSize)
    }).catch(error => { })
  };

  const handleEditPermission = (record: LocalRole) => {
    setOpenPermission(true);
    setCurrentItem(record);
  };

  const handleShowUsers = (record: LocalRole) => {
    setOpenUser(true);
    setCurrentItem(record)
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    updateTableData(searchText, page, pageSize)
  }

  const onClose = (result: { update: boolean }) => {
    setOpen(false);
    if (result.update) {
      updateTableData(searchText, currentPage, pageSize)
    }
  };

  const onClosePermission = (result: { update: boolean }) => {
    setOpenPermission(false);
    if (result.update) {
      updateTableData(searchText, currentPage, pageSize)
    }
  };

  const onCloseUser = (result: { update: boolean }) => {
    setOpenUser(false);
    if (result.update) {
      updateTableData(searchText, currentPage, pageSize)
    }
  };

  const columns: TableColumnsType<LocalRole> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left'
    },
    {
      title: '用户数量',
      dataIndex: 'users',
      key: 'users',
      width: 100,
      render: (users: string[]) => users.length
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 300,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleEditPermission(record)}>
            权限
          </Button>
          <Button type="link" onClick={() => handleShowUsers(record)}>
            用户
          </Button>
          <Popconfirm
            title="删除角色"
            description="确定要删除这个角色吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input
          placeholder="请输入角色名称"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
        >
          搜索
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
          loading={loading}
        >
          重置
        </Button>
        <Button type="primary" onClick={handleAdd}>
          新增角色
        </Button>
      </div>
      <Table<LocalRole>
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 'max-content', y: 400 }}
        loading={loading}
        pagination={{
          onChange: handlePageChange,
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共${total}条`
        }}
      />
      <RoleDrawer
        open={open}
        onClose={onClose}
        title={title}
        currentItem={currentItem}
      />
      <PermissionDrawer
        open={openPermission}
        onClose={onClosePermission}
        currentItem={currentItem}
      />
      <UserDrawer
        open={openUser}
        onClose={onCloseUser}
        currentItem={currentItem}
      />
    </>
  );
}