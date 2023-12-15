import React, { useEffect, useState } from "react";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Modal, notification, Spin, Table, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import FormInputColor from "./ColorInputComponent";
import { getPermission } from "../../../../../util/servicesGlobal";
import { openInfoModalNotPermission } from "../../../../NotificationsForm/Authenticated";

function Color() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const table = "colors";
  const [openModals, setOpenModals] = useState({});
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Vui lòng nhập tên color"),
    }),
    onSubmit: async (values) => {
      // Check permission
      if ((await getPermission()) === "user") {
        openInfoModalNotPermission();
        return;
      }

      setIsModalOpen(true);
      const url = `${process.env.REACT_APP_API_URL}/List/add/colors`;
      try {
        const res = await axios.post(url, values, { withCredentials: true });
        if (res.status === 200) {
          setTimeout(() => {
            getColors();
            setIsModalOpen(false);
            notification.success({
              message: "Thành công",
              description: "Dữ liệu đã được lưu thành công!",
            });
          }, 1000);
        } else {
          setIsModalOpen(false);
          notification.error({
            message: "Lỗi",
            description: "Có lỗi xảy ra khi lưu dữ liệu!",
          });
        }
      } catch (e) {
        setIsModalOpen(false);
        console.log(e);
        notification.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra khi lưu dữ liệu!",
        });
      }
    },
  });

  const [color, setColor] = useState([]);

  useEffect(() => {
    getColors();
  }, []);

  const getColors = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/List/colors`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const arrCopy = [...response.data.results];
        arrCopy.forEach((item, index) => {
          item.key = index + 1;
        });
        setColor(response.data.results);
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

  const handleUpdateColor = () => {
    getColors();
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
            Sửa
          </Button>

          <Modal
            open={openModals[name]}
            title="Cập nhật sản phẩm"
            onCancel={() => handleCancel(name)}
            footer={false}
          >
            <FormInputColor name={name} onUpdated={handleUpdateColor} />
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

  const handleDelete = async (name) => {
    try {
      // Check permission
      if ((await getPermission()) === "user") {
        openInfoModalNotPermission();
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/List/delete/${table}/${name}`,
        null,
        { withCredentials: true }
      );
      getColors();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-content">
      <div className="page-group">
        <div className="page1-control">
          <h3 style={{ fontWeight: "bold" }}>Màu sắc</h3>
          <Table columns={columns} dataSource={color} />
        </div>
        <div className="page2-control">
          <form
            className="form"
            id="form-create-color"
            onSubmit={formik.handleSubmit}
          >
            <h3 style={{ fontWeight: "bold" }}>Thêm màu</h3>
            <div className="form-group">
              {/* <label className="form-label">color</label> */}
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

export default Color;
