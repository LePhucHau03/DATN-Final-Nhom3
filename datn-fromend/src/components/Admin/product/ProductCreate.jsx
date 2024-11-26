import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, message, Modal, notification, Upload, Button, InputNumber, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { callCreateProduct, callFetchAllCategory, callUploadFile } from '../../../services/api';

const ProductCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState(null); // Store uploaded thumbnail URL
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        const res = await callFetchAllCategory();
        if (res && res.data) {
            const d = res.data
                .filter(item => item.active)
                .map(item => ({ label: item.name, value: item.id }));
            setListCategory(d);
        }
    };

    // Handle thumbnail upload
    const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadFile(file, 'category-thumbnail');
        if (res && res.data) {
            const newThumbnail = res.data.fileName;
            setThumbnailUrl(newThumbnail); // Save the uploaded thumbnail URL
            onSuccess('ok');
        } else {
            onError('Upload failed');
        }
    };

    const propsUploadThumbnail = {
        maxCount: 1,
        multiple: false,
        customRequest: handleUploadThumbnail,
        onChange(info) {
            if (info.file.status === 'done') {
                message.success('Image uploaded successfully');
            } else if (info.file.status === 'error') {
                message.error('Image upload failed');
            }
        },
    };

    const onFinish = async (values) => {
        const { name, price, description, brandId } = values;
        setIsSubmit(true);
        const res = await callCreateProduct({
            name,
            price,
            thumbnail: thumbnailUrl,
            description,
            brandId,
        });
        if (res && res.data) {
            setIsSubmit(false);
            message.success('Product created successfully');
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchProducts();
        } else {
            notification.error({
                message: 'Error occurred',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Add New Product"
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => setOpenModalCreate(false)}
                okText="Create"
                cancelText="Cancel"
                confirmLoading={isSubmit}
                centered
                width={700}
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                    padding: '30px',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Divider />
                <Form
                    form={form}
                    name="createProductForm"
                    style={{ maxWidth: '100%' }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Product Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the product name!' }]}
                    >
                        <Input
                            placeholder="Enter product name"
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                marginBottom: '16px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter the price!' }]}
                    >
                        <InputNumber
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                marginBottom: '16px',
                            }}
                            min={0}

                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter the description!' }]}
                    >
                        <Input.TextArea
                            placeholder="Enter product description"
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                marginBottom: '16px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="brandId"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="Select category"
                            options={listCategory}
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                padding: '12px',
                                marginBottom: '16px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="Thumbnail" name="thumbnail" rules={[{ required: true, message: 'Please upload a thumbnail!' }]}>
                        <Upload {...propsUploadThumbnail}>
                            <Button
                                icon={<UploadOutlined />}
                                style={{
                                    backgroundColor: '#4CAF50',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    padding: '',
                                    width: '100%',
                                    marginBottom: '16px',
                                    fontSize: '16px',
                                }}
                            >
                                Upload Thumbnail
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ProductCreate;
