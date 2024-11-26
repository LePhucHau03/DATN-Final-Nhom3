import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Tên không được để trống.';
        if (!formData.email) newErrors.email = 'Email không được để trống.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ.';
        if (!formData.message) newErrors.message = 'Tin nhắn không được để trống.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Xử lý gửi dữ liệu ở đây (gọi API hoặc gửi email)
        console.log('Form submitted:', formData);

        // Reset form
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
    };

    return (
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-6 text-purple-800">Liên hệ với chúng tôi</h2>
            <p className="text-lg text-gray-600 mb-6 text-center">
                Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn. Hãy để lại thông tin liên lạc và chúng tôi sẽ phản hồi sớm nhất có thể.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                        Tên của bạn
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        Địa chỉ email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="message">
                        Tin nhắn của bạn
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
                    >
                        Gửi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Contact;
