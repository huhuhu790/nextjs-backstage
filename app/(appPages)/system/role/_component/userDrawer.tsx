import { Button, Col, Drawer, Input, Row, Table, Card, TableColumnsType, Flex, App } from "antd";
import { useEffect, useState, useRef } from "react";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { getUserByOption } from "@/api/system/user";
import { LocalUser, LocalRole } from "@/types/api";
import { addUserToRoleById, removeUserFromRoleById } from "@/api/system/role";

const columns: TableColumnsType<LocalUser> = [
    {
        title: '用户名',
        dataIndex: 'username',
    },
    {
        title: '姓名',
        dataIndex: 'name',
    },
    {
        title: '工号',
        dataIndex: 'workingId',
    },
    {
        title: '性别',
        dataIndex: 'gender',
    }
]

export default function UserDrawer({
    open,
    onClose,
    currentItem,
}: {
    open: boolean;
    onClose: (result: { update: boolean }) => void;
    currentItem: LocalRole;
}) {
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [searchTextAll, setSearchTextAll] = useState('');
    const [loadingAll, setLoadingAll] = useState(false);
    const [dataSourceSelected, setDataSourceSelected] = useState<LocalUser[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSizeAll, setPageSizeAll] = useState(10);
    const [currentPageAll, setCurrentPageAll] = useState(1);
    const [totalAll, setTotalAll] = useState(0);
    const [dataSourceAll, setDataSourceAll] = useState<LocalUser[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRowKeysAll, setSelectedRowKeysAll] = useState<string[]>([]);
    const { message } = App.useApp()
    const needUpdate = useRef(false);

    useEffect(() => {
        if (currentItem.id && open) updateTables()
    }, [currentItem.id, open]);

    function updateTables() {
        handleSearch(searchText, currentPage, pageSize);
        handleSearchAll(searchTextAll, currentPageAll, pageSizeAll)
    }

    const handleSearch = (keyword: string, currentPage: number, currentPageSize: number) => {
        setLoading(true);
        getUserByOption({
            roleId: currentItem.id,
            keyword,
            currentPage: currentPage,
            pageSize: currentPageSize
        }).then(res => {
            if (res) {
                setDataSourceSelected(res.data)
                setTotal(res.total!)
                setCurrentPage(res.currentPage!)
                setPageSize(res.pageSize!)
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleReset = () => {
        setSearchText('');
        setCurrentPage(1);
        handleSearch('', 1, pageSize);
    }

    const handleSearchAll = (keyword: string, currentPage: number, currentPageSize: number) => {
        setLoadingAll(true);
        getUserByOption({
            roleId: currentItem.id,
            unselected: true,
            keyword,
            currentPage: currentPage,
            pageSize: currentPageSize
        }).then(res => {
            if (res) {
                setDataSourceAll(res.data)
                setTotalAll(res.total!)
                setCurrentPageAll(res.currentPage!)
                setPageSizeAll(res.pageSize!)
            }
        }).finally(() => {
            setLoadingAll(false);
        })
    }

    const handleResetAll = () => {
        setSearchTextAll('');
        setCurrentPageAll(1);
        handleSearchAll(searchTextAll, 1, pageSizeAll)
    }

    const handleClose = () => {
        onClose({ update: needUpdate.current })
        needUpdate.current = false
        setShowAddUser(false)
        setSelectedRowKeys([])
        setSelectedRowKeysAll([])
        setSearchText('')
        setSearchTextAll('')
        setCurrentPage(1)
        setCurrentPageAll(1)
        setPageSize(10)
        setPageSizeAll(10)
    }

    const handleRemove = () => {
        removeUserFromRoleById(currentItem.id!, selectedRowKeys, message).then(res => {
            updateTables()
            needUpdate.current = true
        })
    }

    const handleAdd = () => {
        addUserToRoleById(currentItem.id!, selectedRowKeysAll, message).then(res => {
            updateTables()
            needUpdate.current = true
        })
    }

    return (
        <Drawer
            title="用户"
            placement="bottom"
            height="90%"
            onClose={handleClose}
            open={open}
        >
            <Row>
                <Col span={showAddUser ? 12 : 24}>
                    <Card style={{ margin: 8 }} title={
                        <Flex justify="space-between" align="center">
                            <span>已添加用户</span>
                            <Button
                                type="primary"
                                style={{ display: showAddUser ? "none" : "unset" }}
                                onClick={() => {
                                    handleSearchAll(searchTextAll, currentPageAll, pageSizeAll)
                                    setShowAddUser(true)
                                }}
                            >
                                添加用户
                            </Button>
                        </Flex>
                    }>
                        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                            <Input
                                placeholder="请输入用户名称"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={() => handleSearch(searchText, currentPage, pageSize)}
                                style={{ width: 200 }}
                            />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={() => handleSearch(searchText, currentPage, pageSize)}
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
                                danger
                                onClick={handleRemove}
                            >
                                移除
                            </Button>
                        </div>
                        <Table
                            rowKey="id"
                            rowSelection={{
                                type: "checkbox",
                                onChange: (selectedRowKeys, selectedRows) => {
                                    setSelectedRowKeys(selectedRowKeys as string[])
                                }
                            }}
                            dataSource={dataSourceSelected}
                            columns={columns}
                            scroll={{ x: 'max-content', y: 400 }}
                            loading={loading}
                            pagination={{
                                total: total,
                                current: currentPage,
                                pageSize: pageSize,
                                onChange: (page, pageSize) => {
                                    setCurrentPage(page)
                                    setPageSize(pageSize)
                                    handleSearch(searchText, page, pageSize)
                                }
                            }}
                        />
                    </Card>
                </Col>
                <Col span={12} style={{ display: showAddUser ? "unset" : "none" }}>
                    <Card style={{ margin: 8 }} title={
                        <Flex justify="space-between" align="center">
                            <span>未添加用户</span>
                            <Button
                                type="primary"
                                onClick={() => setShowAddUser(false)}
                            >
                                取消
                            </Button>
                        </Flex>
                    }>
                        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                            <Input
                                placeholder="请输入用户名称"
                                value={searchTextAll}
                                onChange={(e) => setSearchTextAll(e.target.value)}
                                onPressEnter={() => handleSearchAll(searchTextAll, currentPageAll, pageSizeAll)}
                                style={{ width: 200 }}
                            />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={() => handleSearchAll(searchTextAll, currentPageAll, pageSizeAll)}
                                loading={loadingAll}
                            >
                                搜索
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleResetAll}
                                loading={loadingAll}
                            >
                                重置
                            </Button>
                            <Button
                                variant="solid"
                                color="green"
                                onClick={handleAdd}
                            >
                                添加
                            </Button>
                        </div>
                        <Table
                            rowKey="id"
                            rowSelection={{
                                type: "checkbox",
                                onChange: (selectedRowKeys, selectedRows) => {
                                    setSelectedRowKeysAll(selectedRowKeys as string[])
                                }
                            }}
                            dataSource={dataSourceAll}
                            columns={columns}
                            scroll={{ x: 'max-content', y: 400 }}
                            loading={loadingAll}
                            pagination={{
                                total: totalAll,
                                current: currentPageAll,
                                pageSize: pageSizeAll,
                                onChange: (page, pageSize) => {
                                    setCurrentPageAll(page)
                                    setPageSizeAll(pageSize)
                                    handleSearchAll(searchTextAll, page, pageSize)
                                }
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </Drawer>
    )
}
