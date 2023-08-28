import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import axios from "axios";

function OrderList() {
    const [orderList, setOrderList] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/order/json");
            console.log('API Response:', res.data);
            setOrderList(res.data || []);
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
            await axios.post(`http://localhost:3000/order/${record.id}/confirm`);
            fetchData();
        } catch (error) {
            console.error("Error confirming order:", error);
        }
    };
    const handleCancelOrder = async (record) => {
        try {
            await axios.post(`http://localhost:3000/order/${record.id}/cancel`);
            fetchData();
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };
    const columns = [
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },

        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <span>
                    {record.status === 'unconfirmed' ? (
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
