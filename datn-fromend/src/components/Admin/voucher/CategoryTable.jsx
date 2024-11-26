import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Popconfirm, Button, message, notification, Dropdown, Checkbox, Menu } from 'antd';
import {DeleteOutlined, EditOutlined, GiftOutlined, PlusOutlined, ReloadOutlined} from '@ant-design/icons';
import {callDeleteCategory, callDeleteVoucher, callFetchCategory, callFetchVoucher} from "../../../services/api.js";
import Search from './Search.jsx';
import CategoryDetail from "./CategoryDetail.jsx";
import CategoryCreate from "./CategoryCreate.jsx";
import CategoryUpdate from "./CategoryUpdate.jsx";
import moment from "moment";

const VoucherTable = () => {
    const [listCategory, setListCategory] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState(null);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [selectedColumns, setSelectedColumns] = useState({
        id: true,
        code: true,
        discount: true,
        minOrder: true,
        expiry: true,
        action: true,
    });

    useEffect(() => {
        fetchCategories();
    }, [current, pageSize, filter, sortQuery]);

    const fetchCategories = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}`;
        if (filter) query += `&${filter}`;
        if (sortQuery) query += `&${sortQuery}`;
        const res = await callFetchVoucher(query);
        if (res && res.data) {
            setListCategory(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const columnSelector = (
        <Menu>
            {Object.keys(selectedColumns).map((key) => (
                <Menu.Item key={key}>
                    <Checkbox
                        checked={selectedColumns[key]}
                        onChange={(e) => {
                            setSelectedColumns({
                                ...selectedColumns,
                                [key]: e.target.checked,
                            });
                        }}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Checkbox>
                </Menu.Item>
            ))}
        </Menu>
    );

    const columns = [
        selectedColumns.id && {
            title: 'ID',
            dataIndex: 'id',
            render: (text, record) => (
                <a
                    href="#"
                    onClick={() => { setDataViewDetail(record); setOpenViewDetail(true); }}
                    className="text-indigo-500 hover:text-indigo-700 font-semibold"
                >
                    {record.id}
                </a>
            ),
        },
        selectedColumns.code && {
            title: 'Code',
            dataIndex: 'code',
            sorter: true,
            className: "text-gray-700 font-semibold",
        },
        selectedColumns.discount && {
            title: 'Discount',
            dataIndex: 'discount',
            sorter: true,
            render: (discount) => (
                <span>{discount}%</span>
            ),
            className: "text-gray-700 font-semibold",
        },
        selectedColumns.minOrder && {
            title: 'Min Order',
            dataIndex: 'minOrder',
            sorter: true,
            render: (minOrder) => (
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minOrder)}</span>
            ),
            className: "text-gray-700 font-semibold",
        },
        selectedColumns.expiry && {
            title: 'Expiry',
            dataIndex: 'expiry',
            sorter: true,
            render: (expiry) => moment(expiry).format("DD/MM/YYYY HH:mm"),
            className: "text-gray-700 font-semibold",
        },
        selectedColumns.action && {
            title: 'Action',
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    {/* Delete Button */}
                    <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => handleDeleteCategory(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            className="text-red-500  rounded-lg p-2"
                        >
                            Delete
                        </Button>
                    </Popconfirm>

                    {/* Edit Button */}
                    <Button
                        type="link"

                        className="text-blue-400  rounded-lg p-2"
                        onClick={() => {
                            setOpenModalUpdate(true);
                            setDataUpdate(record);
                        }}
                    >
                        Edit
                    </Button>
                </div>
            ),
            className: "text-gray-700 font-semibold",
        },
    ].filter(Boolean);


    const onChange = (pagination, filters, sorter) => {
        if (pagination.current !== current) setCurrent(pagination.current);
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
        if (sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field},asc` : `sort=${sorter.field},desc`;
            setSortQuery(q);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        const res = await callDeleteVoucher(categoryId);
        if (res?.data?.statusCode === 204) {
            message.success('Voucher deleted successfully');
            fetchCategories();
        } else {
            notification.error({
                message: 'Error',
                description: res.message,
            });
        }
    };

    const renderHeader = () => (
        <>
            <div
                className="flex justify-between items-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white p-5 rounded-xl shadow-lg border ">
                {/* Left Section: Title with Icon */}
                <div className="flex items-center gap-3">
                    <GiftOutlined className="text-3xl text-yellow-300"/>
                    <span className="text-2xl font-bold tracking-wide">Voucher Management</span>
                </div>


            </div>
            <div className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-lg shadow-lg">
                {/* Right Section: Action Buttons */}
                <div className="flex gap-4">
                    <Button
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                        className="flex items-center gap-2 bg-yellow-300 text-purple-700 font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-yellow-400 transition-all"
                    >
                        <PlusOutlined/>
                        Add Voucher
                    </Button>

                </div>
                <div className="flex gap-4">
                    <Search handleSearch={setFilter}/>
                    <Button
                        icon={<ReloadOutlined/>}
                        onClick={() => {
                            setFilter("");
                            setSortQuery("");
                            fetchCategories();
                        }}
                        className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-md p-2 shadow hover:bg-gray-200 transition-all"
                    >
                    </Button>
                </div>
                </div>
            </>
            );


            return (
            <Row gutter={[20, 20]}>
                <Col span={24}>

                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}
                        columns={columns}
                        dataSource={listCategory}
                        onChange={onChange}
                        rowKey="id"
                        pagination={{current, pageSize, total}}
                        style={{backgroundColor: '#ffffff', borderRadius: '10px'}}
                    />
                </Col>

                <CategoryCreate
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchCategories={fetchCategories}
                />
                <CategoryUpdate
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    dataUpdate={dataUpdate}
                    setDataUpdate={setDataUpdate}
                    fetchCategories={fetchCategories}
                />
            </Row>
            );
            };

            export default VoucherTable;
