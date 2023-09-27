import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Popconfirm, Modal } from "antd";
import { format } from "date-fns";
import axios from "axios";
import InputFrom from "./InputFrom";

function Product() {
  const [Product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const getProduct = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/json`)
      .then((res) => {
        setProduct(res.data);
        console.log(res.data);
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
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
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
      key: "id",
      dataIndex: "id",
      render: (id, record) => {
        async function handleDisableAndEnable() {
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/product/disable-and-enable`,
              { id, status: record.status }
            );
            window.location.reload();
          } catch (error) {
            console.log(error);
          }
        }

        async function handleUpdate() {
          setIsLoading(true);
          setOpenModal(true);

          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        }

        const handleCancel = () => {
          setOpenModal(false);
        };

        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {record.status === 1 ? (
              <Popconfirm
                title="Cảnh báo!!!"
                description="Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này?"
                onConfirm={handleDisableAndEnable}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Vô hiệu hóa</Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Cảnh báo!!!"
                description="Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này?"
                onConfirm={handleDisableAndEnable}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Kích hoạt</Button>
              </Popconfirm>
            )}
            <Button className="confirm-button" onClick={handleUpdate}>
              Cập nhật
            </Button>
            <Modal
              open={openModal}
              title="Cập nhật sản phẩm"
              onCancel={handleCancel}
              footer={false}
            >
              <InputFrom/>
            </Modal>
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => {
        const created_at_date = format(new Date(created_at), "dd/MM/yyyy"); // Định dạng lại thời gian
        const created_at_time = format(new Date(created_at), "HH:mm:ss"); // Định dạng lại thời gian
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p style={{ margin: "0" }}>{created_at_date}</p>
            <p style={{ margin: "0" }}>{created_at_time}</p>
          </div>
        );
      },
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
