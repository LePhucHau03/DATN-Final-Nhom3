import React, { useState, useEffect } from 'react';
import {
    DashboardOutlined,
    UserOutlined,
    FolderOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';

const { Content, Header } = Layout;

const items = [
    {
        label: <Link to='/admin'>Thống kê</Link>,
        key: 'dashboard',
        icon: <DashboardOutlined />
    },
    {
        label: <Link to='/admin/user'>Quản lý User</Link>,
        icon: <UserOutlined />,
        key: 'user'
    },
    {
        label: <Link to='/admin/category'>Quản lý d.mục</Link>,
        icon: <FolderOutlined />,
        key: 'category',
    },
    {
        label: <Link to='/admin/product'>Quản lý s.phẩm</Link>,
        icon: <ShoppingCartOutlined />,
        key: 'product'
    },
    {
        label: <Link to='/admin/order'>Quản lý đ.hàng</Link>,
        icon: <ShoppingOutlined />,
        key: 'order',
    },
    {
        label: <Link to='/admin/voucher'>Quản lý voucher</Link>,
        icon: <ShoppingOutlined />,
        key: 'voucher',
    },
];

const LayoutAdmin = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const navigate = useNavigate();

    // Load trạng thái menu từ localStorage khi component render
    useEffect(() => {
        const savedMenu = localStorage.getItem('activeMenu');
        if (savedMenu) {
            setActiveMenu(savedMenu);
        }
    }, []);

    // Lưu trạng thái menu vào localStorage mỗi khi thay đổi
    const handleMenuClick = (e) => {
        setActiveMenu(e.key);
        localStorage.setItem('activeMenu', e.key);
    };

    return (
        <Layout className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header className="flex justify-between items-center bg-purple-900 shadow-lg">
                {/* Logo */}
                <div className="text-2xl font-semibold text-white">
                    Trang quản trị
                </div>

                {/* Menu */}
                <Menu
                    mode="horizontal"
                    selectedKeys={[activeMenu]}
                    items={items}
                    onClick={handleMenuClick}
                    className="bg-purple-900 text-white font-normal border-b-0 flex-grow justify-center"
                />

                {/* Home Page Button */}
                <div
                    className="text-orange-400 font-medium cursor-pointer hover:text-orange-500"
                    onClick={() => navigate('/')}
                >
                    Home Page
                </div>
            </Header>

            {/* Content */}
            <Layout>
                <Content className="p-6 bg-gray-100">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
