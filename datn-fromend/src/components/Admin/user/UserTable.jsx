import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Popconfirm, Button, message, notification } from 'antd';
import {PlusOutlined, ReloadOutlined, UserAddOutlined} from '@ant-design/icons';
import { callDeleteUser, callFetchListUser } from "../../../services/api.js";
import Search from './Search.jsx';
import UserDetail from "./UserDetail.jsx";
import UserCreate from "./UserCreate.jsx";
import UserUpdate from "./UserUpdate.jsx";
import moment from "moment";

const UserTable = () => {
    const [listUser, setListUser] = useState([]);
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
        fetchUsers();
    }, [current, pageSize, filter, sortQuery]);

    const fetchUsers = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}`;
        if (filter) query += `&${filter}`;
        if (sortQuery) query += `&${sortQuery}`;
        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.result);
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
                    className="text-indigo-500"
                >
                    {record.id}
                </a>
            ),
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            sorter: true,
        },
        {
            title: 'Last Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Active',
            dataIndex: 'enabled',
            sorter: true,
            render: (enabled) => (
                <span
                    className={`${
                        enabled ? 'text-green-500' : 'text-red-500'
                    } font-semibold`}
                >
                {enabled ? 'Active' : 'Disabled'}
            </span>
            ),
        },
        {
            title: 'Role',
            dataIndex: ['role', 'name'],
            sorter: true,
            render: (role) => (
                <span
                    className={`${
                        role === 'ROLE_ADMIN' ? 'text-blue-500' : 'text-gray-500'
                    } font-semibold`}
                >
                {role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
            </span>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: true,
            render: (createdAt) => moment(createdAt).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (updatedAt) => moment(updatedAt).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Action',
            render: (text, record) => (
                <div className="flex items-center gap-4">
                    <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a className="text-red-500 hover:text-red-600">Delete</a>
                    </Popconfirm>
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
    ];

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

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res?.data?.statusCode === 204) {
            message.success('User deleted successfully');
            fetchUsers();
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
                className="flex justify-between items-center bg-gradient-to-l from-blue-500 via-purple-600 to-pink-500 text-white p-6 rounded-xl shadow-2xl border-2 ">
                {/* Title */}
                <div className="flex items-center gap-3">
                    <UserAddOutlined className="text-4xl text-yellow-300"/>
                    <span className="font-extrabold text-3xl tracking-wide text-shadow-md">User Management</span>
                </div>



            </div>

            <div className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-lg shadow-lg">
                {/* Action Buttons */}
                <div className="flex gap-5">
                    <Button
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                        className="flex items-center gap-2 bg-purple-500 text-white font-semibold rounded-md px-5 py-2 shadow-md hover:bg-purple-600 transition-all"
                    >
                <span className="flex items-center gap-2">
                    Add New
                </span>
                    </Button>

                </div>
                {/* Action Buttons */}
                <div className="flex gap-5">
                    <Search handleSearch={setFilter}/>
                    <Button
                        type="ghost"
                        onClick={() => {
                            setFilter("");
                            setSortQuery("");
                        }}
                        icon={<ReloadOutlined/>}
                        className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-md p-2 shadow hover:bg-gray-200 transition-all"
                    >
                    </Button>
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
                        dataSource={listUser}
                        onChange={onChange}
                        rowKey="id"
                        pagination={{
                            current,
                            pageSize,
                            total,
                        }}
                    />
                </Col>
                <UserDetail
                    openViewDetail={openViewDetail}
                    setOpenViewDetail={setOpenViewDetail}
                    dataViewDetail={dataViewDetail}
                />
                <UserCreate
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchUser={fetchUsers}
                />
                <UserUpdate
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    dataUpdate={dataUpdate}
                    fetchUser={fetchUsers}
                />
            </Row>
        </>
    );
};

export default UserTable;
