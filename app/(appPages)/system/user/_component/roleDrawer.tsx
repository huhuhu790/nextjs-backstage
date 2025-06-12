import { Drawer, Space, Transfer, Button, App } from "antd";
import { Key, useEffect, useState } from "react";
import { LocalRole, LocalUser } from "@/types/api";
import { getRoleByPage } from "@/api/system/role";
import { updateUserRoleById } from "@/api/system/user";

export default function RoleDrawer({ open, onClose, currentItem }: {
    open: boolean,
    onClose: (option: { update: boolean }) => void,
    currentItem: Partial<LocalUser>
}) {
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [dataSource, setDataSource] = useState<LocalRole[]>([]);
    const { message } = App.useApp()
    useEffect(() => {
        if (open && currentItem) {
            setTargetKeys(currentItem.roles || []);
            getRoleByPage().then(result => {
                if (result) {
                    const { data, ...rest } = result
                    setDataSource(data)
                }
            }).catch(e => { }).finally(() => { })
        }
    }, [currentItem, open]);
    const onChange = (nextTargetKeys: Key[]) => {
        setTargetKeys(nextTargetKeys as string[]);
    };
    const handleSubmit = () => {
        updateUserRoleById({ id: currentItem.id!, roleIds: targetKeys }, message).then(result => {
            handleClose({ update: true })
        }).catch(e => {
            
        }).finally(() => { })
    }
    const handleClose = (options: { update: boolean }) => {
        onClose(options);
        setTargetKeys([]);
        setDataSource([])
    }

    return (
        <Drawer
            title="管理用户所在角色"
            open={open}
            width={800}
            maskClosable={false}
            placement={"left"}
            onClose={() => handleClose({ update: false })}
            forceRender
            extra={
                <Space>
                    <Button onClick={() => handleClose({ update: false })}>取消</Button>
                    <Button type="primary" onClick={handleSubmit}>提交</Button>
                </Space>
            }
        >
            <Transfer
                rowKey={item => item.id!}
                dataSource={dataSource}
                targetKeys={targetKeys}
                render={item => item.name}
                onChange={onChange}
                showSearch
                titles={['未选角色', '已选角色']}
                listStyle={{
                    width: 400,
                    height: 400,
                }}
            />
        </Drawer>
    )
}
