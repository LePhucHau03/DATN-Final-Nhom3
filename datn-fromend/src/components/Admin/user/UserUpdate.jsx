import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, message, Modal, notification, Radio } from 'antd';
import { callUpdateUser } from '../../../services/api';

const UserUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { id, name, firstName, enabled } = values;
        setIsSubmit(true);
        const res = await callUpdateUser({ id, name, firstName, enabled });
        if (res && res.data) {
            message.success('Cập nhật user thành công');
            setOpenModalUpdate(false);
            await props.fetchUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    useEffect(() => {
        form.setFieldsValue(dataUpdate);
    }, [dataUpdate]);

    return (
        <Modal
            title="Cập nhật người dùng"
            open={openModalUpdate}
            onOk={() => { form.submit(); }}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
            width={600} // Đặt chiều rộng modal cụ thể
            className="user-update-modal"
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
                    hidden
                    label="Id"
                    name="id"
                    rules={[{ required: true, message: 'Vui lòng nhập Id!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[{ required: true, message: 'Vui lòng nhập firstName!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Tên hiển thị"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Enabled"
                    name="enabled"
                    rules={[{ required: true, message: 'Vui lòng chọn!' }]}
                >
                    <Radio.Group>
                        <Radio value={true}>True</Radio>
                        <Radio value={false}>False</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserUpdate;
