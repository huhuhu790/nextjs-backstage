"use client"

import { useState } from "react";
import { Button, Table, Space, TableColumnsType, Popconfirm, App } from "antd";
import { PaginationResponse } from "@/types/database";
import dynamic from "next/dynamic";
import { getAuditTestProgrammeListbyPage, deleteAuditTestProgramme, signByRoleAuditTestProgramme, checkAuditTestProgramme } from "@/api/projects/auditTestProgramme";
import { AuditTestProgrammeRoles, LocalAuditTestProgramme } from "@/types/projects/auditTestProgramme";

const AuditTestProgrammeDrawer = dynamic(() => import('./auditTestProgrammeDrawer'), {
    ssr: false
});

function defaultItem(): Partial<LocalAuditTestProgramme> {
    return {
        name: "",
        originFilePath: "",
        originFileName: "",
        newFilePath: "",
        newFileName: "",
        backupPath: "",
    }
}

export default function ClientPage({ initData }: { initData: PaginationResponse<LocalAuditTestProgramme[]> }) {
    const [data, setData] = useState(initData.data);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initData.currentPage!);
    const [pageSize, setPageSize] = useState(initData.pageSize!);
    const [total, setTotal] = useState(initData.total!);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [currentItem, setCurrentItem] = useState<Partial<LocalAuditTestProgramme>>(defaultItem());
    const { message } = App.useApp()

    const columns: TableColumnsType<LocalAuditTestProgramme> = [
        {
            title: "项目名称",
            dataIndex: "name",
            key: "name",
            width: 200,
        },
        {
            title: "工程审核",
            dataIndex: "engineerAudit",
            key: "engineerAudit",
            width: 100,
            render: (status: boolean, record: LocalAuditTestProgramme) => (
                <Popconfirm
                    title="审核"
                    description="确定要审核吗？"
                    onConfirm={() => handleAudit(AuditTestProgrammeRoles.工程, record.id!)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="link" disabled={status}>
                        审核
                    </Button>
                </Popconfirm>
            ),
        },
        {
            title: "品质审核",
            dataIndex: "qualityAudit",
            key: "qualityAudit",
            width: 100,
            render: (status: boolean, record: LocalAuditTestProgramme) => (
                <Popconfirm
                    title="审核"
                    description="确定要审核吗？"
                    onConfirm={() => handleAudit(AuditTestProgrammeRoles.品质, record.id!)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="link" disabled={status}>
                        审核
                    </Button>
                </Popconfirm>
            ),
        },
        {
            title: "生产审核",
            dataIndex: "productionAudit",
            key: "productionAudit",
            width: 100,
            render: (status: boolean, record: LocalAuditTestProgramme) => (
                <Popconfirm
                    title="审核"
                    description="确定要审核吗？"
                    onConfirm={() => handleAudit(AuditTestProgrammeRoles.生产, record.id!)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="link" disabled={status}>
                        审核
                    </Button>
                </Popconfirm>
            ),
        },
        {
            title: "计划审核",
            dataIndex: "planAudit",
            key: "planAudit",
            width: 100,
            render: (status: boolean, record: LocalAuditTestProgramme) => (
                <Popconfirm
                    title="审核"
                    description="确定要审核吗？"
                    onConfirm={() => handleAudit(AuditTestProgrammeRoles.计划, record.id!)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="link" disabled={status}>
                        审核
                    </Button>
                </Popconfirm>
            ),
        },
        {
            title: "总经理审核",
            dataIndex: "managerAudit",
            key: "managerAudit",
            width: 120,
            render: (status: boolean, record: LocalAuditTestProgramme) => (
                <Popconfirm
                    title="审核"
                    description="确定要审核吗？"
                    onConfirm={() => handleAudit(AuditTestProgrammeRoles.总经理, record.id!)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="link" disabled={status}>
                        审核
                    </Button>
                </Popconfirm>
            ),
        },

        {
            title: "原文件路径",
            dataIndex: "originFilePath",
            key: "originFilePath",
            width: 200,
        },
        {
            title: "原文件名",
            dataIndex: "originFileName",
            key: "originFileName",
            width: 200,
        },
        {
            title: "新文件路径",
            dataIndex: "newFilePath",
            key: "newFilePath",
            width: 200,
        },
        {
            title: "备份路径",
            dataIndex: "backupPath",
            key: "backupPath",
            width: 200,
        },
        {
            title: "操作",
            key: "isChecked",
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (value: null, record: LocalAuditTestProgramme) => (
                <Space size="middle">
                    <Popconfirm
                        title="提交"
                        description="确定要提交吗？"
                        onConfirm={() => handleSubmit(record.id!)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" disabled={record.isChecked}>
                            提交
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title="删除"
                        description="确定要删除吗？"
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

    const handleAudit = (role: AuditTestProgrammeRoles, id: string) => {
        setLoading(true)
        signByRoleAuditTestProgramme({
            id,
            roleName: role
        }, message).then((res) => {
            updateTableData('', currentPage, pageSize);
        }).catch((err) => {

        }).finally(() => {
            setLoading(false)
        })
    }

    const handleSubmit = (id: string) => {
        setLoading(true)
        checkAuditTestProgramme(id, message).then((res) => {
            updateTableData('', currentPage, pageSize);
        }).catch((err) => {

        }).finally(() => {
            setLoading(false)
        })
    }

    const handleDelete = (id: string) => {
        setLoading(true)
        deleteAuditTestProgramme(id, message).then((res) => {
            updateTableData('', currentPage, pageSize);
        }).catch((err) => {

        }).finally(() => {
            setLoading(false)
        })
    };

    const handleAdd = () => {
        setDrawerVisible(true);
        setTitle('新增');
        setCurrentItem(defaultItem());
    };

    function updateTableData(keyword: string, currentPage: number, currentPageSize: number) {
        setLoading(true);
        getAuditTestProgrammeListbyPage({
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

    return (
        <>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                <Button
                    type="primary"
                    loading={loading}
                    onClick={handleAdd}>
                    新增任务
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
            <AuditTestProgrammeDrawer
                open={drawerVisible}
                onClose={handleClose}
                title={title}
                currentItem={currentItem}
            />
        </>
    );
}