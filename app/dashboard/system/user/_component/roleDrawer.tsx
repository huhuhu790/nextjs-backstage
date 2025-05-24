import { Drawer, Space, Transfer, Button } from "antd";
import { Key, useState } from "react";

const dataSource = [
    {
        key: '1',
        title: '角色1',
    },
];

export default function RoleDrawer({ open, onClose }: { open: boolean, onClose: (option: { update: boolean }) => void }) {
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const onChange = (nextTargetKeys: Key[]) => {
        setTargetKeys(nextTargetKeys as string[]);
    };
    const handleSubmit = () => {
        console.log(targetKeys);
    }
    const handleClose = () => {
        onClose({ update: false });
        setTargetKeys([]);
    }

    return (
        <Drawer
            title="管理用户所在角色"
            open={open}
            width={800}
            maskClosable={false}
            placement={"left"}
            onClose={handleClose}
            forceRender
            extra={
                <Space>
                    <Button onClick={handleClose}>取消</Button>
                    <Button type="primary" onClick={handleSubmit}>提交</Button>
                </Space>
            }
        >
            <Transfer
                dataSource={dataSource}
                targetKeys={targetKeys}
                onChange={onChange}
                render={item => item.title}
                showSearch
                titles={['已选角色', '未选角色']}
                listStyle={{
                    width: 400,
                    height: 400,
                }}
            />
        </Drawer>
    )
}
