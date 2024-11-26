import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Select, Button, Empty } from 'antd'; // Import thêm Select và Button
import { Bar, Pie, Line } from '@ant-design/plots';
import {
    callCategoryProductCount,
    callCountUserOrder,
    callFindRevenueStatisticsByMonthAndYear,
    callFindDate, // Import API cho ngày
} from "../../services/api.js";

const AdminPage = () => {
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [dailyRevenueData, setDailyRevenueData] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [filteredMonthlyData, setFilteredMonthlyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const revenueResponse = await callFindRevenueStatisticsByMonthAndYear();
                if (revenueResponse.statusCode === 200) {
                    const revenueData = revenueResponse.data.map(item => ({
                        month: item.monthYear,
                        value: item.totalRevenue,
                    }));
                    setLineData(revenueData);
                    setMonthlyRevenueData(revenueData); // Gán dữ liệu tháng
                    setTotalRevenue(revenueResponse.data.reduce((total, item) => total + item.totalRevenue, 0));
                }

                const categoryResponse = await callCategoryProductCount();
                if (categoryResponse.statusCode === 200) {
                    const categoryData = categoryResponse.data.map(item => ({
                        type: item.categoryName,
                        value: item.bookCount,
                    }));
                    setBarData(categoryData);
                }

                const userOrderResponse = await callCountUserOrder();
                if (userOrderResponse.statusCode === 200) {
                    const userOrderData = userOrderResponse.data.map(item => ({
                        type: item.email,
                        value: item.value,
                    }));
                    setPieData(userOrderData);
                }

                const dateResponse = await callFindDate();
                if (dateResponse.statusCode === 200) {
                    const dateData = dateResponse.data.map(item => ({
                        date: item.date,
                        value: item.totalPrice,
                    }));
                    setDailyRevenueData(dateData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleDateChange = (value) => {
        setSelectedDates(value);
        setFilteredData(value.length > 0 ? dailyRevenueData.filter(item => value.includes(item.date)) : []);
    };

    const handleResetDates = () => {
        setSelectedDates([]);
        setFilteredData([]);
    };

    const handleMonthChange = (value) => {
        setSelectedMonths(value);
        setFilteredMonthlyData(value.length > 0 ? monthlyRevenueData.filter(item => value.includes(item.month)) : []);
    };

    const handleResetMonths = () => {
        setSelectedMonths([]);
        setFilteredMonthlyData([]);
    };

    // Bar chart configuration
    const barConfig = {
        data: barData,
        xField: 'value',
        yField: 'type',
        seriesField: 'type',
        colorField: 'type',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
    };

    // Pie chart configuration
    const pieConfig = {

        data: pieData,
        xField: 'value',
        yField: 'type',
        seriesField: 'type',
        colorField: 'type',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },

    };

    // Line chart configuration for daily revenue
    const dailyLineConfig = {
        data: filteredData.length > 0 ? filteredData : dailyRevenueData,
        xField: 'date',
        yField: 'value',
        label: {},
        point: {
            size: 5,
            shape: 'diamond',
        },
        smooth: true,
    };

    // Line chart configuration for monthly revenue
    const monthlyLineConfig = {
        data: filteredMonthlyData.length > 0 ? filteredMonthlyData : monthlyRevenueData,
        xField: 'month',
        yField: 'value',
        label: {},
        point: {
            size: 5,
            shape: 'diamond',
        },
        smooth: true,
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Số sản phẩm thuộc doanh mục (Bar Chart)" bordered={false}>
                        <Bar {...barConfig} />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Top 3 user mua hàng nhiều nhất" bordered={false}>
                        <Bar {...pieConfig} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <Card
                        title="Doanh thu theo ngày"
                        bordered={false}
                        extra={
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '300px' }}
                                    placeholder="Chọn ngày"
                                    onChange={handleDateChange}
                                    options={dailyRevenueData.map(item => ({
                                        value: item.date,
                                        label: item.date,
                                    }))}
                                    value={selectedDates}
                                />
                                <Button onClick={handleResetDates}>Reset ngày</Button>
                                <Button type="primary" onClick={() => setFilteredData(dailyRevenueData)}>Xem tất cả</Button>
                            </div>
                        }
                    >
                        {filteredData.length === 0 && selectedDates.length === 0 ? (
                            <Empty description="Chọn ngày để xem biểu đồ !" />
                        ) : (
                            <Line {...dailyLineConfig} />
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <Card
                        title="Doanh thu theo tháng"
                        bordered={false}
                        extra={
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '300px' }}
                                    placeholder="Chọn tháng"
                                    onChange={handleMonthChange}
                                    options={monthlyRevenueData.map(item => ({
                                        value: item.month,
                                        label: item.month,
                                    }))}
                                    value={selectedMonths}
                                />
                                <Button onClick={handleResetMonths}>Reset tháng</Button>
                                <Button type="primary" onClick={() => setFilteredMonthlyData(monthlyRevenueData)}>Xem tất cả</Button>
                            </div>
                        }
                    >
                        {filteredMonthlyData.length === 0 && selectedMonths.length === 0 ? (
                            <Empty description="Chọn tháng để xem biểu đồ !" />
                        ) : (
                            <Line {...monthlyLineConfig} />
                        )}
                    </Card>
                </Col>
            </Row>


            <Card title="Total Revenue" bordered={false} style={{ marginBottom: '20px' }}>
                <Typography.Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    Tổng doanh thu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
                </Typography.Text>
            </Card>
        </div>
    );
};

export default AdminPage;
