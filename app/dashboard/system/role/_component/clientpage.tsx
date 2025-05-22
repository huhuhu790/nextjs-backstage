"use client"
import React, { useState } from 'react';
import { Button, Input, Table, Popconfirm, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import { LocalRole } from '@/types/api';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { RoleTableDataType, RoleDataBasicWithoutPermissions } from './rolePageType';
import { deleteRoleById, getRoleByPage } from '@/api/role';
import { PaginationResponse } from '@/types/database';
import dynamic from 'next/dynamic';



const RoleDrawer = dynamic(() => import('./roleDrawer'), { ssr: false })

function initTableData(initData: LocalRole[]): RoleTableDataType[] {
  return initData.map(item => ({
    key: item.id,
    name: item.name,
    description: item.description,
    permissions: item.permissions,
    users: item.users,
  }))
}

function defaultItem(): RoleDataBasicWithoutPermissions {
  return {
    name: '',
    description: ''
  }
}

export default function ClientPage({ initData }: {
  initData: PaginationResponse<LocalRole[]>
}) {
  const [dataSource, setDataSource] = useState<RoleTableDataType[]>(initTableData(initData.data));
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initData.currentPage);
  const [pageSize, setPageSize] = useState(initData.pageSize);
  const [total, setTotal] = useState(initData.total);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<'新增' | '编辑'>('新增');
  const [currentItem, setCurrentItem] = useState<RoleDataBasicWithoutPermissions>(defaultItem());

  function updateTableData(keyword: string) {
    setLoading(true);
    getRoleByPage({
      keyword,
      currentPage,
      pageSize
    }).then(result => {
      if (result) {
        const { data, ...rest } = result
        setDataSource(data.map(item => ({
          key: item.id,
          name: item.name,
          description: item.description,
          permissions: item.permissions,
          users: item.users,
        })))
        setTotal(rest.total)
        setCurrentPage(rest.currentPage)
        setPageSize(rest.pageSize)
      }
    }).catch(e => { }).finally(() => { setLoading(false); })
  }

  const handleSearch = () => {
    const keyword = searchText.trim()
    if (!keyword) {
      return;
    }
    updateTableData(keyword)
  };

  const handleReset = async () => {
    setSearchText('');
    updateTableData('')
  };

  const handleAdd = () => {
    setOpen(true);
    setTitle('新增');
    setCurrentItem(defaultItem());
  };

  const handleEdit = (record: RoleTableDataType) => {
    setOpen(true);
    setTitle('编辑');
    setCurrentItem({
      id: record.key,
      name: record.name,
      description: record.description
    });
  };

  const handleDelete = (record: RoleTableDataType) => {
    deleteRoleById(record.key).then(res => {
      updateTableData(searchText);
    }).catch(error => { })
  };

  const handleEditPermission = (record: RoleTableDataType) => {
    // TODO: 实现编辑权限的逻辑
  };

  const handleShowUsers = (record: RoleTableDataType) => {
    // TODO: 实现显示用户的逻辑
  };

  const handlePageChange = (page: number, pageSize: number) => {
    updateTableData(searchText)
  }

  const onClose = (result: { update: boolean }) => {
    setOpen(false);
    if (result.update) {
      updateTableData(searchText);
    }
  };

  const columns: TableColumnsType<RoleTableDataType> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: '用户数量',
      dataIndex: 'users',
      key: 'users',
      width: 100,
      render: (users: string[]) => users.length
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
      <Table<RoleTableDataType>
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
    </>
  );
}