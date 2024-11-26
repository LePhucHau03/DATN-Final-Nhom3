import { Descriptions, Modal, Grid, Tag, Avatar, Card } from "antd";
import moment from 'moment';
import { PhoneOutlined, IdcardOutlined, CreditCardOutlined, AppstoreAddOutlined, UserOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const CategoryViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    // Ant Design's responsive grid system
    const screens = useBreakpoint();

    // Function to close the Modal and clear the data
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <Modal
            title="Order Detail"
            open={openViewDetail}
            onCancel={onClose}
            footer={null}
            width={screens.xs ? "100%" : screens.sm ? "80%" : screens.md ? "60%" : "40%"} // Responsive width
            bodyStyle={{ paddingBottom: 20, backgroundColor: '#fafafa', borderRadius: '8px' }} // Light background for contrast
        >
            <Descriptions
                bordered
                column={screens.xs ? 1 : screens.sm ? 2 : 3} // Responsive columns
                labelStyle={{ fontWeight: 'bold', color: '#5A5A5A' }} // Label styling for emphasis
                contentStyle={{ color: '#333', padding: '8px' }} // Content styling for readability
            >
                <Descriptions.Item label="Order ID">
                    <Tag color="blue">{dataViewDetail?.id}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Receiver Name">
                    {dataViewDetail?.receiverName}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={3}>
                    {dataViewDetail?.receiverAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                    <PhoneOutlined style={{ color: '#1890ff' }} /> {dataViewDetail?.receiverPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Total Price">
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail?.totalPrice)}
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="User ID">
                    <IdcardOutlined style={{ color: '#1890ff' }} /> {dataViewDetail?.user?.id}
                </Descriptions.Item>
                <Descriptions.Item label="User Email">
                    <a href={`mailto:${dataViewDetail?.user?.email}`}>{dataViewDetail?.user?.email}</a>
                </Descriptions.Item>
                <Descriptions.Item label="Payment method">
                    <CreditCardOutlined style={{ color: '#52c41a' }} /> {dataViewDetail?.paymentMethod}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                    {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="Created By">
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
                    {dataViewDetail?.createdBy}
                </Descriptions.Item>
                <Descriptions.Item span={3} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    <AppstoreAddOutlined style={{ marginRight: '8px' }} /> Order Details
                </Descriptions.Item>

                {dataViewDetail?.orderDetails?.map((item, index) => (
                    <Descriptions.Item key={index} label={`Item ${index + 1} - ${item.productName}`} span={3}>
                        <Card bordered={false} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Quantity: {item.quantity}</span>
                                <span>
                                    <Tag color="green">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </Tag>
                                </span>
                            </div>
                        </Card>
                    </Descriptions.Item>
                ))}
            </Descriptions>
        </Modal>
    );
};

export default CategoryViewDetail;
