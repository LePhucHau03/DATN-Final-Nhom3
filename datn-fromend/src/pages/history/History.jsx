import { Badge, Descriptions, Divider, Space, Table, Tag, Modal, message, Select } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { callOrderHistory, callHuyDonHang } from "../../services/api";
import { useSelector } from "react-redux";

const History = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [filterStatus, setFilterStatus] = useState("Tất cả");
    const user = useSelector(state => state.account.user);

    useEffect(() => {
        fetchHistory();
    }, [user.id]);

    useEffect(() => {
        applyFilter();
    }, [filterStatus, orderHistory]);

    const fetchHistory = async () => {
        const res = await callOrderHistory(user.id);
        if (res && res.data) {
            const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrderHistory(sortedData);
        }
    };

    const applyFilter = () => {
        if (filterStatus === "Tất cả") {
            setFilteredOrders(orderHistory);
        } else {
            setFilteredOrders(orderHistory.filter(order => order.status === filterStatus));
        }
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleFilterChange = (value) => {
        setFilterStatus(value);
    };

    const showModal = (record) => {
        setSelectedOrder(record);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
    };

    const handleCancelOrder = (orderId, status) => {
        if (status !== 'Đã xác nhận') {
            message.warning(`Không thể hủy đơn hàng có trạng thái "${status}".`);
            return;
        }

        Modal.confirm({
            title: 'Xác nhận hủy đơn hàng',
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    const response = await callHuyDonHang(orderId);
                    if (response.data.statusCode === 204) {
                        message.success('Hủy đơn hàng thành công!');
                        setOrderHistory(prevOrderHistory => prevOrderHistory.map(order =>
                            order.id === orderId ? { ...order, status: 'Hủy' } : order
                        ));
                    }
                } catch (error) {
                    message.error('Có lỗi xảy ra, không thể hủy đơn hàng.');
                }
            },
        });
    };

    const renderStatusTag = (status) => {
        let color;
        switch (status) {
            case 'Đã xác nhận':
                color = 'orange';
                break;
            case 'Vận chuyển':
                color = 'blue';
                break;
            case 'Hoàn thành':
                color = 'green';
                break;
            case 'Đã hủy':
                color = 'red';
                break;
            default:
                color = 'default';
                break;
        }
        return <Tag color={color}>{status}</Tag>;
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (item, record, index) => (<>{(pagination.current - 1) * pagination.pageSize + index + 1}</>)
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (item) => moment(item).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item),
        },
        {
            title: 'Người nhận',
            dataIndex: 'receiverName',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'receiverAddress',
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => renderStatusTag(status),
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_, record) => (
                <div className='flex gap-4'>
                    <span onClick={() => showModal(record)} className='text-aqua cursor-pointer hover:underline'>Xem chi tiết</span>
                    <span onClick={() => handleCancelOrder(record.id, record.status)} className='text-red-500 cursor-pointer hover:underline'>Hủy</span>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Danh sách đơn hàng</h2>
                <Select
                    value={filterStatus}
                    onChange={handleFilterChange}
                    options={[
                        { value: "Tất cả", label: "Tất cả" },
                        { value: "Đã xác nhận", label: "Đã xác nhận" },
                        { value: "Vận chuyển", label: "Vận chuyển" },
                        { value: "Hoàn thành", label: "Hoàn thành" },
                        { value: "Đã hủy", label: "Đã hủy" },
                    ]}
                    className="w-48"
                />
            </div>
            <Table
                columns={columns}
                dataSource={filteredOrders}
                pagination={{
                    ...pagination,
                    total: filteredOrders.length,
                }}
                onChange={handleTableChange}
                rowKey="id"
                scroll={{ x: 800 }}
                rowClassName="border-b border-gray-300 hover:bg-gray-100"
            />

            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
                visible={openModal}
                onCancel={closeModal}
                footer={null}
                width={'70%'}
                className="modal-custom"
            >
                {selectedOrder && (
                    <>
                        <Descriptions bordered column={2} className="mb-4">
                            <Descriptions.Item label="Người nhận">{selectedOrder.receiverName}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{selectedOrder.receiverPhone}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{selectedOrder.receiverAddress}</Descriptions.Item>
                            <Descriptions.Item label="Phương thức thanh toán">{selectedOrder.paymentMethod}</Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalPrice)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">{renderStatusTag(selectedOrder.status)}</Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">
                                {moment(selectedOrder.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Danh sách sản phẩm</Divider>

                        <div className="grid grid-cols-2 gap-4">
                            {selectedOrder.orderDetails.map((item, index) => (
                                <div
                                    key={item.productId}
                                    className="p-4 border rounded-md shadow-md bg-white flex items-center gap-4"
                                >
                                    <div className="font-bold text-lg">Sản phẩm {index + 1}</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">Tên sản phẩm: {item.productName}</div>
                                        <div className="text-sm">Số lượng: {item.quantity}</div>
                                        <div className="text-sm">
                                            Giá:{" "}
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                item.price
                                            )}
                                        </div>
                                        <div className="text-sm font-semibold">
                                            Thành tiền:{" "}
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                item.quantity * item.price
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Modal>


        </div>
    );
}

export default History;
