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
                const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
        if (record.id) {
            console.log('Confirm order button clicked for order:', record.id);
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/order/confirm/${record.id}`);
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
        if (record.id) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/order/cancel/${record.id}`);
                loadData();  // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
            } catch (error) {
                console.error("Error canceling order:", error);
            }
        } else {
            console.error("Order ID is undefined:", record);
        }
    };

    const columns = [
        { title: 'Người mua', dataIndex: 'nameOrder', key: 'Username' },
        { title: 'SDT', dataIndex: 'phone', key: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Tên sản phẩm', dataIndex: 'shortDescription', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        {
            title: 'Thời gian tạo',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Trạng thái', 
            dataIndex: 'status', 
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
                    {record.status === 1 ? (
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
