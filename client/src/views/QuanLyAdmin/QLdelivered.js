import React, { useState, useEffect } from "react";
import { Button, Form, Input, Avatar, Table, message, Modal } from "antd";
import { utcToZonedTime, format } from 'date-fns-tz';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function QLdelivered() {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const loadData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/quanlyAllOrder`)
            .then(res => {
                // Sắp xếp các đơn hàng theo trạng thái và thời gian tạo
                const sortedOrders = res.data.sort((a, b) => {
                    // Nếu trạng thái giống nhau, sắp xếp theo thời gian tạo
                    return new Date(b.order_created_at) - new Date(a.order_created_at);
                });

                // Lọc các đơn hàng có trạng thái bằng 3
                const filteredOrders = sortedOrders.filter(order => order.order_status === 3);
                setData(filteredOrders || []);
            })
            .catch(error => console.log(error));
    };

    // Gọi hàm tải dữ liệu khi component được render
    useEffect(() => {
        loadData();
    }, []);

    // Hàm đã giao đơn hàng
    const handleDelivered = async (record) => {
        if (record.order_id) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/order/delivered/${record.order_id}`);
                loadData();  // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
            } catch (error) {
                console.error("Error delivered order:", error);
            }
        } else {
            console.error("Order ID is undefined:", record);
        }
    };

    const handleFailed = async (record) => {
        if (record.order_id) {
            if (record.paymentMenthod === 0 || record.paymentMenthod === 2) {
                // Hiển thị thông báo cho phương thức thanh toán ví điện tử
                Modal.confirm({
                    title: 'Xác nhận',
                    content: 'Bạn đã xử lý đơn hàng thanh toán bằng ví điện tử?',
                    okText: 'Đã xử lý',
                    cancelText: 'Chưa xử lý',
                    onOk: async () => {
                        // Thực hiện hành động nếu đã xử lý
                        try {
                            await axios.put(`${process.env.REACT_APP_API_URL}/order/deliveryfailed/${record.order_id}`);
                            loadData();  // Gọi lại hàm tải dữ liệu sau khi giao hàng không thành công
                        } catch (error) {
                            console.error("Error delivered order:", error);
                        }
                    },
                });
            } else {
                // Thực hiện hành động giao hàng không thành công cho các phương thức thanh toán khác
                try {
                    await axios.put(`${process.env.REACT_APP_API_URL}/order/deliveryfailed/${record.order_id}`);
                    loadData();  // Gọi lại hàm tải dữ liệu sau khi giao hàng không thành công
                } catch (error) {
                    console.error("Error delivered order:", error);
                }
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
        { title: 'SDT mua', dataIndex: 'user_phone', key: 'phone' },
        { title: 'SDT nhận', dataIndex: 'delivery_phone', key: 'phonerecipient' },
        // { title: 'Tên sản phẩm', dataIndex: 'shortDescription', key: 'name' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Tổng giá', dataIndex: 'totalAmount', key: 'totalPrice' },
        // { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },

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
        

        {
            title: "Thời gian tạo",
            dataIndex: "order_updated_at",
            key: "updated_at",
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
                    color: status === 1 ? 'green' : (status === 3 ? '#BDB76B' : 'orange')
                }}>
                    {status === 1 ? 'Đã xác nhận' : (status === 3 ? 'Vận chuyển' : 'Chưa xác nhận')}
                </span>
            )
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'newAction',
            render: (_, record) => (
                <Button style={{ backgroundColor: '#33CCFF', color: 'white' }} onClick={() => handleDelivered(record)}>
                    Đã giao
                </Button>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'cancel',
            render: (_, record) => (
                <Button style={{ backgroundColor: 'violet', color: 'white' }} onClick={() => handleFailed(record)}>
                    Giao không thành công
                </Button>
            ),
        },
    ];

    return (
        <div style={{ backgroundColor: 'white', margin: ' 20px' }}>
            <div style={{padding:"10px"}}>
            <h1>Xác nhận giao hàng</h1>
            {/* <div>
                <a href="/allorders" style={{width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem tất cả đơn hàng</a>
            </div>

            <div>
                <a href="/orders" style={{width: 250, height: 40, marginTop: '10px' ,display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem đơn hàng trong một tháng</a>
            </div>
            
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ margin: '10px' }}>
                    <a href="/allorders" style={{ width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem tất cả đơn hàng</a>
                </div>

                <div style={{ margin: '10px' }}>
                    <a href="/orders" style={{ width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem đơn hàng trong một tháng</a>
                </div>
            </div> */}

            <Table columns={columns} dataSource={data} />
            </div>
        </div>
    );
}

export default QLdelivered;
