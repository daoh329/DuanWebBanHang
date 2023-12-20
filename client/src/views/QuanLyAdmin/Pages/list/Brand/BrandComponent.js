import React, { createContext, useEffect, useState } from "react";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Modal, notification, Spin, Table, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import FormInputBrand from "./BrandInputComponent";
import {
  NotificationBeenLoggedOut,
  NotificationLogout,
  openInfoModalNotPermission,
} from "../../../../NotificationsForm/Authenticated";
import { getPermissionCurrent } from "../../../../../util/servicesGlobal";

function Brand() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModals, setOpenModals] = useState({});
  const table = "brands";
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Vui lòng nhập tên brand"),
    }),
    onSubmit: async (values) => {
      if ((await getPermissionCurrent()) === "user") {
        openInfoModalNotPermission();
        return;
      }

      setIsModalOpen(true);
      const url = `${process.env.REACT_APP_API_URL}/List/add/${table}`;
      try {
        const res = await axios.post(url, values, { withCredentials: true });
        if (res.status === 200) {
          getBrands();
          setTimeout(() => {
            setIsModalOpen(false);
            notification.success({
              message: "Thành công",
              description: "Dữ liệu đã được lưu thành công!",
            });
          }, 1000);
        } else {
          setTimeout(() => {
            setIsModalOpen(false);
            notification.error({
              message: "Lỗi",
              description: "Có lỗi xảy ra khi lưu dữ liệu!",
            });
          }, 1000);
        }
      } catch (e) {
        // Nếu lỗi chưa đăng nhập
        if (e.response.data.message === "Unauthorized") {
          setTimeout(() => {
            setIsModalOpen(false);
            NotificationBeenLoggedOut();
          }, 500);
        } else {
          // Các lỗi khác
          setTimeout(() => {
            setIsModalOpen(false);
            notification.error({
              message: "Lỗi",
              description: "Có lỗi xảy ra khi lưu dữ liệu!",
            });
          }, 1000);
        }
      }
    },
  });

  const [brand, setBrand] = useState([]);
  useEffect(() => {
    getBrands();
  }, []);

  const getBrands = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/List/${table}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const arrCopy = [...response.data.results];
        for (let i = 0; i < arrCopy.length; i++) {
          arrCopy[i].key = i + 1;
        }
        setBrand(arrCopy);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdate = (name) => {
    setOpenModals({
      ...openModals,
      [name]: true,
    });
  };

  const handleCancel = (name) => {
    setOpenModals({
      ...openModals,
      [name]: false,
    });
  };

  const handleBrandUpdated = () => {
    getBrands();
  };

  const handleDelete = async (name) => {
    // Check permission
    if ((await getPermissionCurrent()) === "user") {
      openInfoModalNotPermission();
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/List/delete/${table}/${name}`,
        null,
        { withCredentials: true }
      );
      getBrands();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    {
      title: "Hành động",
      dataIndex: "name",
      key: "action",
      render: (name, record) => (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Button className="confirm-button" onClick={() => handleUpdate(name)}>
            <EditOutlined />
            Sửa{" "}
          </Button>
          <Modal
            open={openModals[name]}
            title="Cập nhật sản phẩm"
            onCancel={() => handleCancel(name)}
            footer={false}
          >
            <FormInputBrand name={name} onUpdated={handleBrandUpdated} />
          </Modal>
          <Popconfirm
            title="Cảnh báo!!!"
            description="Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này?"
            onConfirm={() => handleDelete(name)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              <DeleteOutlined />
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="container-content">
      <div className="page-group">
        <div className="page1-control">
          {/* <h3 style={{ fontWeight: "bold" }}>Chỉnh sửa</h3> */}
          <br />
          <Table columns={columns} dataSource={brand} />
        </div>
        <div className="page2-control">
          <form
            className="form"
            id="form-create-brand"
            onSubmit={formik.handleSubmit}
          >
            <h3 style={{ fontWeight: "bold" }}>Thêm thương hiệu</h3>
            <div className="form-group">
              {/* <label className="form-label">brand</label> */}
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={formik.values.name}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.name && (
                <span className="form-message">{formik.errors.name}</span>
              )}
            </div>
            <button type="submit" className="btn-submit-form">
              Xác nhận
            </button>
            <Modal open={isModalOpen} footer={null} closeIcon={null}>
              <Spin tip="Đang tải lên..." spinning={true}>
                <div style={{ minHeight: "50px" }} className="content" />
              </Spin>
            </Modal>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Brand;
