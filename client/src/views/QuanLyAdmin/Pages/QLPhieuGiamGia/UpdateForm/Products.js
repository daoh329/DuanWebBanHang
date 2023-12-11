/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Image,
  message,
  Select,
  Modal,
  notification,
} from "antd";
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
  // const [Product, setProduct] = useState([]);
  const [ProductMap, setProductMap] = useState([]);
  const [SelectProduct, setSelectProduct] = useState();
  const [api, contextHolder] = notification.useNotification();

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
      // setProduct(productData);
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
            [...product.data].forEach((item) => {
              item.key = item.id;
            });
            setproductdiscount(product.data);
          })
          .catch((error) => {
            setproductdiscount([]);
            console.log(error);
          })
      })
      .catch((error) => {
        if (error.response.status === 404) {
          console.log(error);
          setproductdiscount([]);
        } else {
          console.log(error);
        }
      });
  };

  const deleteSanPham = async (products_id, discountCode_id) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/discount/deleteSanPhamDC`,
        { products_id, discountCode_id },
        { withCredentials: true }
      );
      // window.location.reload();
      if (result.status === 200) {
        message.success("Gỡ thành công.");
        getProductImgAndDescription();
        return;
      }
      return message.error("Thất bại.");
    } catch (error) {
      setTimeout(() => {
        if (error.response.status === 401) {
          NotificationBeenLoggedOut();
        } else {
          console.log(error);
          message.error("Thất bại.");
        }
      }, 500);
    }
  };

  const columns = [
    { title: "ID sản phẩm", dataIndex: "id", key: "id" },
    {
      title: "Sản phẩm",
      dataIndex: "shortDescription",
      key: "shortDescription",
    },
    {
      title: "Hình ảnh",
      dataIndex: "main_image",
      key: "main_image",
      render: (main_image) => (
        <Image
          src={process.env.REACT_APP_API_URL + main_image}
          width={60}
          height={60}
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
            deleteSanPham(records.id, record.data.id);
          }}
          okText="Xác nhận"
          cancelText="Trở lại"
        >
          <Button danger>Gỡ</Button>
        </Popconfirm>
      ),
    },
  ];

  const openNotification = (type, message) => {
    if (type === "success") {
      api.success({
        message: message,
      });
    } else if (type === "error") {
      api.error({
        message: message,
      });
    }
  };

  // modal confirm add product to coupons
  const modalConfirmAddProduct = () => {
    confirm({
      title: "Xác nhận áp dụng giảm giá đối với sản phẩm này?",
      icon: <ExclamationCircleFilled />,
      okText: "Xác Nhận",
      cancelText: "Trở lại",
      centered: true,
      onOk() {
        AddProduct(SelectProduct, record.data.id);
      },
      onCancel() {},
    });
  };
  // function add product to coupons
  const AddProduct = async (products_id, discountCode_id) => {
    const url = `${process.env.REACT_APP_API_URL}/discount/addProduct`;
    try {
      const results = await axios.post(
        url,
        { products_id, discountCode_id },
        { withCredentials: true }
      );
      if (results.status === 200) {
        openNotification("success", "Áp dụng thành công");
      }
      // getProductDescription();
      getProductImgAndDescription();
    } catch (error) {
      console.error(error);
      openNotification("error", "Áp dụng thất bại");
    }
  };

  return (
    <div>
      {contextHolder}
      <br />
      <h5>Thêm sản phẩm áp dụng</h5>
      <div>
        <Select
          placeholder="Chọn sản phẩm"
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            margin: "0 10px 0 0 ",
          }}
          // onSelect={modalConfirmAddProduct}
          options={ProductMap}
          onChange={handleChange}
        />
        <Button onClick={modalConfirmAddProduct} type="primary">
          Áp dụng
        </Button>
      </div>
      <br />
      <h5>Danh sách sản phẩm đã áp dụng</h5>
      <Table columns={columns} dataSource={productdiscount} />
    </div>
  );
}

export default productdiscount;
