import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

function QLshipping() {

    const [data, setData] = useState([]);
    const loadData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/quanlyOrder`)
            .then(res => {
                // Sắp xếp các đơn hàng theo trạng thái và thời gian tạo
                const sortedOrders = res.data.sort((a, b) => {    
                    // Nếu trạng thái giống nhau, sắp xếp theo thời gian tạo
                    return new Date(b.order_created_at) - new Date(a.order_created_at);
                });

                // Lọc các đơn hàng có trạng thái bằng 1
                const filteredOrders = sortedOrders.filter(order => order.order_status === 1);
                setData(filteredOrders || []);
            })
            .catch(error => console.log(error));
    };

    // Gọi hàm tải dữ liệu khi component được render
    useEffect(() => {
        loadData();
    }, []);

    // Hàm vận chuyển đơn hàng
    const handleShipping = async (record) => {
        if (record.order_id) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/order/shipping/${record.order_id}`);
                loadData();
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
            title: 'Thời gian tạo',
            dataIndex: 'order_created_at',
            key: 'updated_at',
        },

        {
            title: 'Trạng thái', 
            dataIndex: 'order_status', 
            key: 'status', 
            render: status => (
                <span style={{
                    fontWeight: 'bold', 
                    color: status === 1 ? 'green' : (status === 2 ? 'red' : 'orange')
                }}>
                    {status === 1 ? 'Đã xác nhận' : (status === 2 ? 'Đã bị hủy' : 'Chưa xác nhận')}
                </span>
            )
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'newAction',
            render: (_, record) => (
                <Button style={{ backgroundColor: '#FF33FF', color: 'white' }} onClick={() => handleShipping(record)}>
                   Vận chuyển
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1>Xác nhận đơn hàng vận chuyển</h1>
            <div>
                <a href="/delivered" style={{width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xác nhận đơn hàng đã gửi</a>
            </div>

            <div>
                <a href="/orders" style={{width: 250, height: 40, marginTop: '10px' ,display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem đơn hàng trong một tháng</a>
            </div>
            
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default QLshipping;
