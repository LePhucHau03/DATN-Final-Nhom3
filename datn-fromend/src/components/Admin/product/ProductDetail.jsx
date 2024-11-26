import { Avatar, Badge, Descriptions, Modal, Row, Col } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import moment from 'moment';
import { useState } from 'react';

const UserViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    const handleAvatarClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/storage/category-thumbnail/${dataViewDetail?.imageUrl}`;

    // Format the price to VND with commas
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <>
            {/* Modal displaying user details */}
            <Modal
                title="Product Detail"
                open={openViewDetail}
                onCancel={onClose}
                footer={null}
                width={800}
                style={{ borderRadius: '10px' }}
                bodyStyle={{ padding: '24px' }}
                centered
            >
                <Row gutter={[16, 16]}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Descriptions
                            bordered
                            column={1}
                            style={{
                                backgroundColor: '#f7f7f7',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                padding: '24px'
                            }}
                        >
                            <Descriptions.Item label="Image" span={2}>
                                <Avatar
                                    size={120}
                                    icon={<AntDesignOutlined />}
                                    src={urlAvatar}
                                    shape="square"
                                    style={{
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease-in-out',
                                    }}
                                    onClick={handleAvatarClick}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Id" span={2}>{dataViewDetail?.id}</Descriptions.Item>
                            <Descriptions.Item label="Name">{dataViewDetail?.name}</Descriptions.Item>
                            <Descriptions.Item label="Category">{dataViewDetail?.category?.name}</Descriptions.Item>
                            <Descriptions.Item label="Active" span={2}>
                                <Badge
                                    status={dataViewDetail?.active ? "success" : "error"}
                                    text={dataViewDetail?.active ? "Active" : "Inactive"}
                                    style={{
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        fontSize: '16px',
                                        padding: '6px 12px'
                                    }}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Description">{dataViewDetail?.description}</Descriptions.Item>
                            <Descriptions.Item label="Price">{formatPrice(dataViewDetail?.price)}</Descriptions.Item>
                            <Descriptions.Item label="Created At">
                                {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Updated At">
                                {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY hh:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Created By">{dataViewDetail?.createdBy}</Descriptions.Item>
                            <Descriptions.Item label="Updated By">{dataViewDetail?.updatedBy}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Modal>

            {/* Modal for showing enlarged avatar */}
            <Modal
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                centered
                width={600}
                style={{
                    borderRadius: '10px',
                    padding: '24px',
                    backgroundColor: '#f7f7f7'
                }}
            >
                <img
                    src={urlAvatar}
                    alt="Avatar"
                    style={{
                        width: '100%',
                        borderRadius: '10px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                    }}
                />
            </Modal>
        </>
    );
};

export default UserViewDetail;
