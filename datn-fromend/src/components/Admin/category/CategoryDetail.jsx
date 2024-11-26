import React from 'react';
import { Badge, Descriptions, Modal } from "antd";
import moment from 'moment';

const CategoryDetail = (props) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    return (
        <>
            <Modal
                title="Chi tiết doanh mục"
                visible={openViewDetail}
                onCancel={onClose}
                footer={null}
                width={600} // Căn chỉnh modal có chiều rộng hợp lý
                className="category-detail-modal"
                style={{
                    top: '15vh', // Khoảng cách từ trên cùng để căn giữa modal
                    borderRadius: '12px', // Bo góc modal mềm mại
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Thêm bóng đổ cho modal
                }}
            >
                <Descriptions
                    title="Thông tin chi tiết doanh mục"
                    bordered
                    column={2}
                    style={{
                        fontSize: '16px', // Chỉnh lại font size cho dễ đọc
                        lineHeight: '1.6', // Khoảng cách giữa các dòng trong mô tả
                    }}
                >
                    <Descriptions.Item label="Id" style={{ fontWeight: '500' }}>{dataViewDetail?.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị" style={{ fontWeight: '500' }}>{dataViewDetail?.name}</Descriptions.Item>

                    <Descriptions.Item label="Trạng thái" span={2}>
                        <Badge
                            status={dataViewDetail?.active ? "success" : "error"}
                            text={dataViewDetail?.active ? "Active" : "Inactive"}
                            style={{
                                fontSize: '14px', // Kích thước chữ cho badge rõ ràng
                                fontWeight: '500', // Làm cho badge nổi bật hơn
                            }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tạo">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY hh:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
}

export default CategoryDetail;
