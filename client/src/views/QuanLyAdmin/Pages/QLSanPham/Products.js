import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Tooltip, Input } from "antd";
import { format } from "date-fns";
import { RedoOutlined } from "@ant-design/icons";
import axios from "axios";
import ActionButton from "./ActionComponent/ActionButton";
import dayjs from "dayjs";

function Product() {
  const [Product, setProduct] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  //Tìm kiếm theo tên sản phẩm
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredProduct = Product.filter((product) =>
    product.id.toString().includes(searchTerm)
  );

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "SL còn lại",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
      render: (_, record) => {
        const variations = record.variations;
        let remaining_quantity = 0;
        [...variations].forEach((variant) => {
          remaining_quantity += variant.remaining_quantity_variant;
        }) 
        return (
          <span>{remaining_quantity}</span>
        )
      }
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
              {dayjs(created_at).utcOffset(0).format("HH:mm:ss")}
            </p>
            <p style={{ margin: "0" }}>
              {format(new Date(created_at), "dd/MM/yyyy")}
            </p>
          </div>
        ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "0px 10px 0px 10px",
      }}
    >
      <br />
      <h1>Danh sách sản phẩm</h1>

      <Input
        type="text"
        placeholder="Tìm kiếm theo ID sản phẩm..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '10px', width: '20%', height: '30px', marginTop: '10px', borderRadius: '2px' }}
      />
      <Tooltip title="Làm mới">
        <Button
          onClick={getProduct}
          icon={<RedoOutlined />}
          style={{ margin: "0 0 10px 0", marginLeft: '8px' }}
        />
      </Tooltip>
      <Table loading={isLoadingTable} columns={columns} dataSource={filteredProduct} />

      {/* <h1 style={{ paddingTop:'10px' }}>Quản lý Sản Phẩm</h1> */}
      {/* <Table columns={columns} dataSource={Product} /> */}
    </div>
  );
}

export default Product;
