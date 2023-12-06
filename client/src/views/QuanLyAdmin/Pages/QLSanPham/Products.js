import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Tooltip } from "antd";
import { format } from "date-fns";
import { RedoOutlined } from "@ant-design/icons";
import axios from "axios";
import ActionButton from "./ActionComponent/ActionButton";

function Product() {
  const [Product, setProduct] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    setIsLoadingTable(true);
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/json`, {
        withCredentials: true,
      })
      .then((res) => {
        const arrCopy = [...res.data];
        arrCopy.forEach((item) => {
          item.key = item.id;
        });
        setProduct(arrCopy);
        setIsLoadingTable(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingTable(false);
      });
  };

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
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
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
      render: (status) => {
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
      <br />
      <h1>Danh sách sản phẩm</h1>
      <Tooltip title="Làm mới">
        <Button
          onClick={getProduct}
          icon={<RedoOutlined />}
          style={{ margin: "0 0 10px 0" }}
        />
      </Tooltip>
      <Table loading={isLoadingTable} columns={columns} dataSource={Product} />
    </div>
  );
}

export default Product;
