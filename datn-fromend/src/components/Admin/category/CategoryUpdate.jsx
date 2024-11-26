import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, message, Modal, notification, Radio } from 'antd';
import { callUpdateCategory } from '../../../services/api';

const CategoryUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { id, name, active } = values;
        setIsSubmit(true);
        const res = await callUpdateCategory({ id, name, active });
        if (res && res.data) {
            message.success('Cập nhật thành công');
            setOpenModalUpdate(false);
            await props.fetchCategories();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    useEffect(() => {
        form.setFieldsValue(dataUpdate);
    }, [dataUpdate]);

    return (
        <>
            <Modal
                title="Cập nhật doanh mục"
                open={openModalUpdate}
                onOk={() => { form.submit(); }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                }}
                okText="Cập nhật"
                cancelText="Hủy"
                confirmLoading={isSubmit}
                width={600}
                style={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
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
                        labelCol={{ span: 24 }}
                        label="Id"
                        name="id"
                        rules={[{ required: true, message: 'Vui lòng nhập Id!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tên hiển thị"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                    >
                        <Input
                            style={{
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                padding: '10px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Active"
                        name="active"
                        rules={[{ required: true, message: 'Vui lòng chọn!' }]}
                    >
                        <Radio.Group
                            buttonStyle="solid"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '200px',
                            }}
                        >
                            <Radio.Button value={true} style={{ borderRadius: '8px' }}>
                                Active
                            </Radio.Button>
                            <Radio.Button value={false} style={{ borderRadius: '8px' }}>
                                Inactive
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CategoryUpdate;
