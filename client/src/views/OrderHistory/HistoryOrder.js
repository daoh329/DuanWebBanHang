import React, { useState, useEffect } from "react";
import { Table, Button,Breadcrumb } from 'antd';
import { format } from 'date-fns';
import axios from "axios";
import './History.css'  

function HistoryOrder(props) {

    // Lấy giá trị phone từ session
    const phone = window.sessionStorage.getItem('phone');
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/orderhistory/phone/${phone}`)
            .then(res => {
                setData(res.data);
                const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setData(sortedOrders || []);
            })
            .catch(error => console.log(error));
    }, []);

    const columns = [
        { title: 'Mã giao dịch', dataIndex: 'order_id', key: 'magd' },
        { title: 'Người mua', dataIndex: 'user_name', key: 'Username' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Tên sản phẩm', dataIndex: 'shortDescription', key: 'name' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { 
            title: 'Tổng giá',
            key: 'totalPrice',
            render: (text, record) => (
                <p>{record.price * record.quantity}</p>
            ),
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'order_updated_at',
            key: 'updated_at',
        },

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
            title: 'Trạng thái', 
            dataIndex: 'order_status', 
            key: 'status', 
            render: status => (
                <span style={{
                    fontWeight: 'bold', 
                    color: status === 1 ? 'green' : (status === 2 ? '#FF3399' : (status === 3 ? '#BDB76B' : (status === 4 ? '#33CCFF' : (status === 5 ? 'violet' : 'orange'))))
                }}>
                    {status === 1 ? 'Đã xác nhận' : (status === 2 ? 'Đã bị hủy' : (status === 3 ? 'Đang vận chuyển' : (status === 4 ? 'Đã giao hàng' : (status === 5 ? 'Giao hàng không thành công' : 'Chưa xác nhận'))))}
                </span>
            )
          },
    ]

    return (
        <div style={{ margin: '0 auto', width: '80%', marginTop:'10px' }}>
            <h6>
                <Breadcrumb
                    items={[
                        {
                            title: <a href="/">Home</a>,
                        },
                        {
                            title: <a href="/checkSP">Tra cứu</a>,
                        }, {
                            title: <a href="/orderHistory/${phone}">Lịch sử mua hàng</a>,
                        }
                    ]}
                />
            </h6>
            <h4 className="mobile-heading">Lịch sử mua hàng</h4>

            {/* <Table columns={columns} dataSource={data} /> */}

        <div>
          <Table columns={columns} dataSource={data} />
        </div>
    
                    {/*  */}
        </div>
    );
}

export default HistoryOrder;