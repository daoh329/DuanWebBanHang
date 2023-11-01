import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Popconfirm, Modal, message } from "antd";
import { format } from "date-fns";
import axios from "axios";
import ActionButton from "./ActionComponent/ActionButton";

function Product() {
  const [Product, setProduct] = useState([]);

  const getProduct = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/json`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProduct();
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
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Giá", dataIndex: "price", key: "price" },
    {
      title: "SL còn lại",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
    },
    { title: "Loại sản phẩm", dataIndex: "category", key: "category" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        var color;
        if (status === 1) {
          color = "green";
        } else if (status === 0) {
          color = "red";
        } else {
          color = "orange";
        }
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <ActionButton getProduct={getProduct} record={record} />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) =>
        created_at && (
          <div>
            <p style={{ margin: "0" }}>
              {format(new Date(created_at), "HH:mm:ss")}
            </p>
            <p style={{ margin: "0" }}>
              {format(new Date(created_at), "dd/MM/yyyy")}
            </p>
          </div>
        ),
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
