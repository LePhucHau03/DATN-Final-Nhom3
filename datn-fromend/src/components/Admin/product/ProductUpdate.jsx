import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, message, Modal, notification, Radio, InputNumber, Upload, Select } from 'antd';
import { callUpdateProduct, callFetchAllCategory, callUploadFile } from '../../../services/api';
import { UploadOutlined } from '@ant-design/icons';

const ProductUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [listCategory, setListCategory] = useState([]);
    const [imageUrl, setImageUrl] = useState(null); // Store uploaded imageUrl

    const [form] = Form.useForm();

    useEffect(() => {
        const loadFormData = () => {
            if (dataUpdate) {
                // Pre-fill imageUrl if present
                setImageUrl(dataUpdate.imageUrl);

                // Set form fields including the category
                form.setFieldsValue({
                    ...dataUpdate,
                    category: dataUpdate.category ? dataUpdate.category.id : null,  // Set category field with category id
                });
            }
        };

        fetchCategory();
        loadFormData();
    }, [dataUpdate]);

    const fetchCategory = async () => {
        const res = await callFetchAllCategory();
        if (res && res.data) {
            const categories = res.data
                .filter(item => item.active)
                .map(item => ({ label: item.name, value: item.id }));
            setListCategory(categories);
        }
    };

    // Upload file (imageUrl)
    const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadFile(file, 'category-thumbnail'); // Adjust as needed
        if (res && res.data) {
            const newImageUrl = res.data.fileName;
            setImageUrl(newImageUrl); // Save new imageUrl
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
                message.success('Thumbnail uploaded successfully');
            } else if (info.file.status === 'error') {
                message.error('Thumbnail upload failed');
            }
        },
    };

    const onFinish = async (values) => {
        const { id, name, price, description, category, active } = values;
        setIsSubmit(true);

        const categoryId = category;

        const res = await callUpdateProduct({
            id,
            name,
            price,
            imageUrl: imageUrl, // Use imageUrl from state
            description,
            categoryId,
            active // Include active field
        });

        if (res && res.data) {
            message.success('Product updated successfully');
            setOpenModalUpdate(false);
            await props.fetchProducts(); // Assuming a fetch function to refresh products
        } else {
            notification.error({
                message: 'Update failed',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Update Product"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                }}
                okText="Update"
                cancelText="Cancel"
                confirmLoading={isSubmit}
                width={800}
                style={{ borderRadius: '12px' }}
                bodyStyle={{ padding: '20px', backgroundColor: '#f9f9f9' }}
                centered
            >
                <Divider orientation="left" style={{ marginBottom: 20 }}>Update Product Details</Divider>

                <Form
                    form={form}
                    name="updateProduct"
                    style={{ maxWidth: '100%' }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        hidden
                        label="ID"
                        name="id"
                        rules={[{ required: true, message: 'Product ID is required!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the product name!' }]}
                    >
                        <Input placeholder="Enter product name" />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter the product price!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Enter price"

                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter the product description!' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter product description" />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select
                            showSearch
                            allowClear
                            options={listCategory}
                            placeholder="Select category"
                        />
                    </Form.Item>

                    {/* Active Status */}
                    <Form.Item
                        label="Active"
                        name="active"
                        rules={[{ required: true, message: 'Please select the status!' }]}
                    >
                        <Radio.Group>
                            <Radio value={true}>Active</Radio>
                            <Radio value={false}>Inactive</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* Thumbnail Upload */}
                    <Form.Item
                        label="Thumbnail"
                        name="thumbnail"
                    >
                        <Upload {...propsUploadThumbnail}>
                            <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                                {imageUrl ? 'Change Thumbnail' : 'Upload Thumbnail'}
                            </Button>
                        </Upload>
                        {imageUrl && (
                            <div style={{ marginTop: 10 }}>
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/category-thumbnail/${imageUrl}`}
                                    alt="Product Thumbnail"
                                    style={{ maxWidth: 150, marginTop: 10, borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ProductUpdate;
