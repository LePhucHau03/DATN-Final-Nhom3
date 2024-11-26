import React, { useState } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';

const Search = ({ handleSearch, setFilter }) => {
    const [form] = Form.useForm();
    const [isFormVisible, setIsFormVisible] = useState(false); // Trạng thái hiển thị form

    const onFinish = (values) => {
        let queryParts = [];

        if (values.name) {
            queryParts.push(`name~%27${values.name}%27`);
        }

        if (values.email) {
            queryParts.push(`email~%27${values.email}%27`);
        }

        if (queryParts.length > 0) {
            const query = `filter=${queryParts.join('%20and%20')}`;
            console.log("Search query:", query);
            handleSearch(query);
        }
    };

    return (
        <div className="space-y-4">
            {/* Nút để hiển thị form */}
            <Button
                type="primary"
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-pink-500 text-white hover:bg-pink-600 rounded-lg px-6"
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
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item
                                label="Name"
                                name="name"
                                labelCol={{ span: 24 }}
                            >
                                <Input
                                    placeholder="Enter user name"
                                    className="border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                />
                            </Form.Item>

                            <Form.Item
                                label="User email"
                                name="email"
                                labelCol={{ span: 24 }}
                            >
                                <Input
                                    placeholder="Enter user name"
                                    className="border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
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
                                    setFilter("");
                                    handleSearch("");
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

export default Search;
