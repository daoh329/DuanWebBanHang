import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { format } from 'date-fns';
import axios from "axios";

function Product() {
    const [Product, setProduct] = useState([]);
    const [TypeProduct, setTypeProduct] = useState([]);

    const fetchData = async () => {
        

        await axios.get(`${process.env.REACT_APP_API_URL}/product/json`)
            .then((res) => {
                console.log('API Response:', res.data);
                const sortedOrders = res.data.sort((a, b) => new Date(b.Entry_Date) - new Date(a.Entry_Date));
                setProduct(sortedOrders || []);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            console.log(Product);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // const handleConfirmOrder = async (record) => {
    //     console.log('Confirm order button clicked for order:', record.id);
    //     try {
    //         await axios.put(`http://localhost:3000/order/confirm/${record.id}`);
    //         fetchData();
    //     } catch (error) {
    //         console.error("Error confirming order:", error);
    //     }
    // };

    // const handleCancelOrder = async (record) => {
    //     try {
    //         await axios.put(`http://localhost:3000/order/cancel/${record.id}`);
    //         fetchData();
    //     } catch (error) {
    //         console.error("Error canceling order:", error);
    //     }
    // };

    const columns = [
        // { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        // { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Loại sản phẩm', dataIndex: 'Type', key: 'Type' },
        { title: 'Tổng giá', dataIndex: 'totalAmount', key: 'totalPrice' },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', onClick: '', render: status => <span style={{

                fontWeight: 'bold', color: status === 'available' ? 'green' : status === 'out of stock' ? 'orange' : status === 'discontinued' ? 'red' : 'black'
            }}>{status}</span>
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
        },
    ];

    return (
        <div>
            <h1>Quản lý Sản Phẩm</h1>
            
            <Table columns={columns} dataSource={Product} />
        </div>
    );
}

export default Product;
