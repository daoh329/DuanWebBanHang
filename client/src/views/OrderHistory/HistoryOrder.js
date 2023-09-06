import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

function HistoryOrder(props) {

    // Lấy giá trị phone từ session
    const phone = window.sessionStorage.getItem('phone');
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/orderhistory/${phone}`)
            .then(res => {
                setData(res.data);
            })
            .catch(error => console.log(error));
    }, []);

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
            title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => <span style={{
                fontWeight: 'bold', color: status === 'Đã xác nhận' ? 'green' : status === 'Chưa xác nhận' ? 'orange' : 'red'
            }}>{status}</span>
        },
    ]

    return (
        <div>
            <h1>Lịch sử mua hàng</h1>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default HistoryOrder;