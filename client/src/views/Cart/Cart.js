import React, { useState, useEffect } from "react";
import { Table, Button, Layout, Space, Col, Row, Card, Checkbox } from 'antd';
import { format } from 'date-fns';
import axios from "axios";
import { useCart } from '../Cart/CartContext';
import './Cart.css'
const { Header, Footer, Sider, Content } = Layout;

function Cart() {
    // Lấy giỏ hàng hiện tại từ session
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    const [selectedItems, setSelectedItems] = useState([]);
    const [sortedCart, setSortedCart] = useState([]); // Thêm state để lưu dữ liệu đã được sắp xếp

    useEffect(() => {
        // Sắp xếp dữ liệu sản phẩm theo thời gian mới nhất đầu tiên
        const sortedProducts = [...cart].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setSortedCart(sortedProducts);
    }, [cart]);

    const columns = [
        {
            title: '',
            dataIndex: 'checkbox',
            key: 'checkbox',
            render: (_, record) => (
                <Checkbox />
            ),
            width: 50,
        },
        {
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (_, record) => (
                <img src={record.avatar} alt="Avatar" style={{ width: '50px', height: '50px' }} />
            ),
            width: 50,
        },
        { title: 'Sản Phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Đơn giá', dataIndex: 'price', key: 'price' },
        { title: 'Thành tiền', dataIndex: 'price', key: 'price' },
    ];

    const handleCheckboxChange = (selected) => {
        setSelectedItems(selected);
    };
    useEffect(() => {
        window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
      }, []);
    return (
        <Space className="responsive-container">
            <h2 style={{ textAlign: 'left' }}>Giỏ hàng</h2>
            <div className="responsive-row">
                <div className="responsive-col1" span={18}>
                    {/* Sử dụng sortedCart thay vì cart */}
                    <Table columns={columns} dataSource={sortedCart} rowSelection={{ selectedItems, onChange: handleCheckboxChange }} />
                </div>
                <div className="responsive-col2" span={6}>
                    <Card className="responsive-card" title="Thanh toán" bordered={false} style={{ width: 300, marginLeft: "10px" }}>
                        <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                            Tổng tiền tính tạm:
                            <span style={{ color: 'green', fontWeight: 'bold' }}> 100000 vnd</span>
                        </p>
                        <Button type="primary" style={{ width: '100%', marginTop: '10px' }}>Tiếp tục</Button>
                    </Card>
                </div>
            </div>
        </Space>
    );
}

export default Cart;
