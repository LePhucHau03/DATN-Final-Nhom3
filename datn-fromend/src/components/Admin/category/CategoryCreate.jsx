import React, { useState } from 'react';
import { Button, Divider, Form, Input, message, Modal, notification } from 'antd';
import { callCreateCategory } from '../../../services/api';

const CategoryCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { name } = values;
        setIsSubmit(true);
        const res = await callCreateCategory({ name });
        if (res && res.data) {
            message.success('Tạo danh mục thành công');
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchCategories();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Thêm mới danh mục"
            open={openModalCreate}
            onOk={() => { form.submit(); }}
            onCancel={() => setOpenModalCreate(false)}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={isSubmit}
            width={600} // Đặt chiều rộng modal cụ thể
            className="category-create-modal"
            style={{
                top: '10vh', // Khoảng cách từ trên cùng của màn hình
                borderRadius: '10px', // Bo góc modal
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Thêm bóng đổ
            }}
        >
            <Divider />
            <Form
                form={form}
                name="basic"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Tên danh mục"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    style={{
                        marginBottom: 16, // Tăng khoảng cách giữa các trường
                    }}
                >
                    <Input
                        placeholder="Nhập tên danh mục"
                        style={{
                            borderRadius: '8px', // Bo góc các input
                            padding: '10px', // Thêm padding để các input dễ nhìn hơn
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryCreate;
