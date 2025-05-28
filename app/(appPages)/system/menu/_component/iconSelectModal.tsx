'use client';

import React, { Suspense, useState } from 'react';
import { Modal, Input, Row, Col, Button, Tooltip } from 'antd';
import dynamic from 'next/dynamic';
import { SyncOutlined } from '@ant-design/icons';

const IconNameList = [
    "AccountBookOutlined",
    "ApartmentOutlined",
    "AlertOutlined",
    "ApiOutlined",
    "AppstoreOutlined",
    "AuditOutlined",
    "BankOutlined",
    "BarChartOutlined",
    "BellOutlined",
    "BlockOutlined",
    "BoldOutlined",
    "BookOutlined",
    "BorderOutlined",
    "VideoCameraOutlined",
    "UserOutlined"
]

const { Search } = Input;

interface IconSelectModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (iconName: string) => void;
}

const IconSelectModal: React.FC<IconSelectModalProps> = ({
    open,
    onClose,
    onSelect,
}) => {
    const [searchText, setSearchText] = useState('');
    // 搜索过滤
    const filteredIcons = IconNameList.filter((iconName) =>
        iconName.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleClose = () => {
        onClose()
        setSearchText('')
    }

    return (
        <Modal
            title="选择图标"
            open={open}
            onCancel={handleClose}
            footer={null}
            width={800}
        >
            <Search
                placeholder="搜索图标"
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Row
                gutter={[16, 16]}
                style={{ padding: '16px' }}
            >
                {filteredIcons.map((iconName) => {
                    const IconComponent = dynamic(() => import(`@ant-design/icons/lib/icons/${iconName}`));
                    return (
                        <Col span={2} key={iconName}>
                            <Tooltip title={iconName}>
                                <Button
                                    type="text"
                                    icon={<Suspense fallback={<SyncOutlined spin />}> <IconComponent /> </Suspense>}
                                    style={{
                                        fontSize: 24,
                                    }}
                                    onClick={() => {
                                        onSelect(iconName);
                                        onClose();
                                    }}
                                />
                            </Tooltip>
                        </Col>
                    );
                })}
            </Row>
        </Modal>
    );
};

export default IconSelectModal;