import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Input, Avatar, Table, message, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { utcToZonedTime, format } from "date-fns-tz";
import { useDispatch, useSelector } from "react-redux";

import { CreateNotification } from "../../component/NotificationManager/NotificationManager";
import { SocketContext } from "../App";
import { getPermissionCurrent, loadData } from "../../util/servicesGlobal";
import { openInfoModalNotPermission } from "../NotificationsForm/Authenticated";
import { addCountOrders } from "../../redux/testNotifiOrder";

function OrderList() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const data = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  // Hàm xác nhận đơn hàng
  const handleConfirmOrder = async (record) => {
    // check permission
    if ((await getPermissionCurrent()) === "user") {
      openInfoModalNotPermission();
      return;
    }
    
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
        message.success(`Đơn hàng mã ${record.order_id} xác nhận thành công`);
        loadData(dispatch); // Gọi lại hàm tải dữ liệu sau khi xác nhận đơn hàng
        // Báo lên socket là có thông báo mới cho người dùng
        if (socket) {
          // Gửi thông báo tới server khi nút được click
          socket.emit("notification", { userId: record.user_id });
        }
      } catch (error) {
        console.error("Error confirming order:", error);
      }
    } else {
      console.error("Order ID is undefined:", record);
    }
  };

  // Hàm hủy đơn hàng
  const handleCancelOrder = async (record) => {
    // check permission
    if ((await getPermissionCurrent()) === "user") {
      openInfoModalNotPermission();
      return;
    }
    if (record.order_id) {
      if (record.paymentMenthod === 0 || record.paymentMenthod === 2) {
        // Hiển thị thông báo cho phương thức thanh toán ví điện tử
        Modal.confirm({
          title: "Xác nhận",
          content: `Bạn đã liên hệ khách hàng để xử lý đơn hàng thanh toán điện tử có mã ${record.order_id} chưa?`,
          okText: "Đã xử lý",
          cancelText: "Chưa xử lý",
          onOk: async (socket) => {
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
              message.warning(
                `Đơn hàng mã ${record.order_id} đã dược hủy thành công`
              );
              loadData(dispatch); // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
              // Báo lên socket là có thông báo mới cho người dùng
              if (socket) {
                // Gửi thông báo tới server khi nút được click
                socket.emit("notification", { userId: record.user_id });
              }
            } catch (error) {
              console.error("Error canceling order:", error);
            }
          },
        });
      } else {
        Modal.confirm({
          title: "Xác nhận",
          content: `Bạn đã liên hệ khách hàng để xử lý đơn hàng có mã ${record.order_id} chưa?`,
          okText: "Đã xử lý",
          cancelText: "Chưa xử lý",
          onOk: async () => {
            try {
              await axios.put(
                `${process.env.REACT_APP_API_URL}/order/cancel/${record.order_id}`
              );
              CreateNotification(
                record.user_id,
                record.order_id,
                "2",
                "Hủy đơn hàng thành công",
                `Đơn hàng ${record.order_id} của bạn đã bị hủy`
              );
              message.warning(
                `Đơn hàng mã ${record.order_id} đã dược hủy thành công`
              );
              loadData(dispatch); // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
              // Báo lên socket là có thông báo mới cho người dùng
              if (socket) {
                // Gửi thông báo tới server khi nút được click
                socket.emit("notification", { userId: record.user_id });
              }
            } catch (error) {
              console.error("Error canceling order:", error);
            }
          },
        });
      }
    }
  };

  const handleOpenOrderInformations = (order_id) => {
    // Lấy dữ liệu đơn hàng dựa trên order_id
    const orderData = data.find((order) => order.order_id === order_id);

    // Chuyển hướng người dùng đến trang mới với dữ liệu đơn hàng
    navigate(`/qlbillorder/${order_id}`, { state: { orderData } });
  };

  //TÌm kiếm đơn hàng
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredData = data.filter((order) =>
    order.order_id.toString().includes(searchTerm)
  );

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
            style={{ fontSize: "12px", padding: "5px 10px" }}
          >
            <p>Hóa đơn thanh toán</p>
          </a>
        </div>
      ),
    },
    { title: "Tên người mua", dataIndex: "user_name", key: "Username" },
    { title: "SDT mua", dataIndex: "user_phone", key: "phone" },
    { title: "SDT nhận", dataIndex: "delivery_phone", key: "phonerecipient" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    // { title: "Tên sản phẩm", dataIndex: "shortDescription", key: "name" },
    { title: "Tổng giá", dataIndex: "totalAmount", key: "totalPrice" },
    // { title: "SL", dataIndex: "quantity", key: "quantity" },
    { title: "PTGH", dataIndex: "deliveryMethod", key: "deliveryMethod" },

    {
      title: "PTTT",
      dataIndex: "paymentMenthod",
      key: "paymentMenthod",
      render: (status) => (
        <span
          style={{
            fontWeight: "bold",
            color: status === 1 ? "blue" : status === 2 ? "red" : "red",
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
      render: (date) => {
        const fmt = "HH:mm:ss - dd/MM/yyyy";
        const zonedDate = utcToZonedTime(date, "Etc/UTC");
        return format(zonedDate, fmt, { timeZone: "Etc/UTC" });
      },
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
    <div style={{ backgroundColor: "white", margin: "20px" }}>
      <div style={{ padding: "10px" }}>
        <h1>Đơn đặt hàng</h1>

        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            marginBottom: "10px",
            width: "20%",
            height: "30px",
            marginTop: "10px",
            borderRadius: "5px",
          }}
        />

        <Table columns={columns} dataSource={filteredData} />
      </div>
    </div>
  );
}

export default OrderList;
