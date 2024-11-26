import React, { useState } from 'react';
import { Button, Divider, Form, Input, InputNumber, DatePicker, message, Modal, notification } from 'antd';
import { callCreateVoucher } from '../../../services/api';
import dayjs from 'dayjs';

const VoucherCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { code, discount, minOrder, expiry } = values;
        setIsSubmit(true);

        const payload = {
            code,
            discount,
            minOrder,
            expiry: expiry.toISOString(), // Convert to ISO string for API
        };

        const res = await callCreateVoucher(payload);
        if (res && res.data) {
            message.success('Voucher created successfully');
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchCategories(); // Optional: Fetch updated list if necessary
        } else {
            notification.error({
                message: 'An error occurred',
                description: res?.message || 'Failed to create voucher',
            });
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Create New Voucher"
                open={openModalCreate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => setOpenModalCreate(false)}
                okText="Create"
                cancelText="Cancel"
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="voucher-form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[{ required: true, message: 'Please enter the voucher code!' }]}
                    >
                        <Input placeholder="Enter voucher code" />
                    </Form.Item>

                    <Form.Item
                        label="Discount (%)"
                        name="discount"
                        rules={[
                            { required: true, message: 'Please enter the discount percentage!' },
                            { type: 'number', min: 1, max: 100, message: 'Discount must be between 1 and 100!' },
                        ]}
                    >
                        <InputNumber placeholder="Enter discount" min={1} max={100} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Minimum Order Value"
                        name="minOrder"
                        rules={[
                            { required: true, message: 'Please enter the minimum order value!' },
                            { type: 'number', min: 0, message: 'Minimum order must be at least 0!' },
                        ]}
                    >
                        <InputNumber placeholder="Enter minimum order value" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Expiry Date"
                        name="expiry"
                        rules={[{ required: true, message: 'Please select the expiry date!' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Select expiry date"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default VoucherCreate;
