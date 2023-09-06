import React, { useState, useEffect } from "react";
import { Table, Button,Breadcrumb } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

function HistoryOrder(props) {

    // Lấy giá trị phone từ session
    const phone = window.sessionStorage.getItem('phone');
    console.log(phone)

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
            <h4>Lịch sử mua hàng</h4>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default HistoryOrder;