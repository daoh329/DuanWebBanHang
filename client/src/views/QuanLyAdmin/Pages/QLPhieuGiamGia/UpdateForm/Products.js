/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, Image, message, Select, Modal } from "antd";
import axios from "axios";
import { NotificationBeenLoggedOut } from "../../../../NotificationsForm/Authenticated";
import {
  ExclamationCircleFilled,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

function productdiscount(record) {
  const [productdiscount, setproductdiscount] = useState([]);
  const [Product, setProduct] = useState([]);
  const [ProductMap, setProductMap] = useState([]);
  const [SelectProduct, setSelectProduct] = useState();
  useEffect(() => {
    getProductImgAndDescription();
    getProductDescription();
  }, []);

  const handleChange = (value) => {
    setSelectProduct(value);
  };

  const getProductDescription = async () => {
    const url = `${process.env.REACT_APP_API_URL}/product/Description`;
    try {
      const response = await axios.get(url);
      const productData = response.data;
      setProduct(productData);
      const productMap = productData.map((item) => ({
        value: item.id,
        label: item.shortDescription,
      }));
      setProductMap(productMap);
    } catch (error) {
      console.error(error);
    }
  };
  const getProductImgAndDescription = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/discount/getProductsbyIdDC/${record.data.id}`
      )
      .then(async (res) => {
        await axios
          .post(
            `${process.env.REACT_APP_API_URL}/product/ImgAndDescription`,
            res.data
          )
          .then((product) => {
            setproductdiscount(product.data);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };
  const deleteSanPham = async (products_id, discountCode_id) => {
    try {
      const result = await axios.delete(
        `${process.env.REACT_APP_API_URL}/discount/deleteSanPhamDC`,
        { products_id, discountCode_id },
        { withCredentials: true }
      );
      // window.location.reload();
      if (result.status === 200) {
        message.success("kết thúc thành công.");
        return getProductImgAndDescription();
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
            deleteSanPham(records.id, record.id);
          }}
          okText="Xác nhận"
          cancelText="Trở lại"
        >
          <Button danger>Gỡ</Button>
        </Popconfirm>
      ),
    },
  ];
  const handleAddProduct = () => {
    confirm({
      title: "Bạn chắc chắn muốn bỏ sản phẩm này?",
      icon: <ExclamationCircleFilled />,
      okText: "Xác Nhận",
      cancelText: "Trở lại",
      centered: true,
      onOk() {
        AddProduct(SelectProduct, record.id);
      },
      onCancel() {},
    });
  };
  const AddProduct = async (products_id, discountCode_id) => {
    console.log("run");
    const url = `${process.env.REACT_APP_API_URL}/discount/addProduct`;
    try {
      await axios.post(
        url,
        { products_id, discountCode_id },
        { withCredentials: true }
      );
      getProductDescription();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <br />
      <h5>Thêm sản phẩm áp dụng</h5>:
      <Select
        placeholder="sản phẩm"
        style={{
          display: "inline-block",
          width: "calc(50% - 8px)",
        }}
        onSelect={handleAddProduct}
        options={ProductMap}
        onChange={handleChange}
      />
      <br />
      <h1>Danh sách sản phẩm áp dụng</h1>
      <Table columns={columns} dataSource={productdiscount} />
    </div>
  );
}

export default productdiscount;
