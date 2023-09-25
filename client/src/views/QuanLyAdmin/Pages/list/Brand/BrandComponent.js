import React, { useEffect, useState } from "react";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Modal, notification, Spin, Table } from "antd";

function Brand() {
  // Tạo modal show tiến trình thêm sản phẩm (Call API)
  // Tạo biến trạng thái của modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      brand:"",
    },
    validationSchema: Yup.object().shape({
      brand: Yup.string().required("Vui lòng nhập tên brand"),
    }),
    onSubmit: async (values) => {
      setIsModalOpen(true);
      const url = `${process.env.REACT_APP_API_URL}/brand/add`;
      const formData = new FormData();
      // Lặp qua các trường dữ liệu và thêm chúng vào formData
      for (const fieldName in values) {
        if (Object.prototype.hasOwnProperty.call(values, fieldName)) {
          const fieldValue = values[fieldName];
          formData.append(fieldName, fieldValue);
        }
      }
      // call API
      await axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            const timer = setTimeout(() => {
              setIsModalOpen(false);
              // Hiển thị thông báo thành công
              notification.success({
                message: "Thành công",
                description: "Dữ liệu đã được lưu thành công!",
              });
            }, 1000); // Đợi 1s mới tắt modal và hiển thị thông báo
            // Xóa timer khi component bị hủy
            return () => clearTimeout(timer);
          } else {
            const timer = setTimeout(() => {
              setIsModalOpen(false);
              // Hiển thị thông báo lỗi
              notification.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi lưu dữ liệu!",
              });
            }, 1000); // Đợi 1s mới tắt modal và hiển thị thông báo
            // Xóa timer khi component bị hủy
            return () => clearTimeout(timer);
          }
        })
        .catch((e) => {
          const timer = setTimeout(() => {
            console.log(e);
            setIsModalOpen(false);
            // Hiển thị thông báo lỗi
            notification.error({
              message: "Lỗi",
              description: "Có lỗi xảy ra khi lưu dữ liệu!",
            });
          }, 1000); // Đợi 1s mới tắt modal và hiển thị thông báo
          // Xóa timer khi component bị hủy
          return () => clearTimeout(timer);
        });
    },
  });

  // Tạo mảng chứa brand lấy từ database
  const [brand, setbrand] = useState([]);

  // function call api get brand
  const getbrand = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/brand`)
      .then((response) => {
        setbrand(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // get brand data
    getbrand();
  }, []);

  const columns = [
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render:
        <span>
          {/* {record.status === 'discontinued' ? (
                    <Button className="cancel-button" style={{ backgroundbrand: 'red', brand: 'white' }} onClick={() => handleCancelOrder(record)}>
                        discontinued
                    </Button>
                ): record.status === '' (
                    <Button className="confirm-button" style={{ backgroundbrand: 'green', brand: 'white' }} onClick={() => handleConfirmOrder(record)}>
                        Xác nhận
                    </Button>
                )} */}
        </span>

    },
  ];

  return (
    <div className="container-content">

      <div className="page-group">
        {/* list */}
        <div className="page1-control">
          <h3 style={{ fontWeight: "bold" }}>brand</h3>
          <Table columns={columns} dataSource={brand} />
        </div>
        {/* form */}
        <form
          className="form"
          id="form-create-brand"
          onSubmit={formik.handleSubmit}
        >
          <div className="page2-control">
            <h3 style={{ fontWeight: "bold" }}>Thêm màu</h3>
            {/* brand */}
            <div className="form-group">
              <label className="form-label">brand</label>
              <input
                type="text"
                name="brand"
                id="brand"
                className="form-control"
                value={formik.values.brand}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.brand && (
                <span className="form-message">{formik.errors.brand}</span>
              )}
            </div>
          </div>
          <Modal
            open={isModalOpen}
            footer={null}
            closeIcon={null}
          >
            <Spin tip="Đang tải lên..." spinning={true}>
              <div style={{ minHeight: "50px" }} className="content" />
            </Spin>
          </Modal>
        </form>
      </div>
    </div>
  );
}
export default Brand;
