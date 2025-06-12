import { RefObject, useEffect, useState } from 'react';
import { Modal, Tree, TreeProps } from 'antd';
import { getRelativePath } from '@/api/projects/auditTestProgramme';
import { GetRelativePathApiProps } from '@/types/projects/auditTestProgramme';
import style from "./style.module.css"

interface DataNode {
    title: string;
    key: string;
    isLeaf?: boolean;
    children?: DataNode[];
}


const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
    list.map((node) => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });

export default function SelectPathModal({
    open,
    onClose,
    type
}: {
    open: boolean,
    onClose: (key?: string) => void,
    type: RefObject<GetRelativePathApiProps['type']>
}) {
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [key, setKey] = useState<string[]>();

    useEffect(() => {
        if (open)
            setTreeData([{
                title: "/",
                key: "/",
                isLeaf: false,
            }]);
    }, [open]);

    const onLoadData: TreeProps['loadData'] = async ({ key, children }) => {
        if (children) return
        const data = await getRelativePath({ path: key as string, type: type.current });
        if (!data) return;

        setTreeData((origin) =>
            updateTreeData(origin, key, data.map((item) => {
                const nameArray = item.name.split("/")
                let result = {
                    title: nameArray[nameArray.length - 1],
                    key: item.name,
                    isLeaf: false
                }
                if (item.type === 'file') {
                    result.isLeaf = true;
                }
                return result as DataNode;
            }))
        );
    }

    const handleClose = () => {
        onClose();
        setKey(undefined);
    }

    const handleSubmit = () => {
        if (key) {
            const result = key[0]
            onClose(result);
            setKey(undefined);
        }
    };

    const handleSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        setKey(selectedKeys as string[]);
    };

    return (
        <Modal
            title="选择路径"
            open={open}
            width={800}
            maskClosable={false}
            forceRender
            onOk={handleSubmit}
            onCancel={handleClose}
        >
            {open ? <Tree
                className={style.tree}
                showLine
                blockNode
                loadData={onLoadData}
                treeData={treeData}
                selectedKeys={key}
                onSelect={handleSelect}
            /> : null}
        </Modal>
    )
};