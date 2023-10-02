import React, { useEffect, useState } from "react";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Modal, notification, Spin, Table, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
function Category() {
  // Tạo modal show tiến trình thêm sản phẩm (Call API)
  // Tạo biến trạng thái của modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Vui lòng nhập tên category"),
    }),
    onSubmit: async (values) => {
      setIsModalOpen(true);
      const url = `${process.env.REACT_APP_API_URL}/category/add`;
      // call API
      await axios
        .post(url, values)
        .then((res) => {
          if (res.status === 200) {
            const timer = setTimeout(() => {
              setIsModalOpen(false);
              getcategory()
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

  // Tạo mảng chứa category lấy từ database
  const [category, setcategory] = useState([]);

  // function call api get category
  const getcategory = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/category`)
      .then((response) => {
        setcategory(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // get category data
    getcategory();
  }, []);

  const columns = [
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => {
        async function handleDelete() {
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/category/delete/${id}`
            );
            getcategory()
          } catch (error) {
            console.log(error);
          }
        }

        async function handleUpdate() {
          // setIsLoading(true);
          setIsModalOpen(true);

          // setTimeout(() => {
          //   setIsLoading(false);
          // }, 1500);
        }

        const handleCancel = () => {
          setIsModalOpen(false);
        };

        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button className="confirm-button"onClick={handleUpdate}><EditOutlined /> Edit </Button>
            <Popconfirm
              title="Cảnh báo!!!"
              description="Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>
                <DeleteOutlined /> Delete
              </Button>
            </Popconfirm>


            <Modal
              open={isModalOpen}
              title="Cập nhật sản phẩm"
              onCancel={handleCancel}
              footer={false}
            >
            </Modal>
          </div>
        )
      }
    },
  ];

  return (
    <div className="container-content">

      <div className="page-group">
        {/* list */}
        <div className="page1-control">
          <h3 style={{ fontWeight: "bold" }}>Category</h3>
          <Table columns={columns} dataSource={category} />
        </div>
        <div className="page2-control">
          {/* form */}
          <form
            className="form"
            id="form-create-category"
            onSubmit={formik.handleSubmit}
          >

            <h3 style={{ fontWeight: "bold" }}>Thêm danh mục</h3>
            {/* category */}
            <div className="form-group">
              <label className="form-label">category</label>
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
            </div><button type="submit" className="btn-submit-form">
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
export default Category;
