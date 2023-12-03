import React, { useEffect, useState } from "react";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageInput from "../ImageComponent/ImageInput";
import { Modal, notification, Select, Space, Spin } from "antd";

const { Option } = Select;

function NewProduct() {
  // Tạo modal show tiến trình thêm sản phẩm (Call API)
  // Tạo biến trạng thái của modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colorSubmit, setColorSubmit] = useState([]);

  const formik = useFormik({
    initialValues: {
      name:"",
      percent_discount:""
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Vui lòng nhập trường này."),
      percent_discount: Yup.string().required("Vui lòng nhập trường này.")
    }),
    onSubmit: async (values) => {
      setIsModalOpen(true);
      const url = `${process.env.REACT_APP_API_URL}/product/Add`;
      const formData = new FormData();
      // Lặp qua các trường dữ liệu và thêm chúng vào formData
      for (const fieldName in values) {
        if (Object.prototype.hasOwnProperty.call(values, fieldName)) {
          const fieldValue = values[fieldName];
          // Kiểm tra nếu trường là một mảng ảnh
          if (Array.isArray(fieldValue) && fieldName === "images") {
            fieldValue.forEach((image) => {
              formData.append(fieldName, image);
            });
          } else {
            formData.append(fieldName, fieldValue);
          }
        }
      }

      // sử lí mảng color
      if (colorSubmit.length !== 0) {
        colorSubmit.forEach((color) => {
          formData.append("color", color);
        });
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


  useEffect(() => {
  }, []);


  return (
    <div className="container-content">
      <form
        className="form"
        id="form-create-laptop"
        onSubmit={formik.handleSubmit}
      >
        <div className="page-group">
          <div className="page1-control">
            <h3 style={{ fontWeight: "bold" }}>Thông tin sản phẩm</h3>
            {/* brand */}
            <div className="form-group">
              <label className="form-label">Thương hiệu</label>
              <select
                id="brand"
                name="brand"
                className="form-control"
                value={formik.values.brand}
                onChange={formik.handleChange}
              >
                <option value="">-- Chọn thương hiệu --</option>
                {/* {brands &&
                  brands.map((brand) => (
                    <option key={brand.name} value={brand.name}>
                      {brand.name}
                    </option>
                  ))} */}
              </select>
              {formik.errors.brand && (
                <span className="form-message">{formik.errors.brand}</span>
              )}
            </div>
            {/* Bảo hành */}
            <div className="form-group">
              <label className="form-label">Thời gian bảo hành</label>
              <input
                type="text"
                name="guarantee"
                id="guarantee"
                className="form-control"
                value={formik.values.guarantee}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.guarantee && (
                <span className="form-message">{formik.errors.guarantee}</span>
              )}
            </div>
          </div>
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
  );
}
export default NewProduct;
