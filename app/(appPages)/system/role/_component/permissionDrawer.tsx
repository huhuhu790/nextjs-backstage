"use client"
import { App, Button, Drawer, Space, Tree, TreeProps } from "antd";
import { getMenuAll } from "@/api/menu";
import { Key, useEffect, useState } from "react";
import { LocalMenu, OptionalLocalId, LocalRole } from "@/types/api";
import { BasicMenu } from "@/types/system/menu";
import { updateRolePermissionById } from "@/api/role";

export type MenuTreeDataType = OptionalLocalId<Omit<BasicMenu, "children">> & {
    key: string,
    title: string,
    children?: MenuTreeDataType[]
}


// 递归构建目录树
function buildTree(items: LocalMenu[], parentId: string | null): MenuTreeDataType[] {
    return items
        .filter(item => item.parentId === parentId)
        .map(item => {
            const result: MenuTreeDataType = {
                title: item.name,
                key: item.id!,
                id: item.id,
                parentId: item.parentId,
                name: item.name,
                path: item.path,
                iconPath: item.iconPath,
                type: item.type
            }
            if (item.children && item.children.length > 0) {
                result.children = buildTree(items, item.id!) || []
            }
            return result
        });
}

export default function RoleDrawer({
    open,
    onClose,
    currentItem,
}: {
    open: boolean;
    onClose: (result: { update: boolean }) => void;
    currentItem: LocalRole;
}) {
    const [dataSource, setDataSource] = useState<MenuTreeDataType[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
    const { message } = App.useApp()
    useEffect(() => {
        if (open) updateTree()
    }, [open])

    function updateTree() {
        getMenuAll().then(res => {
            if (res) {
                setDataSource(buildTree(res, null));
                setCheckedKeys(currentItem.permissions)
            }
        }).catch(error => { }).finally(() => { })
    }

    const handleSubmit = async () => {
        updateRolePermissionById(currentItem.id!, checkedKeys as string[], message).then(res => {
            handleClose({ update: true })
        }).catch(error => { }).finally(() => { })
    };
    const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
        if (typeof checkedKeys === "object") {
            const { checked, halfChecked } = checkedKeys as { checked: Key[]; halfChecked: Key[]; }
            setCheckedKeys([...checked, ...halfChecked])
        } else {
            setCheckedKeys(checkedKeys)
        }
    };
    const handleClose = (options: { update: boolean }) => {
        onClose(options);
        setCheckedKeys([])
    }
    return (
        <Drawer
            title="权限"
            placement="left"
            width={800}
            onClose={() => handleClose({ update: false })}
            open={open}
            maskClosable={false}
            forceRender
            extra={
                <Space>
                    <Button onClick={() => handleClose({ update: false })}>取消</Button>
                    <Button type="primary" onClick={handleSubmit}>
                        提交
                    </Button>
                </Space>
            }
        >
            <Tree
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                onCheck={onCheck}
                treeData={dataSource}
            />
        </Drawer>
    );
} 