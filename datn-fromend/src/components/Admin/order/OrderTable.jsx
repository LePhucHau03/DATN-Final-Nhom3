import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Modal, Form, Input, Select, message } from 'antd';
import {ExclamationCircleOutlined, ExportOutlined, FileTextOutlined, ReloadOutlined} from '@ant-design/icons';
import { callCapNhatDonHang, callGetAllOrder } from '../../../services/api.js';
import * as XLSX from 'xlsx';
import moment from 'moment';
import InputSearch from './InputSearch.jsx';
import OrderViewDetail from './OrderViewDetail.jsx';

const OrderTable = () => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=createdAt,desc");
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState(null);
    const [listOrder, setListOrder] = useState([]);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [form] = Form.useForm();

    const statusOptions = ['Đã xác nhận', 'Vận chuyển', 'Hoàn thành', 'Đã hủy'];

    useEffect(() => {
        fetchOrders();
    }, [current, pageSize, filter, sortQuery]);

    const fetchOrders = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}&${sortQuery}`;
        if (filter) query += `&${filter}`;

        const res = await callGetAllOrder(query);
        if (res && res.data) {
            setListOrder(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            sorter: true,
            className: "text-gray-700 font-semibold",
        },
        {
            title: 'Name',
            dataIndex: 'receiverName',
            sorter: true,
            className: "text-gray-700 font-semibold",
        },
        {
            title: 'Phone',
            dataIndex: 'receiverPhone',
            sorter: true,
            className: "text-gray-700 font-semibold",
        },
        {
            title: 'Address',
            dataIndex: 'receiverAddress',
            sorter: true,
            className: "text-gray-700 font-semibold",
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: true,
            render: (price) => (
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
            ),
            className: "text-gray-700 font-semibold",
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: true,
            render: (createdAt) => moment(createdAt).format('DD-MM-YYYY hh:mm:ss'),
            className: "text-gray-700 font-semibold",
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            render: (status) => {
                let statusClass = '';
                let statusText = status;

                switch (status) {
                    case 'Đã xác nhận':
                        statusClass = 'text-blue-500';
                        break;
                    case 'Vận chuyển':
                        statusClass = 'text-orange-500';
                        break;
                    case 'Hoàn thành':
                        statusClass = 'text-green-500';
                        break;
                    case 'Đã hủy':
                        statusClass = 'text-red-500';
                        break;
                    default:
                        statusClass = 'text-gray-500';
                        break;
                }

                return <span className={`${statusClass} font-semibold`}>{statusText}</span>;
            },
            className: "text-gray-700 font-semibold",
        },
        {
            title: 'Action',
            render: (text, record) => (
                <div className="flex gap-4">
                    <Button
                        type="link"
                        className="text-blue-500 font-medium"
                        onClick={() => { setDataViewDetail(record); setOpenViewDetail(true); }}
                    >
                        View
                    </Button>
                    <Button
                        type="link"
                        className="text-emerald-700"
                        onClick={() => { setOpenModalUpdate(true); setDataUpdate(record); form.setFieldsValue(record); }}
                    >
                        Update
                    </Button>
                </div>
            ),
            className: "text-gray-700 font-semibold",
        },
    ];

    const onChange = (pagination, filters, sorter) => {
        if (pagination.current !== current) setCurrent(pagination.current);
        if (pagination.pageSize !== pageSize) setPageSize(pagination.pageSize);
        if (sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field},asc` : `sort=${sorter.field},desc`;
            setSortQuery(q);
        }
    };

    const handleExportData = () => {
        if (listOrder.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listOrder);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportOrder.csv");
        }
    };

    const handleUpdateOrder = async () => {
        try {
            const values = await form.validateFields();
            const res = await callCapNhatDonHang(values);
            if (res.statusCode === 200) {
                message.success('Order updated successfully');
                setOpenModalUpdate(false);
                await fetchOrders();
            } else {
                message.error('Failed to update order');
            }
        } catch (error) {
            console.error("Failed to update order", error);
        }
    };

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>


                </Col>
                <Col span={24}>
                    <Table
                        title={() => (
                            <>
                                <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-xl shadow-lg">
                                    {/* Table Title */}
                                    <div className="flex items-center gap-3">
                                        <FileTextOutlined className="text-2xl"/>
                                        <span className="text-xl font-bold tracking-wide">Manage Orders</span>
                                    </div>


                                </div>
                                <div className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-lg shadow-lg">
                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <Button
                                            icon={<ExportOutlined/>}
                                            type="primary"
                                            className="flex items-center gap-2 bg-white text-blue-600 font-semibold rounded-md px-5 py-2 shadow-md hover:bg-blue-100 transition-all"
                                            onClick={handleExportData}
                                        >
                                            Export Data
                                        </Button>

                                    </div>
                                    <div className="flex gap-4">
                                        <InputSearch handleSearch={(query) => { setFilter(query); setCurrent(1); }} />
                                        <Button
                                            type="ghost"
                                            className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-md p-2 shadow hover:bg-gray-200 transition-all"
                                            onClick={() => {
                                                setFilter("");
                                                setSortQuery("sort=createdAt,desc");
                                            }}
                                        >
                                            <ReloadOutlined/>

                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                        loading={isLoading}
                        columns={columns}
                        dataSource={listOrder}
                        onChange={onChange}
                        rowKey="id"
                        pagination={{current, pageSize, total}}
                        className="bg-white rounded-lg shadow"
                    />

                </Col>
            </Row>

            <Modal
                title="Cập nhật Đơn hàng"
                open={openModalUpdate}
                onCancel={() => setOpenModalUpdate(false)}
                onOk={handleUpdateOrder}
                okText="Cập nhật"
                cancelText="Hủy"
                className="rounded-lg shadow-xl bg-white p-6"
                icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setOpenModalUpdate(false)}
                        style={{
                            borderRadius: '8px',
                            backgroundColor: '#f1f1f1',
                            borderColor: '#d9d9d9',
                            color: '#333'
                        }}
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUpdateOrder}
                        style={{
                            borderRadius: '8px',
                            backgroundColor: '#52c41a',
                            borderColor: '#52c41a',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        Cập nhật
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" name="update_order_form" initialValues={{}}>
                    <Form.Item label="Mã Đơn hàng" name="id">
                        <Input disabled style={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            }}
                            allowClear
                        >
                            {statusOptions.map((status) => (
                                <Select.Option key={status} value={status}>
                                    {status}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ nhận hàng"
                        name="receiverAddress"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input
                            placeholder="Nhập địa chỉ nhận hàng"
                            style={{
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                padding: '10px',
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <OrderViewDetail openViewDetail={openViewDetail} setOpenViewDetail={setOpenViewDetail} dataViewDetail={dataViewDetail} />
        </>
    );
};

export default OrderTable;
