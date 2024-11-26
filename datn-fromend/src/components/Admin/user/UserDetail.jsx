import { Badge, Descriptions, Modal } from "antd";
import moment from 'moment';

const UserDetail = (props) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    return (
        <Modal
            title="Thông tin người dùng"
            visible={openViewDetail}
            onCancel={onClose}
            footer={null}
            width="50vw"
            className="user-detail-modal"
            style={{ top: 50 }}
        >
            <Descriptions
                title="Thông tin user"
                bordered
                column={2}
                size="large"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Descriptions.Item label="Id" labelStyle={{ fontWeight: 'bold' }}>{dataViewDetail?.id}</Descriptions.Item>
                <Descriptions.Item label="Họ" labelStyle={{ fontWeight: 'bold' }}>{dataViewDetail?.firstName}</Descriptions.Item>
                <Descriptions.Item label="Tên" labelStyle={{ fontWeight: 'bold' }}>{dataViewDetail?.name}</Descriptions.Item>
                <Descriptions.Item label="Email" labelStyle={{ fontWeight: 'bold' }}>{dataViewDetail?.email}</Descriptions.Item>

                <Descriptions.Item label="Role" span={2} labelStyle={{ fontWeight: 'bold' }}>
                    <Badge
                        status={dataViewDetail?.role?.name === 'ROLE_ADMIN' ? 'success' : 'default'}
                        text={dataViewDetail?.role?.name === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        style={{ backgroundColor: dataViewDetail?.role?.name === 'ROLE_ADMIN' ? '#4CAF50' : '#2196F3' }}
                    />
                </Descriptions.Item>

                <Descriptions.Item label="Created At" labelStyle={{ fontWeight: 'bold' }}>
                    {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At" labelStyle={{ fontWeight: 'bold' }}>
                    {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY hh:mm:ss')}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}

export default UserDetail;
