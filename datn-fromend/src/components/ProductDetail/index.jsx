import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {
    callFetchProductById, callAddToCart, callFetchProductsByCategory, callLoadComment, callCreateComment, // Import API comment
    callDeleteComment, callUpdateComment, // Import API delete comment
} from "../../services/api.js";
import {useSelector} from "react-redux";
import {message, Modal, Pagination} from "antd";
import {useNavigate} from "react-router-dom";

const ProductDetail = () => {
    const [data, setData] = useState();
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [comments, setComments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [newComment, setNewComment] = useState(""); // State để lưu nội dung bình luận mới
    const location = useLocation();

    // Update comment states
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [updatedComment, setUpdatedComment] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 4;

    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const user = useSelector((state) => state.account.user);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData(id);
        fetchComments(id);
    }, [id]);

    useEffect(() => {
        // Cuộn trang lên đầu mỗi khi id thay đổi
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);


    const fetchData = async (id) => {
        const res = await callFetchProductById(id);
        if (res && res.data) {
            setData(res.data);
            fetchRelatedProducts(res.data.category.id);
        }
    };

    const fetchComments = async (productId) => {
        const res = await callLoadComment(productId);
        if (res && res.data) {
            // Sort comments by createdAt in descending order (newest first)
            const sortedComments = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setComments(sortedComments);
        }
    };

    // Calculate indexes for pagination
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const fetchRelatedProducts = async (categoryId) => {
        const res = await callFetchProductsByCategory(categoryId);
        if (res && res.data) {
            const currentProductId = parseInt(id, 10);
            setRelatedProducts(res.data.filter((product) => product.id !== currentProductId && product.active));
        }
    };

    const handleAddToCart = async (productId) => { // Add productId as a parameter
        const cartData = {userID: user.id, productID: productId, quantity}; // Use productId
        const response = await callAddToCart(cartData);
        response && response.data ? message.success("Product added to cart successfully!") : message.error("Failed to add product to cart.");
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            message.warning("Please enter a comment.");
            return;
        }

        const commentData = {comment: newComment, userId: user.id, productId: parseInt(id, 10)};
        const res = await callCreateComment(commentData);

        if (res && res.statusCode === 201) {
            message.success("Comment added successfully!");
            setComments((prev) => [...prev, res.data]); // Cập nhật danh sách bình luận
            setNewComment(""); // Reset input
        } else {
            message.error("Failed to add comment.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        const res = await callDeleteComment(commentId);

        if (res && res.data.statusCode === 204) {
            message.success("Comment deleted successfully.");
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        } else {
            message.error("Failed to delete comment.");
        }
    };

    const showImagePreview = (imageUrl) => {
        setPreviewImage(imageUrl);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Update Comment Handlers
    const showUpdateModal = (comment) => {
        setCurrentComment(comment);
        setUpdatedComment(comment.message);
        setIsUpdateModalVisible(true);
    };

    const handleUpdateCancel = () => {
        setIsUpdateModalVisible(false);
        setCurrentComment(null);
        setUpdatedComment("");
    };

    const handleUpdateComment = async () => {
        if (!updatedComment.trim()) {
            message.warning("Please enter a comment.");
            return;
        }

        const payload = {id: currentComment.id, comment: updatedComment};
        const res = await callUpdateComment(payload);

        if (res && res.statusCode === 202) {
            message.success("Comment updated successfully!");
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === currentComment.id
                        ? {...comment, message: updatedComment}
                        : comment
                )
            );
            handleUpdateCancel();
        } else {
            message.error("Failed to update comment.");
        }
    };

    return (<>
        {data && (<div className="container mx-auto px-4 py-8">
            {/* Product Overview */}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/category-thumbnail/${data.imageUrl}`}
                        alt={data.name}
                        className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                        onClick={() => showImagePreview(`${import.meta.env.VITE_BACKEND_URL}/storage/category-thumbnail/${data.imageUrl}`)}
                    />
                </div>
                <div className="md:w-2/3">
                    <h1 className="text-4xl font-bold text-purple-900 mb-4">{data.name}</h1>
                    <p className="text-gray-600 text-lg mb-4">{data.category.name}</p>
                    <p className="text-2xl text-red-500 font-bold mb-4">
                        {data.price.toLocaleString("vi-VN", {
                            style: "currency", currency: "VND",
                        })}
                    </p>
                    <p className="text-gray-700 mb-6">{data.description}</p>
                    <div className="flex items-center mb-4">
                        <label className="mr-4">Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="border rounded-lg w-16 text-center"
                            min="1"
                        />
                    </div>
                    <button
                        onClick={() => handleAddToCart(data.id)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold text-purple-900 mb-6">Bình luận</h2>
                {comments.length > 0 ? (
                    <div className="space-y-4">
                        {currentComments.map((comment) => (
                            <div key={comment.id} className="p-6 bg-white rounded-lg shadow-lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                            <span className="font-semibold text-purple-800 text-lg mr-2">
                                {comment.user.name}
                            </span>
                                        <span className="text-gray-500 text-sm">
                                {new Date(comment.createdAt).toLocaleString("vi-VN")}
                            </span>
                                    </div>
                                </div>
                                <p className="text-gray-800 mb-3">{comment.message}</p>

                                {/* Nút hành động */}
                                <div className="flex space-x-4">
                                    {/* Hiển thị nút Cập nhật chỉ cho chủ sở hữu */}
                                    {user.id === comment.user.id && (
                                        <button
                                            onClick={() => showUpdateModal(comment)}
                                            className="text-blue-500 text-sm hover:text-blue-700"
                                        >
                                            Cập nhật
                                        </button>
                                    )}

                                    {/* Hiển thị nút Xóa cho admin hoặc chủ sở hữu */}
                                    {(user.role.id === 1 || user.id === comment.user.id) && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-red-500 text-sm hover:text-red-700"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Pagination
                            current={currentPage}
                            pageSize={commentsPerPage}
                            total={comments.length}
                            onChange={paginate}
                            className="mt-4"
                        />
                    </div>
                ) : (
                    <p className="text-gray-500">Chưa có bình luận nào.</p>
                )}

                {/* Form bình luận mới */}
                <div className="mt-6">
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Viết bình luận của bạn..."
            rows="4"
        />
                    <button
                        onClick={handleCommentSubmit}
                        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg"
                    >
                        Gửi bình luận
                    </button>
                </div>
            </div>


            {/* Related Products */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold text-purple-900 mb-6">Sản phẩm cùng loại</h2>
                {relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition cursor-pointer"
                            >
                                {/* Khi nhấn vào ảnh, điều hướng đến trang sản phẩm */}
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/category-thumbnail/${product.imageUrl}`}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
                                    onClick={() => navigate(`/product?id=${product.id}`)}
                                />
                                {/* Khi nhấn vào tên, điều hướng đến trang sản phẩm */}
                                <h3
                                    className="text-lg font-bold text-gray-900 mb-2 cursor-pointer"
                                    onClick={() => navigate(`/product?id=${product.id}`)}
                                >
                                    {product.name}
                                </h3>
                                <p className="text-red-500 font-bold mb-2">
                                    {product.price.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </p>
                                {/* Nút Add to Cart vẫn hoạt động như cũ */}
                                <button
                                    onClick={() => handleAddToCart(product.id)} // Pass product.id to the function
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Không có sản phẩm cùng loại nào để hiển thị.</p>
                )}
            </div>

        </div>)}

        {/* Image Preview Modal */}
        <Modal visible={isModalVisible} onCancel={handleCancel} footer={null} centered width={800}>
            <img src={previewImage} alt="Preview" className="w-full h-auto"/>
        </Modal>

        {/* Update Comment Modal */}
        <Modal
            title="Update Comment"
            visible={isUpdateModalVisible}
            onCancel={handleUpdateCancel}
            footer={null}
            centered
        >
                        <textarea
                            value={updatedComment}
                            onChange={(e) => setUpdatedComment(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Update your comment..."
                            rows="4"
                        />
            <button
                onClick={handleUpdateComment}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
                Update Comment
            </button>
        </Modal>
    </>);
};

export default ProductDetail;
