import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, InputNumber, DatePicker, message, Modal, notification } from 'antd';
import { callUpdateVoucher } from '../../../services/api';
import dayjs from 'dayjs';

const VoucherUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { id, code, discount, minOrder, expiry } = values;
        setIsSubmit(true);

        const payload = {
            id,
            code,
            discount,
            minOrder,
            expiry: expiry.toISOString(), // Convert to ISO string for API
        };

        const res = await callUpdateVoucher(payload);
        if (res && res.data) {
            message.success('Voucher updated successfully');
            setOpenModalUpdate(false);
            await props.fetchCategories(); // Optional: Fetch updated list if necessary
        } else {
            notification.error({
                message: 'An error occurred',
                description: res?.message || 'Failed to update voucher',
            });
        }
        setIsSubmit(false);
    };

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ...dataUpdate,
                expiry: dayjs(dataUpdate.expiry), // Convert expiry to dayjs object
            });
        }
    }, [dataUpdate]);

    return (
        <>
            <Modal
                title="Update Voucher"
                open={openModalUpdate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                }}
                okText="Update"
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
                        hidden
                        label="ID"
                        name="id"
                        rules={[{ required: true, message: 'ID is required!' }]}
                    >
                        <Input />
                    </Form.Item>

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

export default VoucherUpdate;
