import React, { useEffect, useState } from "react";
import {callFetchProduct, callFetchAllCategory, callAddToCart} from "../../services/api.js";
import Search from "antd/es/input/Search.js";
import {message, Pagination, Spin} from "antd";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

const ProductCard = ({ id, imageUrl, name, price, rating = 5, handleAddToCart }) => {
    const navigate = useNavigate();

    const formattedPrice = price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
    const image = `${import.meta.env.VITE_BACKEND_URL}/storage/category-thumbnail/${imageUrl}`;

    return (
        <div className="relative bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 m-5">
            <div className="group">
                <a onClick={() => navigate(`/product?id=${id}`)}>
                    <img
                        className="cursor-pointer rounded-t-lg object-cover w-full h-64 transition-opacity duration-200 group-hover:opacity-70"
                        src={image}
                        alt={name}
                        loading="lazy"
                    />
                </a>
                {/* Add to Cart Button */}
                <button
                    className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 transition-opacity duration-300"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation when clicking the button
                        handleAddToCart(id);
                    }}
                >
                    Add to Cart
                </button>
            </div>
            <div className="p-5">
                <a onClick={() => navigate(`/product?id=${id}`)} className="cursor-pointer">
                    <h5 className="mb-2 font-bold tracking-tight text-purple-800 hover:text-purple-600 transition-colors duration-200">
                        {name}
                    </h5>
                </a>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-fuchsia-600">{formattedPrice}</span>
                    <div className="flex items-center">
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <svg
                                    key={index}
                                    className={`w-5 h-5 ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 22 20"
                                    fill="currentColor"
                                >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-gray-600 ml-2">({rating})</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("filter=category.active:'true' and active:'true'");
    const [sortQuery, setSortQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState('all'); // Track selected category
    const [noProductsMessage, setNoProductsMessage] = useState('');
    const user = useSelector((state) => state.account.user);// For handling no products message

    const handleAddToCart = async (productID) => {
        const cartData = { userID: user.id, productID, quantity: 1 }; // Replace with dynamic userID and quantity if needed
        const response = await callAddToCart(cartData);
        response && response.data
            ? message.success("Product added to cart successfully!")
            : message.error("Failed to add product to cart.");
    };

    useEffect(() => {
        fetchProducts();
    }, [current, pageSize, filter, sortQuery, searchTerm]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}`;
        if (filter) query += `&${filter}`;
        if (searchTerm) query += ` and name~'${searchTerm}'`;
        if (sortQuery) query += `&${sortQuery}`;

        const res = await callFetchProduct(query);
        if (res?.data) {
            setProducts(res.data.result);
            setTotal(res.data.meta.total);
            if (res.data.result.length === 0) {
                setNoProductsMessage("Không có sản phẩm nào trong danh mục này.");
            } else {
                setNoProductsMessage('');
            }
        }
        setIsLoading(false);
    };

    const fetchCategories = async () => {
        const res = await callFetchAllCategory();
        if (res?.data) {
            const activeCategories = res.data
                .filter((item) => item.active)
                .map((item) => ({ label: item.name, value: item.name }));
            setCategories(activeCategories);
        }
    };

    const handlePageChange = (page, pageSize) => {
        setCurrent(page);
        setPageSize(pageSize);
    };

    const handleClickCategory = (categoryName) => {
        setSelectedCategory(categoryName);
        const newFilter = categoryName === 'all'
            ? "filter=category.active:'true' and active:'true'"
            : `filter=category.name:'${categoryName}' and active:'true'`;
        setFilter(newFilter);
        setCurrent(1);
    };

    const sortOptions = [
        { key: 'sort=createdAt,desc', label: 'Hàng Mới' },
        { key: 'sort=price,asc', label: 'Giá Thấp Đến Cao' },
        { key: 'sort=price,desc', label: 'Giá Cao Đến Thấp' },
    ];

    return (
        <div>
            <div className="mb-4">
                <h3 className="text-3xl font-bold text-purple-900 dark:text-pink-500 text-center m-5">Danh mục sản phẩm</h3>
                <div
                    className="flex justify-center space-x-4 bg-pink-100 dark:bg-purple-900 py-4 shadow-md overflow-x-auto px-4">
                    <div
                        className={`p-4 rounded-lg shadow-md cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 ${
                            filter === "filter=category.active:'true' and active:'true'" ? "bg-purple-700 text-white" : "bg-white"
                        }`}
                        onClick={() => handleClickCategory('all')}
                    >
                        <span className="font-bold">Tất cả</span>
                    </div>
                    {categories.map((category) => (
                        <div
                            key={category.value}
                            className={`p-4 rounded-lg shadow-md cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 ${
                                filter.includes(`category.name:'${category.value}'`) ? "bg-purple-700 text-white" : "bg-white"
                            }`}
                            onClick={() => handleClickCategory(category.value)}
                        >
                            <span className="font-bold">{category.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search and Sort Section */}
            <div className="flex justify-between items-center m-5">
                <Search
                    placeholder="Tìm kiếm sản phẩm"
                    allowClear
                    onSearch={setSearchTerm}
                    style={{width: 300}}
                />
                <select
                    className="p-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setSortQuery(e.target.value)}
                >
                    <option value="">Sắp xếp</option>
                    {sortOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spin size="large"/>
                </div>
            ) : (
                <div>
                    {/* Show no products message if there are no products */}
                    {noProductsMessage ? (
                        <div className="text-center text-xl text-red-500">{noProductsMessage}</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    handleAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            <Pagination
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={[10, 20, 50]}
                style={{marginTop: "20px", textAlign: "center"}}
                className="bg-white shadow-md rounded-lg p-2"
            />
        </div>
    );
};

export default ProductGrid;
