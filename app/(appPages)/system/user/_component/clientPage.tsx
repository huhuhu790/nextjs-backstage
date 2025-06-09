"use client"

import { useState } from "react";
import { Button, Table, Space, Input, TableColumnsType, Popconfirm, App } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationResponse } from "@/types/database";
import { LocalUser } from "@/types/api";
import dynamic from "next/dynamic";
import { getUserByOption, deleteUserSingle } from "@/api/system/user";
import dayjs from "dayjs";

const UserDrawer = dynamic(() => import("./userDrawer"), { ssr: false });
const RoleDrawer = dynamic(() => import("./roleDrawer"), { ssr: false });

function defaultItem(): Partial<LocalUser> {
    return {
        username: '',
        name: '',
        workingId: '',
        email: '',
        phone: '',
        avatar: '',
        roles: [],
        address: '',
    }
}

export default function ClientPage({ initData }: { initData: PaginationResponse<LocalUser[]> }) {
    const [data, setData] = useState(initData.data);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initData.currentPage!);
    const [pageSize, setPageSize] = useState(initData.pageSize!);
    const [total, setTotal] = useState(initData.total!);
    const [title, setTitle] = useState('');
    const [currentItem, setCurrentItem] = useState<Partial<LocalUser>>(defaultItem());
    const [roleDrawerVisible, setRoleDrawerVisible] = useState(false);
    const { message } = App.useApp()
    const columns: TableColumnsType<LocalUser> = [
        {
            title: '用户名',
            dataIndex: 'username',
            width: 200,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: '工号',
            dataIndex: 'workingId',
            width: 200,
        },
        {
            title: '性别',
            dataIndex: 'gender',
            width: 100,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            width: 200,
        },
        {
            title: '部门',
            dataIndex: 'department',
            width: 200,
        },
        {
            title: '角色',
            dataIndex: 'roles',
            render: (roles: string[]) => roles.join(','),
            width: 300,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: 200,
        },
        {
            title: '地址',
            dataIndex: 'address',
            width: 300,
        },
        {
            title: '生日',
            dataIndex: 'birthday',
            width: 200,
            render: (birthday: string) => {
                if (!birthday) return ''
                return dayjs(birthday).format('YYYY-MM-DD')
            }
        },
        {
            title: "操作",
            key: "action",
            align: 'center',
            fixed: 'right',
            width: 300,
            render: (_: null, record: LocalUser) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Button type="link" onClick={() => handleRole(record)}>
                        角色
                    </Button>
                    <Popconfirm
                        title="删除用户"
                        description="确定要删除这个用户吗？"
                        onConfirm={() => handleDelete(record.id!)}
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

    const handleEdit = (record: LocalUser) => {
        setDrawerVisible(true);
        setTitle('编辑');
        setCurrentItem(record);
    };

    const handleRole = (record: LocalUser) => {
        setRoleDrawerVisible(true);
        setCurrentItem(record);
    };

    const handleDelete = (id: string) => {
        setLoading(true);
        deleteUserSingle(id, message).then(result => {
            updateTableData('', currentPage, pageSize);
        }).catch(e => {
            
        }).finally(() => {
            setLoading(false);
        })
    };

    const handleSearch = () => {
        const keyword = searchText.trim()
        if (!keyword) {
            return;
        }
        setCurrentPage(1);
        updateTableData(keyword, 1, pageSize)
    }

    const handleReset = async () => {
        setSearchText('');
        setCurrentPage(1);
        updateTableData('', 1, pageSize)
    };

    const handleAdd = () => {
        setDrawerVisible(true);
        setTitle('新增');
        setCurrentItem(defaultItem());
    };

    function updateTableData(keyword: string, currentPage: number, currentPageSize: number) {
        setLoading(true);
        getUserByOption({
            keyword,
            currentPage,
            pageSize: currentPageSize
        }).then(result => {
            if (result) {
                setData(result.data)
                setTotal(result.total)
                setCurrentPage(result.currentPage!)
                setPageSize(result.pageSize!)
            }
        }).catch(e => {
            
        }).finally(() => {
            setLoading(false);
        })
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page)
        setPageSize(pageSize)
        updateTableData(searchText, page, pageSize)
    }

    const handleCloseUser = (option: { update: boolean }) => {
        setDrawerVisible(false);
        if (option.update) {
            updateTableData('', currentPage, pageSize);
        }
    }

    const handleCloseRole = (option: { update: boolean }) => {
        setRoleDrawerVisible(false);
        if (option.update) {
            updateTableData('', currentPage, pageSize);
        }
    }
    return (
        <>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                <Input
                    placeholder="搜索用户名"
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
                <Button
                    type="primary"
                    loading={loading}
                    onClick={handleAdd}>
                    新增用户
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                scroll={{ y: 500, x: "max-content" }}
                pagination={{
                    onChange: handlePageChange,
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showTotal: (total) => `共${total}条`
                }}
            />
            <UserDrawer open={drawerVisible} onClose={handleCloseUser} title={title} currentItem={currentItem} />
            <RoleDrawer open={roleDrawerVisible} onClose={handleCloseRole} currentItem={currentItem} />
        </>
    );
} 