import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

function QLdelivered() {

    const [data, setData] = useState([]);
    const loadData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/quanlyOrder`)
            .then(res => {
                // Sắp xếp các đơn hàng theo trạng thái và thời gian tạo
                const sortedOrders = res.data.sort((a, b) => {    
                    // Nếu trạng thái giống nhau, sắp xếp theo thời gian tạo
                    return new Date(b.order_created_at) - new Date(a.order_created_at);
                });

                // Lọc các đơn hàng có trạng thái bằng 3
                const filteredOrders = sortedOrders.filter(order => order.order_status === 3);
                setData(filteredOrders || []);
            })
            .catch(error => console.log(error));
    };

    // Gọi hàm tải dữ liệu khi component được render
    useEffect(() => {
        loadData();
    }, []);

    // Hàm đã giao đơn hàng
    const handleDelivered = async (record) => {
        if (record.order_id) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/order/delivered/${record.order_id}`);
                loadData();  // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
            } catch (error) {
                console.error("Error delivered order:", error);
            }
        } else {
            console.error("Order ID is undefined:", record);
        }
    };

    // Hàm giao hàng không thành công
    const handleFailed = async (record) => {
        if (record.order_id) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/order/deliveryfailed/${record.order_id}`);
                loadData();  // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
            } catch (error) {
                console.error("Error delivered order:", error);
            }
        } else {
            console.error("Order ID is undefined:", record);
        }
    };

    const columns = [
        { title: 'Mã GD', dataIndex: 'order_id', key: 'magd' },
        { title: 'Tên người mua', dataIndex: 'user_name', key: 'Username' },
        { title: 'SDT mua', dataIndex: 'user_phone', key: 'phone' },
        { title: 'SDT nhận', dataIndex: 'delivery_phone', key: 'phonerecipient' },
        { title: 'Tên sản phẩm', dataIndex: 'shortDescription', key: 'name' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { 
            title: 'Tổng giá',
            key: 'totalPrice',
            render: (text, record) => (
                <p>{record.price * record.quantity}</p>
            ),
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },

        {
            title: 'PTTT', 
            dataIndex: 'paymentMenthod', 
            key: 'paymentMenthod', 
            render: status => (
                <span style={{
                    fontWeight: 'bold', 
                    color: status === 1 ? 'blue' : (status === 2 ? 'blue' : 'blue')
                }}>
                    {status === 2 ? 'MOMO' : (status === 1 ? 'COD' : 'VNPAY')}
                </span>
            )
        },
        
        {
            title: 'Thời gian tạo',
            dataIndex: 'order_updated_at',
            key: 'updated_at',
        },

        {
            title: 'Trạng thái', 
            dataIndex: 'order_status', 
            key: 'status', 
            render: status => (
                <span style={{
                    fontWeight: 'bold', 
                    color: status === 1 ? 'green' : (status === 3 ? '#BDB76B' : 'orange')
                }}>
                    {status === 1 ? 'Đã xác nhận' : (status === 3 ? 'Vận chuyển' : 'Chưa xác nhận')}
                </span>
            )
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'newAction',
            render: (_, record) => (
                <Button style={{ backgroundColor: '#33CCFF', color: 'white' }} onClick={() => handleDelivered(record)}>
                    Đã giao
                </Button>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'cancel',
            render: (_, record) => (
                <Button style={{ backgroundColor: 'violet', color: 'white' }} onClick={() => handleFailed(record)}>
                    Giao không thành công
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1>Xác nhận giao hàng</h1>
            <div>
                <a href="/allorders" style={{width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem tất cả đơn hàng</a>
            </div>

            <div>
                <a href="/orders" style={{width: 250, height: 40, marginTop: '10px' ,display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem đơn hàng trong một tháng</a>
            </div>
            
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default QLdelivered;
