/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, Image, message } from "antd";
import axios from "axios";
import { NotificationBeenLoggedOut } from "../../../../NotificationsForm/Authenticated";
function productdiscount(record) {
  const [productdiscount, setproductdiscount] = useState([]);
  useEffect(() => {
    getProductImgAndDiscription();
  }, []);

  const getProductImgAndDiscription = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/discount/getProductsbyIdDC/${record.data.id}`
      )
      .then(async (res) => {
        console.log(res.data);
        await axios
          .post(
            `${process.env.REACT_APP_API_URL}/product/ImgAndDescription`,
            res.data.products_id
          )
          .then((res) => {
            setproductdiscount(res);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };
  const deleteSanPham = async (idDiscount, idsanpham) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/discount/deleteSanPhamDC`,
        { idDiscount, idsanpham },
        { withCredentials: true }
      );
      // window.location.reload();
      if (result.status === 200) {
        message.success("kết thúc thành công.");
        return getProductImgAndDiscription();
      }
      return message.error("kết thúc thất bại.");
    } catch (error) {
      setTimeout(() => {
        if (error.response.status === 401) {
          NotificationBeenLoggedOut();
        } else {
          console.log(error);
          message.error("kết thúc thất bại.");
        }
      }, 500);
    }
  };

  const columns = [
    { title: "sản phẩm id", dataIndex: "id", key: "id" },
    {
      title: "sản phẩm",
      dataIndex: "shortDescription",
      key: "shortDescription",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "main_image",
      key: "main_image",
      render: (main_image) => (
        <Image
          src={process.env.REACT_APP_API_URL + main_image}
          width={200}
          height={200}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, records) => (
        <Popconfirm
          title="Cảnh báo!!!"
          description="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => {
            deleteSanPham(record.id, records.id);
          }}
          okText="Xác nhận"
          cancelText="Trở lại"
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <br />
      <h1>Danh sách sản phẩm áp dụng</h1>
      <Table columns={columns} dataSource={productdiscount} />
    </div>
  );
}

export default productdiscount;
