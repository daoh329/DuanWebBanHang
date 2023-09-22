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
        axios.get(`${process.env.REACT_APP_API_URL}/order/orderhistory/${phone}`)
            .then(res => {
                setData(res.data);
                const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setData(sortedOrders || []);
            })
            .catch(error => console.log(error));
    }, []);

    const columns = [
        { title: 'Người mua', dataIndex: 'nameOrder', key: 'Username' },
        { title: 'SDT', dataIndex: 'phone', key: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
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
                  color: status === 1 ? 'green' : 'orange'
              }}>
                  {status === 1 ? 'Đã xác nhận' : 'Chưa xác nhận'}
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