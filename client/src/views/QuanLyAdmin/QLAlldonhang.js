import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

function QLAlldonhang() {

    const [data, setData] = useState([]);
    const loadData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/quanlyAllOrder`)
            .then(res => {
                // Lọc và sắp xếp các đơn hàng theo trạng thái và thời gian tạo
                const sortedOrders = res.data
                    .filter(order => order.order_status === 4)
                    .sort((a, b) => {
                        // Sắp xếp theo trạng thái
                        if (a.order_status < b.order_status) return 1;
                        if (a.order_status > b.order_status) return -1;

                        // Nếu trạng thái giống nhau, sắp xếp theo thời gian tạo
                        return new Date(b.order_created_at) - new Date(a.order_created_at);
                    });

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
        { title: 'SL', dataIndex: 'quantity', key: 'quantity' },
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
            dataIndex: 'order_created_at',
            key: 'created_at',
        },

        {

            title: 'Thời gian CN',
            dataIndex: 'order_updated_at',
            key: 'order_updated_at',
        },

        {
            title: 'Trạng thái', 
            dataIndex: 'order_status', 
            key: 'status', 
            render: status => (
                <span style={{
                    fontWeight: 'bold', 
                    color: status === 5 ? 'violet' : (status === 2 ? '#FF3399' : (status === 4 ? '#33CCFF' : 'orange'))
                }}>
                    {status === 5 ? 'Giao không thành công' : (status === 2 ? 'Đã bị hủy' : (status === 4 ? 'Đã giao' : 'Chưa xác nhận'))}
                </span>
            )
        }
    ];

    return (
        <div>
            <h1>Tất cả đơn hàng</h1>

            <div>
                <a href="/deliveryfailed" style={{width: 250, height: 60, marginTop: '10px' ,display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                    Đơn hàng đã hủy hoặc giao không thành công
                </a>
            </div>

            <div>
                <a href="/orders" style={{width: 250, height: 40, marginTop: '10px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                    Xem đơn hàng trong một tháng
                </a>
            </div>


            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default QLAlldonhang;
