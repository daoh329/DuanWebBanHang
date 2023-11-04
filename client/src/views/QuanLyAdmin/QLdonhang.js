import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import axios from "axios";

import { CreateNotification } from "../../component/NotificationManager/NotificationManager";

function OrderList() {
  const [data, setData] = useState([]);
  const loadData = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/order/quanlyAllOrder`)
      .then((res) => {
        // Lọc và sắp xếp các đơn hàng theo trạng thái và thời gian tạo
        const sortedOrders = res.data
          .filter((order) => order.order_status === 0)
          .sort((a, b) => {
            // Sắp xếp theo trạng thái
            if (a.order_status < b.order_status) return -1;
            if (a.order_status > b.order_status) return 1;

            // Nếu trạng thái giống nhau, sắp xếp theo thời gian tạo
            return new Date(b.order_created_at) - new Date(a.order_created_at);
          });

        setData(sortedOrders || []);
      })
      .catch((error) => console.log(error));
  };

  // Gọi hàm tải dữ liệu khi component được render
  useEffect(() => {
    loadData();
  }, []);

  // Hàm xác nhận đơn hàng
  const handleConfirmOrder = async (record) => {
    if (record.order_id) {
      // console.log('Confirm order button clicked for order:', record.order_id);
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/order/confirm/${record.order_id}`
        );
        CreateNotification(
          record.user_id,
          record.order_id,
          "1",
          "Đơn hàng đã được xác nhận",
          `Đơn hàng ${record.order_id} đã được xác nhận và đang trong quá trình đóng gói`
        );
        loadData(); // Gọi lại hàm tải dữ liệu sau khi xác nhận đơn hàng
        // window.location.reload();
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
        await axios.put(
          `${process.env.REACT_APP_API_URL}/order/cancel/${record.order_id}`
        );
        CreateNotification(
          record.user_id,
          record.order_id,
          "2",
          "Hủy đơn hàng thành công",
          `Đơn hàng ${record.order_id} của bạn đã bị hủy vì không được xác nhận`
        );
        loadData(); // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
      } catch (error) {
        console.error("Error canceling order:", error);
      }
    } else {
      console.error("Order ID is undefined:", record);
    }
  };

  const columns = [
    { title: "Mã GD", dataIndex: "order_id", key: "magd" },
    { title: "Tên người mua", dataIndex: "user_name", key: "Username" },
    { title: "SDT mua", dataIndex: "user_phone", key: "phone" },
    { title: "SDT nhận", dataIndex: "delivery_phone", key: "phonerecipient" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Tên sản phẩm", dataIndex: "shortDescription", key: "name" },
    {
      title: "Tổng giá",
      key: "totalPrice",
      render: (text, record) => <p>{record.price * record.quantity}</p>,
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "PTGH", dataIndex: "deliveryMethod", key: "deliveryMethod" },

    {
      title: "PTTT",
      dataIndex: "paymentMenthod",
      key: "paymentMenthod",
      render: (status) => (
        <span
          style={{
            fontWeight: "bold",
            color: status === 1 ? "blue" : status === 2 ? "blue" : "blue",
          }}
        >
          {status === 2 ? "MOMO" : status === 1 ? "COD" : "VNPAY"}
        </span>
      ),
    },

    { title: "Ghi chú", dataIndex: "order_note", key: "note" },
    {
      title: "Thời gian tạo",
      dataIndex: "order_created_at",
      key: "created_at",
    },

    // {
    //   title: "Trạng thái",
    //   dataIndex: "order_status",
    //   key: "status",
    //   render: (status) => (
    //     <span
    //       style={{
    //         fontWeight: "bold",
    //         color: status === 1 ? "green" : status === 2 ? "red" : "orange",
    //       }}
    //     >
    //       {status === 1
    //         ? "Đã xác nhận"
    //         : status === 2
    //         ? "Đã bị hủy"
    //         : "Chưa xác nhận"}
    //     </span>
    //   ),
    // },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button
          className="confirm-button"
          style={{ backgroundColor: "green", color: "white" }}
          onClick={() => handleConfirmOrder(record)}
        >
          Xác nhận
        </Button>
      ),
    },

    {
      title: "Hành động",
      dataIndex: "action",
      key: "cancel",
      render: (_, record) => (
        <Button
          className="cancel-button"
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => handleCancelOrder(record)}
        >
          Hủy
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Đơn đặt hàng</h1>
       {/* <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ margin: '10px' }}>
          <a href="/shipping" style={{ width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xác nhận vận chuyển đơn hàng</a>
        </div>

        <div style={{ margin: '10px' }}>
          <a href="/allorders" style={{ width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Xem tất cả đơn hàng</a>
        </div>

        <div style={{ margin: '10px' }}>
          <a href="https://sandbox.vnpayment.vn/merchantv2/Transaction/SearchRefund.htm" style={{ width: 250, height: 40, display: 'inline-block', padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', borderRadius: '5px', textDecoration: 'none' }}>Xem lịch sử thanh toán</a>
        </div>
      </div> */}
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default OrderList;
