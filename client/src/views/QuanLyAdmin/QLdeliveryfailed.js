import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { utcToZonedTime, format } from 'date-fns-tz';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function QLdeliveryfailed() {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const loadData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/quanlyAllOrder`)
            .then(res => {
                // Lọc và sắp xếp các đơn hàng theo trạng thái và thời gian tạo
                const sortedOrders = res.data
                    .filter(order => order.order_status === 2 || order.order_status === 5)
                    .sort((a, b) => {
                        // Sắp xếp theo trạng thái
                        if (a.order_status < b.order_status) return 1;
                        if (a.order_status > b.order_status) return -1;
        
                        // Nếu trạng thái giống nhau, sắp xếp theo thời gian tạo
                        return new Date(b.order_updated_at) - new Date(a.order_updated_at);
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

    const handleOpenOrderInformations = (order_id) => {
        // Lấy dữ liệu đơn hàng dựa trên order_id
        const orderData = data.find(order => order.order_id === order_id);
    
        // Chuyển hướng người dùng đến trang mới với dữ liệu đơn hàng
        navigate(`/qlbillorder/${order_id}`, { state: { orderData } });
    };

    const columns = [
        {
            title: "Mã ĐH",
            dataIndex: "order_id",
            key: "magd",
            render: (order_id) => (
              <div>
                {order_id}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenOrderInformations(order_id);
                  }}
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  <p>Hóa đơn thanh toán</p>
                </a>
              </div>
            )
        },
        { title: 'Tên người mua', dataIndex: 'user_name', key: 'Username' },
        { title: 'SDT người mua', dataIndex: 'user_phone', key: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        // { title: 'Tên sản phẩm', dataIndex: 'shortDescription', key: 'name' },
        { title: 'Tổng giá', dataIndex: 'totalAmount', key: 'totalPrice' },
        // { title: 'SL', dataIndex: 'quantity', key: 'quantity' },
        { title: 'PTGH', dataIndex: 'deliveryMethod', key: 'deliveryMethod' },

        {
            title: 'PTTT', 
            dataIndex: 'paymentMenthod', 
            key: 'paymentMenthod', 
            render: status => (
                <span style={{
                    fontWeight: 'bold', 
                    color: status === 1 ? 'blue' : (status === 2 ? 'red' : 'red')
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
            render: (date) => {
              const fmt = 'HH:mm:ss - dd/MM/yyyy';
              const zonedDate = utcToZonedTime(date, 'Etc/UTC');
              return format(zonedDate, fmt, { timeZone: 'Etc/UTC' });
            },
          },
          
          {
            title: 'Thời gian CN',
            dataIndex: 'order_updated_at',
            key: 'order_updated_at',
            render: (date) => {
              const fmt = 'HH:mm:ss - dd/MM/yyyy';
              const zonedDate = utcToZonedTime(date, 'Etc/UTC');
              return format(zonedDate, fmt, { timeZone: 'Etc/UTC' });
            },
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
            <h1>Đơn hàng đã hủy hoặc giao không thành công</h1>
            {/* <div>
                <a href="/orders" style={{width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                    Xem đơn hàng trong một tháng
                </a>
            </div>

            <div>
                <a href="/allorders" style={{width: 250, height: 40, marginTop: '10px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem tất cả đơn hàng</a>
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ margin: '10px' }}>
                    <a href="/allorders" style={{ width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                        Xem tất cả đơn hàng
                        </a>
                </div>

                <div style={{ margin: '10px' }}>
                    <a href="/orders" style={{ width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                        Xem đơn hàng trong một tháng
                        </a>
                </div>
            </div> */}
            
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default QLdeliveryfailed;
