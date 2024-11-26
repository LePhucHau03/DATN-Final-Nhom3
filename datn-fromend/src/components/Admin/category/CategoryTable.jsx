import React, {useEffect, useState} from 'react';
import {Table, Row, Col, Popconfirm, Button, message, notification, Dropdown, Checkbox, Menu} from 'antd';
import {
    AppstoreAddOutlined,
    AppstoreOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import {callDeleteCategory, callFetchCategory} from "../../../services/api.js";
import Search from './Search.jsx';
import CategoryDetail from "./CategoryDetail.jsx";
import CategoryCreate from "./CategoryCreate.jsx";
import CategoryUpdate from "./CategoryUpdate.jsx";
import moment from "moment";

const CategoryTable = () => {
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
        name: true,
        active: true,
        createdAt: true,
        updatedAt: true,
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
        const res = await callFetchCategory(query);
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
        selectedColumns.name && {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            render: (name) => <span className="font-semibold">{name}</span>,
        },
        selectedColumns.active && {
            title: 'Active',
            dataIndex: 'active',
            sorter: true,
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
        selectedColumns.createdAt && {
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: true,
            render: (createdAt) => (
                <span>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</span>
            ),
        },
        selectedColumns.updatedAt && {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (updatedAt) => (
                <span>{moment(updatedAt).format('YYYY-MM-DD HH:mm')}</span>
            ),
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
                        <a className="text-red-500 hover:text-red-600">
                            Delete
                        </a>
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

    const handleDeleteCategory = async (categoryId) => {
        const res = await callDeleteCategory(categoryId);
        if (res?.data?.statusCode === 204) {
            message.success('Category deleted successfully');
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
            <div className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-lg shadow-lg">
                {/* Title Section */}
                <div className="flex items-center gap-4">
                    <div className="bg-purple-500 text-white p-3 rounded-full shadow-md">
                        <AppstoreOutlined className="text-2xl"/>
                    </div>
                    <span className="text-gray-800 text-2xl font-bold tracking-wide">Category Management</span>
                </div>

            </div>
            <div className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-lg shadow-lg">

                {/* Action Buttons Section */}
                <div className="flex gap-4">
                    <Button
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                        className="flex items-center gap-2 bg-purple-500 text-white font-semibold rounded-md px-5 py-2 shadow-md hover:bg-purple-600 transition-all"
                    >
                        <AppstoreAddOutlined/>
                        Add Category
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
                    />

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
            <CategoryDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
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

export default CategoryTable;
