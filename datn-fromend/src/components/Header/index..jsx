import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from 'antd';
import {
    FaReact, FaHome, FaInfoCircle, FaPhoneAlt, FaBars,
} from 'react-icons/fa';
import { RiFolderHistoryFill } from 'react-icons/ri';
import { BsCart3 } from 'react-icons/bs';
import { IoIosArrowDropdown } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Import CSS của NProgress
import { callLogout } from "../../services/api.js";
import { doLogoutAction } from "../../redux/account/accountSlice.js";

const Header = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const user = useSelector((state) => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);
    const location = useLocation();

    // Hiệu chỉnh NProgress
    useEffect(() => {
        NProgress.configure({ showSpinner: false, speed: 500, minimum: 0.1 }); // Tốc độ và mức tối thiểu

        NProgress.start(); // Bắt đầu thanh loading
        const timer = setTimeout(() => {
            NProgress.done(); // Dừng thanh loading sau khi trang đã tải xong
        }, 800); // Delay thêm để tăng trải nghiệm người dùng

        return () => {
            clearTimeout(timer);
            NProgress.done(); // Kết thúc ngay nếu component bị huỷ
        };
    }, [location]);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.statusCode === 200) {
            dispatch(doLogoutAction());
            navigate('/login');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const getNavLinkClass = (path) => {
        return location.pathname === path
            ? 'flex items-center space-x-2 hover:text-[#d38ac1] transition duration-200 text-[#d38ac1] border-b-2 border-[#d38ac1]'
            : 'flex items-center space-x-2 hover:text-[#d38ac1] transition duration-200';
    };

    const renderBreadcrumbItems = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        return [
            <Breadcrumb.Item key="home">
                <Link to="/">Home</Link>
            </Breadcrumb.Item>,
            ...pathSegments.map((segment, index) => (
                <Breadcrumb.Item key={index}>
                    <Link to={`/${pathSegments.slice(0, index + 1).join('/')}`}>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </Link>
                </Breadcrumb.Item>
            ))
        ];
    };

    return (
        <nav className="bg-[#4b206e] border-b-2 border-[#4b206e]">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-1">
                <div className="flex items-center space-x-3">
                    <FaReact className="text-[#e2a4d3] text-4xl" />
                    <span className="text-purple-900 dark:text-pink-100 text-3xl font-bold">BubblyTea</span>
                </div>
                {/* Hamburger Button for Mobile */}
                <div className="lg:hidden flex items-center">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        <FaBars className="text-[#e2a4d3] text-3xl" />
                    </button>
                </div>
                <div className={`lg:flex items-center space-x-4 relative ${menuOpen ? 'block' : 'hidden'}`}>
                    {isAuthenticated && user ? (
                        <div className="relative inline-block" ref={dropdownRef}>
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => setOpenDropdown(!openDropdown)}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        user.role.id === 2 ? 'bg-gray-100' : 'bg-gray-100'
                                    }`}
                                >
                                    <span className="font-normal text-gray-600">
                                        {user.role.id === 1 ? 'Ad' : 'User'}
                                    </span>
                                </div>
                                <span className="text-[#e2a4d3] font-medium">{user.name}</span>
                                <IoIosArrowDropdown color="#e2a4d3" />
                            </div>
                            {openDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#6d367a] rounded-lg shadow-lg z-10 opacity-95 p-2">
                                    <div className="px-4 py-3">
                                        <span className="block text-sm text-[#e2a4d3] font-semibold">{user.name}</span>
                                        <span className="block text-sm text-gray-300">{user.email}</span>
                                    </div>
                                    <ul className="py-2 text-sm text-[#e2a4d3]">
                                        <li
                                            className="px-4 py-2 hover:bg-[#5d2b6a] rounded cursor-pointer transition duration-200"
                                            onClick={() => navigate('/edit-profile')}
                                        >
                                            Edit Profile
                                        </li>
                                        {user.role.id === 1 && (
                                            <li
                                                className="px-4 py-2 hover:bg-[#5d2b6a] rounded cursor-pointer transition duration-200"
                                                onClick={() => navigate('/admin')}
                                            >
                                                Dashboard
                                            </li>
                                        )}
                                        <li
                                            className="px-4 py-2 hover:bg-[#5d2b6a] rounded cursor-pointer transition duration-200"
                                            onClick={handleLogout}
                                        >
                                            Sign Out
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <span
                            className="text-[#e2a4d3] cursor-pointer hover:text-[#d38ac1] transition duration-200"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </span>
                    )}
                </div>
            </div>
            <div className={`lg:flex bg-[#6d367a] text-[#e2a4d3] p-3 space-x-8 justify-center ${menuOpen ? 'block' : 'hidden'}`}>
                <Link to="/" className={getNavLinkClass('/')}>
                    <FaHome className="text-lg" /> <span>Home</span>
                </Link>
                {isAuthenticated && user && (
                    <Link to="/cart" className={getNavLinkClass('/cart')}>
                        <BsCart3 className="text-lg" /> <span>Cart</span>
                    </Link>
                )}
                {isAuthenticated && user && (
                    <Link to="/order" className={getNavLinkClass('/order')}>
                        <RiFolderHistoryFill className="text-lg" /> <span>Your Orders</span>
                    </Link>
                )}
                <Link to="/about" className={getNavLinkClass('/about')}>
                    <FaInfoCircle className="text-lg" /> <span>About</span>
                </Link>
                <Link to="/contact" className={getNavLinkClass('/contact')}>
                    <FaPhoneAlt className="text-lg" /> <span>Contact</span>
                </Link>
            </div>
            {/* Breadcrumb */}
            <div className="bg-[#ffff] font-bold px-4">
                <Breadcrumb separator=">">{renderBreadcrumbItems()}</Breadcrumb>
            </div>
        </nav>
    );
};

export default Header;
