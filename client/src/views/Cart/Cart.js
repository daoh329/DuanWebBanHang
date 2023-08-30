
import React, { useState, useEffect } from "react";
import { Table, Button, Layout, Space, Col, Row, Card, Checkbox } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

const { Header, Footer, Sider, Content } = Layout;

function Cart() {

    // Lấy giỏ hàng hiện tại từ session
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    // const [cartList, setCartList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    // const fetchData = async () => {
    //     try {
    //         const res = await axios.get("http://localhost:3000/order/json");
    //         const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    //         setCartList(sortedOrders || []);
    //     } catch (error) {
    //         console.error("Error fetching order data:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const columns = [
        {
            title: '',
            dataIndex: 'checkbox',
            key: 'checkbox',
            render: (_, record) => (
                <Checkbox />
            ),
            width: 50, // Để đảm bảo chiều rộng cố định cho ô checkbox
        },
        {
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (_, record) => (
                <img src={record.avatar} alt="Avatar" style={{ width: '50px', height: '50px' }} />
            ),
            width: 50, // Để đảm bảo chiều rộng cố định cho hình ảnh
        },
        { title: 'Sản Phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Đơn giá', dataIndex: 'Price', key: 'Price' },
        { title: 'Thành tiền', dataIndex: 'Price', key: 'Price' },
    ];

    const handleCheckboxChange = (selected) => {
        setSelectedItems(selected);
    };

    return (
        <Space style={{ width: '80%', marginTop: '20px', display: 'block', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'left' }}>Cart</h2>
            <Row>
                <Col span={18}>
                    <Table columns={columns} dataSource={cart} rowSelection={{ selectedItems, onChange: handleCheckboxChange }} />
                </Col>
                <Col span={6}>
                    <Card title="Thanh toán" bordered={false} style={{ width: 300, marginLeft: "10px" }}>
                        <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                            Tổng tiền tính tạm:
                            <span style={{ color: 'green', fontWeight: 'bold' }}> 100000 vnd</span>
                        </p>
                        <Button type="primary" style={{ width: '100%', marginTop: '10px' }}>Tiếp tục</Button>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
}

export default Cart;
