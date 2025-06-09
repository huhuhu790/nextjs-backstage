"use client"

import { useState } from "react";
import { Button, Table, Space, Input, TableColumnsType, Popconfirm, App } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationResponse } from "@/types/database";
import { LocalDict } from "@/types/api";
import dynamic from "next/dynamic";
import { deleteDict, getDictList } from "@/api/system/dict";

const DictDrawer = dynamic(() => import("./dictDrawer"), { ssr: false });
const DictValuesDrawer = dynamic(() => import("./dictValuesDrawer"), { ssr: false });

function defaultItem(): Partial<LocalDict> {
    return {
        name: '',
        values: [],
        description: '',
    }
}

export default function ClientPage({ initData }: { initData: PaginationResponse<LocalDict[]> }) {
    const [data, setData] = useState(initData.data);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initData.currentPage!);
    const [pageSize, setPageSize] = useState(initData.pageSize!);
    const [total, setTotal] = useState(initData.total!);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [currentItem, setCurrentItem] = useState<Partial<LocalDict>>(defaultItem());
    const [dictValuesDrawerVisible, setDictValuesDrawerVisible] = useState(false);
    const { message } = App.useApp()

    const columns: TableColumnsType<LocalDict> = [
        {
            title: "字典表名称",
            dataIndex: "name",
            key: "name",
            width: 300,
        },
        {
            title: "字典表描述",
            dataIndex: "description",
            key: "description",
            minWidth: 100,
        },
        {
            title: "操作",
            key: "action",
            align: 'center',
            fixed: 'right',
            width: 300,
            render: (_: null, record: LocalDict) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Button type="link" onClick={() => handleEditValues(record)}>
                        配置
                    </Button>
                    <Popconfirm
                        title="删除字典表"
                        description="确定要删除这个字典表吗？"
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

    const handleEdit = (record: LocalDict) => {
        setDrawerVisible(true);
        setTitle('编辑');
        setCurrentItem(record);
    };

    const handleEditValues = (record: LocalDict) => {
        setDictValuesDrawerVisible(true);
        setCurrentItem(record);
    };

    const handleDelete = (id: string) => {
        deleteDict(id, message).then((res) => {
            updateTableData('', currentPage, pageSize);
        }).catch((err) => {
           
        });
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
        getDictList({
            keyword,
            currentPage,
            pageSize: currentPageSize
        }).then((res) => {
            if (res) {
                setData(res.data);
                setTotal(res.total);
                setCurrentPage(res.currentPage!);
                setPageSize(res.pageSize!);
            }
        }).catch((err) => {
            
        }).finally(() => {
            setLoading(false);
        });
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page)
        setPageSize(pageSize)
        updateTableData(searchText, page, pageSize)
    }

    const handleClose = (option: { update: boolean }) => {
        setDrawerVisible(false);
        if (option.update) {
            updateTableData('', currentPage, pageSize);
        }
    }
    const handleCloseDictValuesDrawer = (option: { update: boolean }) => {
        setDictValuesDrawerVisible(false);
        if (option.update) {
            updateTableData('', currentPage, pageSize);
        }
    }
    return (
        <>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                <Input
                    placeholder="搜索字典表名称和描述"
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
                    新增字典表
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
            <DictDrawer open={drawerVisible} onClose={handleClose} title={title} currentItem={currentItem} />
            <DictValuesDrawer open={dictValuesDrawerVisible} onClose={handleCloseDictValuesDrawer} currentItem={currentItem} />
        </>

    );
} 