import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

function OrderList() {
    const [orderList, setOrderList] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/json`);
            console.log('API Response:', res.data);
            const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrderList(sortedOrders || []);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleConfirmOrder = async (record) => {
        console.log('Confirm order button clicked for order:', record.id);
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/order/confirm/${record.id}`);
            fetchData();
        } catch (error) {
            console.error("Error confirming order:", error);
        }
    };

    const handleCancelOrder = async (record) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/order/cancel/${record.id}`);
            fetchData();
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };

    const columns = [
        { title: 'Người mua', dataIndex: 'userName', key: 'userName' },
        { title: 'SDT', dataIndex: 'phone', key: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        {
            title: 'Thời gian tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: created_at => format(new Date(created_at), 'dd/MM/yyyy HH:mm:ss'), // Định dạng lại thời gian
        },
        {
            title:  'Trạng thái', dataIndex: 'status', key: 'status',onClick:'', render: status => <span style={{
               
                fontWeight: 'bold', color: status === 'Đã xác nhận' ? 'green' : status === 'Chưa xác nhận' ? 'orange' : 'red'
            }}>{status}</span>
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <span>
                    {record.status === 'Đã xác nhận' ? (
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
        },
    ];

    return (
        <div>
            <h1>Quản lý đơn hàng</h1>
            <Table columns={columns} dataSource={orderList} />
        </div>
    );
}

export default OrderList;
