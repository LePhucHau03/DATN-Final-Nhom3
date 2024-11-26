import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Popconfirm, Button, message, notification } from 'antd';
import {PlusOutlined, ReloadOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import { callDeleteProduct, callFetchProduct } from "../../../services/api.js";
import Search from './Search.jsx';
import ProductDetail from "./ProductDetail.jsx";
import ProductCreate from "./ProductCreate.jsx";
import ProductUpdate from "./ProductUpdate.jsx";

const ProductTable = () => {
    const [listProduct, setListProduct] = useState([]);
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

    useEffect(() => {
        fetchProducts();
    }, [current, pageSize, filter, sortQuery]);

    const fetchProducts = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}`;
        if (filter) query += `&${filter}`;
        if (sortQuery) query += `&${sortQuery}`;
        const res = await callFetchProduct(query);
        if (res && res.data) {
            setListProduct(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text, record) => (
                <a
                    href="#"
                    onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}
                    className="text-indigo-500 hover:text-indigo-700"
                >
                    {record.id}
                </a>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            render: (name) => <span className="font-semibold">{name}</span>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true,
            render: (price) => (
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
            ),
        },
        {
            title: 'Category',
            dataIndex: ['category', 'name'],
            sorter: true,
        },
        {
            title: 'Active',
            dataIndex: 'active',
            render: (active) => (
                <span
                    className={`${
                        active ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'
                    }`}
                >
                {active ? 'Active' : 'Inactive'}
            </span>
            ),
        },
        {
            title: 'Action',
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    {/* Delete Button */}
                    <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => handleDeleteProduct(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a className="text-red-500 hover:text-red-600">Delete</a>
                    </Popconfirm>

                    {/* Edit Button */}
                    <a
                        onClick={() => {
                            setOpenModalUpdate(true);
                            setDataUpdate(record);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Edit
                    </a>
                </div>
            ),
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

    const handleDeleteProduct = async (productId) => {
        const res = await callDeleteProduct(productId);
        if (res?.data?.statusCode === 204) {
            message.success('Product deleted successfully');
            fetchProducts();
        } else {
            notification.error({
                message: 'Error occurred',
                description: res.message,
            });
        }
    };

    const renderHeader = () => (
        <>
            <div
                className="flex justify-between items-center bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6 rounded-xl shadow-lg">
                {/* Title Section */}
                <div className="flex items-center gap-3">
                    <ShoppingCartOutlined className="text-3xl text-white"/>
                    <span className="text-white text-2xl font-bold tracking-wide">Product Management</span>
                </div>


            </div>

            <div className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-lg shadow-lg">
                {/* Action Buttons Section */}
                <div className="flex gap-4">
                    <Button
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                        className="flex items-center gap-2 bg-white text-purple-600 font-semibold rounded-md px-5 py-2 shadow-md hover:bg-purple-100 transition-all"
                    >
                        <PlusOutlined/>
                        Add Product
                    </Button>

                </div>
                <div className="flex gap-4">
                    <Search handleSearch={setFilter}/>
                    <Button
                        icon={<ReloadOutlined/>}
                        onClick={() => {
                            setFilter("");
                            setSortQuery("");
                            fetchProducts();
                        }}
                        className="flex items-center justify-center bg-white text-purple-600 rounded-full p-3 shadow hover:bg-purple-100 transition-all"
                    />
                </div>
                </div>
            </>

            );


            return (
            <>
                <Row gutter={[20, 20]}>
                    <Col span={24}>

                    </Col>
                    <Col span={24}>
                        <Table
                            title={renderHeader}
                            loading={isLoading}
                            columns={columns}
                            dataSource={listProduct}
                            onChange={onChange}
                            rowKey="id"
                            pagination={{
                                current,
                                pageSize,
                                total,
                            }}
                        />
                    </Col>
                    <ProductDetail
                        openViewDetail={openViewDetail}
                        setOpenViewDetail={setOpenViewDetail}
                        dataViewDetail={dataViewDetail}
                    />
                    <ProductCreate
                        openModalCreate={openModalCreate}
                        setOpenModalCreate={setOpenModalCreate}
                        fetchProducts={fetchProducts}
                    />
                    <ProductUpdate
                        openModalUpdate={openModalUpdate}
                        setOpenModalUpdate={setOpenModalUpdate}
                        dataUpdate={dataUpdate}
                        fetchProducts={fetchProducts}
                    />
                </Row>
            </>
            );
            };

            export default ProductTable;
