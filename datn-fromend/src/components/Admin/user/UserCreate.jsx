import React, { useState } from 'react';
import { Button, Divider, Form, Input, message, Modal, notification } from 'antd';
import { callCreateUser } from '../../../services/api';

const UserCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { name, email, password, firstName } = values;
        setIsSubmit(true);
        const res = await callCreateUser({ name, email, password, firstName });
        if (res && res.data) {
            message.success('Tạo mới thành công');
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Thêm mới người dùng"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => setOpenModalCreate(false)}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={isSubmit}
            className="rounded-lg shadow-xl bg-white p-6"
            style={{ top: 50 }} // Set a margin-top for better visual alignment
        >
            <Divider />

            <Form
                form={form}
                name="basic"
                style={{ maxWidth: '100%' }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đầu tiên!' }]}
                >
                    <Input
                        placeholder="Nhập tên đầu tiên"
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            padding: '10px',
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Last name"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                >
                    <Input
                        placeholder="Nhập tên hiển thị"
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            padding: '10px',
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu"
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            padding: '10px',
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input
                        placeholder="Nhập email"
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            padding: '10px',
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserCreate;
