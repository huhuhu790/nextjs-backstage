import { useEffect, useState } from 'react';
import { Modal, Tree, TreeProps } from 'antd';
import { set } from 'lodash';

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
}: {
    open: boolean,
    onClose: (key?: string[]) => void;
}) {
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [key, setKey] = useState<string[]>();

    useEffect(() => {
        if (open) {
            setTreeData([
                { title: 'Expand to load', key: '0' },
                { title: 'Expand to load', key: '1' },
                { title: 'Tree Node', key: '2', isLeaf: true },
            ]);
        }
    }, [open]);

    const onLoadData: TreeProps['loadData'] = async ({ key, children }) => {
        if (children) return
        setTreeData((origin) =>
            updateTreeData(origin, key, [
                { title: `${key}-0`, key: `${key}-0` },
            ]),
        );
    }

    const handleClose = () => {
        onClose();
        setKey(undefined);
        setTreeData([]);
    }

    const handleSubmit = () => {
        onClose(key);
        setKey(undefined);
        setTreeData([]);
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
            closable={{ 'aria-label': 'Custom Close Button' }}
            onOk={handleSubmit}
            onCancel={handleClose}
        >
            <Tree
                loadData={onLoadData}
                treeData={treeData}
                selectedKeys={key}
                onSelect={handleSelect}
            />
        </Modal>
    )
};