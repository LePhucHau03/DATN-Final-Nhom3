import React, { useEffect, useState } from "react";
import { message, notification } from "antd";
import { useSelector } from "react-redux";
import {
    callChangeQuantityCartItem, callDeleteCart,
    callDeleteOneProductInCart,
    callFetchDataCart, callPlaceOrder
} from "../../services/api.js";
import PayPalPayment from "../Payment/PayPalPayment.jsx";
import { useNavigate } from "react-router-dom";
import { ImCrying } from "react-icons/im";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const user = useSelector((state) => state.account.user);
    const navigate = useNavigate();
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);

    const [formData, setFormData] = useState({
        recipientName: "",
        recipientPhone: "",
        recipientAddress: "",
        paymentMethod: "cod",
    });

    useEffect(() => {
        fetchCartData();
    }, []);

    useEffect(() => {
        calculateTotalAmount();
    }, [cartItems, discountAmount]);

    const fetchCartData = async () => {
        try {
            const response = await callFetchDataCart(user.id);
            if (response.data) {
                setCartItems(response.data);
            } else {
                message.warning("No items found in the cart.");
            }
        } catch (error) {
            message.error("Failed to fetch cart data: " + error.message);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await callDeleteOneProductInCart(id);
            setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
            message.success("Item deleted from cart");
        } catch (error) {
            message.error("Failed to delete item: " + error.message);
        }
    };

    const handleQuantityChange = async (id, quantity) => {
        const validQuantity = Math.max(1, parseInt(quantity, 10) || 1);

        try {
            await callChangeQuantityCartItem(id, validQuantity);
            setCartItems((prevItems) => prevItems.map(item =>
                item.id === id ? { ...item, quantity: validQuantity } : item
            ));
        } catch (error) {
            message.error("Failed to update quantity: " + error.message);
        }
    };

    const calculateTotalAmount = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalAmount(subtotal - discountAmount);
    };

    const handleDiscountCodeChange = (event) => {
        setDiscountCode(event.target.value);
    };

    const applyDiscountCode = () => {
        if (isDiscountApplied) {
            message.info("Discount code has already been applied.");
            return;
        }

        if (discountCode.trim() === "DISCOUNT5" && totalAmount >= 200000) {
            setDiscountAmount(totalAmount * 0.05); // 5% discount
            setIsDiscountApplied(true);
            message.success("5% discount applied for orders over 200,000 VND!");
        } else if (discountCode.trim() === "DISCOUNT10" && totalAmount >= 1000000) {
            setDiscountAmount(totalAmount * 0.1); // 10% discount
            setIsDiscountApplied(true);
            message.success("10% discount applied for orders over 1,000,000 VND!");
        } else {
            message.error("Invalid discount code or minimum order amount not met.");
        }
    };

    const cancelDiscount = () => {
        setDiscountAmount(0);
        setIsDiscountApplied(false);
        setDiscountCode("");
        message.info("Discount has been canceled.");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const detailOrder = cartItems.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
            productId: item.product.id,
            price: item.product.price,
        }));

        const data = {
            receiverName: formData.recipientName,
            receiverAddress: formData.recipientAddress,
            receiverPhone: formData.recipientPhone,
            totalPrice: totalAmount,
            paymentMethod: formData.paymentMethod,
            userId: user.id,
            orderDetails: detailOrder,
        };

        try {
            const res = await callPlaceOrder(data);
            if (res && res.data) {
                message.success('Order placed successfully!');
                await callDeleteCart(user.id);
                setCartItems([]);
            } else {
                notification.error({
                    message: "An error occurred",
                    description: res.message || 'Please try again later.',
                });
            }
        } catch (error) {
            notification.error({
                message: "An error occurred",
                description: error.message || 'Please try again later.',
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const isFormValid = () => {
        return (
            formData.recipientName.trim() !== "" &&
            formData.recipientPhone.trim() !== "" &&
            formData.recipientAddress.trim() !== ""
        );
    };

    return (
        <>
            {cartItems.length > 0 ? (
                <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-1">
                        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
                        <div className="grid gap-6 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-center">
                                    <div className="md:flex items-center space-x-4">
                                        <img
                                            src={`http://localhost:8080/storage/category-thumbnail/${item.product.imageUrl}`}
                                            alt={item.product.name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h2 className="text-xl font-semibold">{item.product.name}</h2>
                                            <p className="text-gray-600">{item.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-700">Quantity:</label>
                                        <input
                                            type="number"
                                            id={`quantity-${item.id}`}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                            className="border border-gray-300 rounded-md py-2 px-3 w-20"
                                            min="1"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-4 md:mt-0"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold">Total:</h2>
                            <p className="text-xl text-gray-800 font-bold">
                                {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            </p>
                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={discountCode}
                                    onChange={handleDiscountCodeChange}
                                    placeholder="Enter discount code"
                                    className="border border-gray-300 rounded-md py-2 px-4 w-full"
                                />
                                <p className="text-gray-600 mt-2">
                                    💡 Use code <strong>DISCOUNT5</strong> for a 5% discount on orders over 200,000 VND, or <strong>DISCOUNT10</strong> for a 10% discount on orders over 1,000,000 VND!
                                </p>
                                <button
                                    onClick={applyDiscountCode}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                                >
                                    Apply Discount
                                </button>
                                {isDiscountApplied && (
                                    <button
                                        onClick={cancelDiscount}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
                                    >
                                        Cancel Discount
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Recipient Information</h2>
                            <div className="grid gap-4">
                                <div>
                                    <label htmlFor="recipientName" className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="recipientName"
                                        id="recipientName"
                                        value={formData.recipientName}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md py-2 px-4 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="recipientPhone" className="block text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="recipientPhone"
                                        id="recipientPhone"
                                        value={formData.recipientPhone}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md py-2 px-4 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="recipientAddress" className="block text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="recipientAddress"
                                        id="recipientAddress"
                                        value={formData.recipientAddress}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md py-2 px-4 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="paymentMethod" className="block text-gray-700">Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        id="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md py-2 px-4 w-full"
                                    >
                                        <option value="cod">Cash on Delivery</option>
                                        <option value="paypal">PayPal</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!isFormValid()}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
                                >
                                    Place Order
                                </button>
                            </div>
                        </form>
                        {formData.paymentMethod === "paypal" && <PayPalPayment totalAmount={totalAmount} />}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64">
                    <ImCrying size={48} className="text-gray-600 mb-4" />
                    <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
                </div>
            )}
        </>
    );
};

export default CartPage;
