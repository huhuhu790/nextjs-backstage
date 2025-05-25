import { useState } from "react";
import { Drawer, Button, Space, Table, TableColumnsType, Popconfirm } from "antd";
import EditDictValueDrawer from "./editDictValueDrawer";
import { DictValue } from "@/types/system/dictionary";

const dataSource = [
    {
        key: '1',
        name: '字典值1',
        discription: '字典值1描述',
        value: '字典值1数据',
        isActive: true,
    },
];

export default function DictValuesDrawer({ open, onClose }: { open: boolean, onClose: (option: { update: boolean }) => void }) {
    const [editDictValueDrawerVisible, setEditDictValueDrawerVisible] = useState(false);
    const [currentEditDictValue, setCurrentEditDictValue] = useState<DictValue | null>(null);
    const [EditDictValueDrawerTitle, setEditDictValueDrawerTitle] = useState('');
    const columns: TableColumnsType<DictValue> = [
        {
            title: '名称',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: '数据',
            dataIndex: 'value',
            width: 200,
        },
        {
            title: '描述',
            dataIndex: 'discription',
            width: 400,
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 200,
            render: (_, record) =>
                <Space>
                    <Button type="link" onClick={() => handleEditDictValue(record)}>编辑</Button>
                    <Popconfirm
                        title="删除字典值"
                        description="确定要删除这个字典值吗？"
                        onConfirm={() => handleDeleteDictValue(record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger>删除</Button>
                    </Popconfirm>
                </Space>,
        },
    ];
    const handleSubmit = () => {
        handleClose({ update: true });
    }
    const handleCloseEditDictValueDrawer = () => {
        setEditDictValueDrawerVisible(false);
    }
    const handleEditDictValue = (record: DictValue) => {
        setEditDictValueDrawerVisible(true);
        setEditDictValueDrawerTitle('编辑字典值');
        setCurrentEditDictValue(record);
    }
    const handleAdd = () => {
        setEditDictValueDrawerVisible(true);
        setEditDictValueDrawerTitle('新增字典值');
        setCurrentEditDictValue(null);
    }
    const handleDeleteDictValue = (record: DictValue) => {
        console.log(record);
    }
    const handleClose = (options: { update: boolean }) => {
        onClose(options);
        setCurrentEditDictValue(null);
    }
    return (
        <Drawer
            title="字典值配置"
            open={open}
            onClose={() => handleClose({ update: false })}
            width={800}
            maskClosable={false}
            placement={"left"}
            forceRender
            extra={
                <Space>
                    <Button onClick={() => handleClose({ update: false })}>取消</Button>
                    <Button type="primary" onClick={handleSubmit}>提交</Button>
                </Space>
            }
        >
            <Button
                type="primary"
                onClick={handleAdd}>
                新增
            </Button>
            <Table<DictValue>
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowKey="name"
                size="small"
                scroll={{ x: "max-content" }}
            />
            <EditDictValueDrawer
                open={editDictValueDrawerVisible}
                onClose={handleCloseEditDictValueDrawer}
                title={EditDictValueDrawerTitle}
            />
        </Drawer>
    );
}