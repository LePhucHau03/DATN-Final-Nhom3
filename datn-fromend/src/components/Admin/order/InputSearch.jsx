import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, DatePicker, message } from 'antd';

const InputSearch = (props) => {
    const [form] = Form.useForm();
    const [isFormVisible, setIsFormVisible] = useState(false); // Trạng thái để kiểm soát hiển thị form

    const onFinish = (values) => {
        let queryParts = [];

        if (values.receiverName) {
            queryParts.push(`receiverName~%27${values.receiverName}%27`);
        }
        if (values.receiverPhone) {
            queryParts.push(`receiverPhone~%27${values.receiverPhone}%27`);
        }
        if (values.receiverAddress) {
            queryParts.push(`receiverAddress~%27${values.receiverAddress}%27`);
        }
        if (values.status) {
            queryParts.push(`status~%27${values.status}%27`);
        }
        if (values.email) {
            queryParts.push(`user.email~%27${values.email}%27`);
        }

        if (values.startdate && values.enddate) {
            const startDateFormatted = values.startdate.format('YYYY-MM-DDTHH:mm:ss');
            const endDateFormatted = values.enddate.format('YYYY-MM-DDTHH:mm:ss');
            queryParts.push(`createdAt >: '${startDateFormatted}' and createdAt <: '${endDateFormatted}'`);
        } else if (values.startdate || values.enddate) {
            message.error("Both start date and end date must be filled in.");
            return;
        }

        if (queryParts.length > 0) {
            const query = `filter=${queryParts.join('%20and%20')}`;
            props.handleSearch(query);
        }
    };

    return (
        <div className="space-y-4">
            {/* Nút để hiển thị form */}
            <Button
                type="primary"
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-pink-500 text-white hover:bg-pink-600 rounded-lg mb-4"
            >
                {isFormVisible ? "Hide Search Form" : "Show Search Form"}
            </Button>

            {/* Form chỉ hiển thị khi trạng thái isFormVisible = true */}
            {isFormVisible && (
                <Form
                    form={form}
                    name="advanced_search"
                    className="bg-white p-8 rounded-lg shadow-md space-y-4"
                    onFinish={onFinish}
                >
                    {/* Các trường hiển thị theo chiều ngang */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                label="Name"
                                name="receiverName"
                                labelCol={{ span: 24 }}
                            >
                                <Input
                                    placeholder="Enter name"
                                    size="small"  // Kích thước nhỏ
                                    className="border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                label="Phone"
                                name="receiverPhone"
                                labelCol={{ span: 24 }}
                            >
                                <Input
                                    placeholder="Enter phone"
                                    size="small"  // Kích thước nhỏ
                                    className="border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                label="Address"
                                name="receiverAddress"
                                labelCol={{ span: 24 }}
                            >
                                <Input
                                    placeholder="Enter address"
                                    size="small"  // Kích thước nhỏ
                                    className="border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Các trường còn lại hiển thị theo chiều ngang */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                label="Status"
                                name="status"
                                labelCol={{ span: 24 }}
                            >
                                <Input
                                    placeholder="Enter status"
                                    size="small"  // Kích thước nhỏ
                                    className="border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                label="Start Date"
                                name="startdate"
                                labelCol={{ span: 24 }}
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DDTHH:mm:ss"
                                    size="small"  // Kích thước nhỏ
                                    className="border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 w-full"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                label="End Date"
                                name="enddate"
                                labelCol={{ span: 24 }}
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DDTHH:mm:ss"
                                    size="small"  // Kích thước nhỏ
                                    className="border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 w-full"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-pink-500 text-white hover:bg-pink-600 rounded-lg px-6"
                            >
                                Search
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    props.setFilter("");
                                }}
                                className="bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 rounded-lg px-6"
                            >
                                Clear
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}
        </div>
    );
};

export default InputSearch;
