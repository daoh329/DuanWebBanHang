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
      name: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Vui lòng nhập tên brand"),
    }),
    onSubmit: async (values) => {
      setIsModalOpen(true);
      const url = `${process.env.REACT_APP_API_URL}/brand/add`;
      // call API
      await axios
        .post(url, values)
        .then((res) => {
          if (res.status === 200) {
            getbrand()
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
      render: () => (
        <span>

          {/* <Button className="cancel-button" style={{ backgroundbrand: 'red', brand: 'white' }}>
            discontinued
          </Button>

          <Button className="confirm-button" style={{ backgroundbrand: 'green', brand: 'white' }}>
            Xác nhận
          </Button> */}

        </span>
      )


    },
  ];

  return (
    <div className="container-content">

      <div className="page-group">
        {/* list */}
        <div className="page1-control">
          <h3 style={{ fontWeight: "bold" }}>Brand</h3>
          <Table columns={columns} dataSource={brand} />
        </div>
        {/* form */}
        <div className="page2-control">
          <form
            className="form"
            id="form-create-brand"
            onSubmit={formik.handleSubmit}
          >

            <h3 style={{ fontWeight: "bold" }}>Thêm Brand</h3>
            {/* brand */}
            <div className="form-group">
              <label className="form-label">brand</label>
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
    </div>
  );
}
export default Brand;
