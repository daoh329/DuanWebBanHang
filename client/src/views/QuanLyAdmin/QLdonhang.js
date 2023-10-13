import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

function OrderList() {

    const [data, setData] = useState([]);
    // Hàm tải dữ liệu
    const loadData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/quanlyOrder`)
            .then(res => {
                const sortedOrders = res.data.sort((a, b) => new Date(b.order_updated_at) - new Date(a.order_updated_at));
                setData(sortedOrders || []);
            })
            .catch(error => console.log(error));
    };

    // Gọi hàm tải dữ liệu khi component được render
    useEffect(() => {
        loadData();
    }, []);

    // Hàm xác nhận đơn hàng
    const handleConfirmOrder = async (record) => {
        if (record.order_id) {
            console.log('Confirm order button clicked for order:', record.order_id);
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/order/confirm/${record.order_id}`);
                loadData();  // Gọi lại hàm tải dữ liệu sau khi xác nhận đơn hàng
            } catch (error) {
                console.error("Error confirming order:", error);
            }
        } else {
            console.error("Order ID is undefined:", record);
        }
    };

    // Hàm hủy đơn hàng
    const handleCancelOrder = async (record) => {
        if (record.order_id) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/order/cancel/${record.order_id}`);
                loadData();  // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
            } catch (error) {
                console.error("Error canceling order:", error);
            }
        } else {
            console.error("Order ID is undefined:", record);
        }
    };

    const columns = [
        { title: 'Mã GD', dataIndex: 'order_id', key: 'magd' },
        { title: 'Tên người mua', dataIndex: 'user_name', key: 'Username' },
        { title: 'SDT người mua', dataIndex: 'user_phone', key: 'phone' },
        { title: 'SDT người nhận', dataIndex: 'delivery_phone', key: 'phonerecipient' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Tên sản phẩm', dataIndex: 'shortDescription', key: 'name' },
        { 
            title: 'Tổng giá',
            key: 'totalPrice',
            render: (text, record) => (
                <p>{record.price * record.quantity}</p>
            ),
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'PTGH', dataIndex: 'deliveryMethod', key: 'deliveryMethod' },

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

        { title: 'Ghi chú', dataIndex: 'order_note', key: 'note' },
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
                    color: status === 1 ? 'green' : (status === 2 ? 'red' : 'orange')
                }}>
                    {status === 1 ? 'Đã xác nhận' : (status === 2 ? 'Đã bị hủy' : 'Chưa xác nhận')}
                </span>
            )
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <span>
                    {record.order_status === 1 ? (
                        <Button className="cancel-button" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleCancelOrder(record)}>
                            Hủy
                        </Button>
                    ) : (
                        <Button className="confirm-button" style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleConfirmOrder(record)}>
                            Xác nhận
                        </Button>
                    )}
                </span>
            ),
        }
    ];

    return (
        <div>
            <h1>Quản lý đơn hàng</h1>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default OrderList;
