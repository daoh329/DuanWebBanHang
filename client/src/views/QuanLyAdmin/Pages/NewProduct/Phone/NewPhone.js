import React, { useEffect, useState } from "react";
import "./stylePhone.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageInput from "../ImageComponent/ImageInput";
import {
  Button,
  Form,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  message,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { formatCapacity } from "../../../../../util/formatCapacity";

const { Option } = Select;

function NewPhone() {
  // Tạo các biến trạng thái cục bộ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorSubmit, setColorSubmit] = useState([]);
  const [capacity, setCapacity] = useState([]);
  const [capacitySubmit, setCapacitySubmit] = useState([{ rom: "", price: 0 }]);

  // Tạo các trường, giá trị mặc định, validate và submit form (use formik)
  const formik = useFormik({
    initialValues: {
      brand: "",
      guarantee: "",
      name: "",
      price: 0,
      main_image: {},
      shortDescription: "",
      series: "",
      category: "Điện thoại",
      quantity: 1,
      images: [],
      status: false,
      description: "",
      //
      screen: "",
      resolution: "",
      rom: "",
      os: "",
      ram: "",
      chip: "",
      pin: "",
      charging_port: "",
      sim_type: "",
      mobile_network: "",
      rear_camera: "",
      front_camera: "",
      wifi: "",
      gps: "",
      bluetooth: "",
      headphone_jack: "",
      size: "",
      mass: "",
      accessory: "",
    },
    validationSchema: Yup.object().shape({
      brand: Yup.string().required("Vui lòng chọn thương hiệu của sản phẩm."),
      name: Yup.string().required("Vui lòng nhập trường này."),
      price: Yup.number().required("Vui lòng nhập giá sản phẩm"),
      shortDescription: Yup.string().required("Vui lòng nhập trường này."),
      quantity: Yup.string().required("Vui lòng nhập trường này."),
      images: Yup.array().of(
        Yup.mixed()
          .test(
            "FILE_TYPE",
            "Hình ảnh không đúng định dạng",
            (value) =>
              value &&
              ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
          )
          .test(
            "FILE_SIZE",
            "Tệp hình ảnh quá lớn!",
            (value) => value && value.size < 5 * 1024 * 1024
          )
      ),
    }),
    onSubmit: async (values) => {
      // Lấy dữ liệu ảnh chính
      values.main_image = mainImage[0]?.originFileObj;

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

      // sử lí mảng capacity
      if (capacitySubmit[0].rom && capacitySubmit[0].price > 0) {
        formData.append("capacity", JSON.stringify(capacitySubmit));
      } else {
        message.warning("Vui lòng điền đầy đủ thông tin dung lượng sản phẩm");
        return;
      }

      // Mở modal
      setIsModalOpen(true);
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
          console.log(e);
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
        });
    },
  });

  // function get brands (get from csdl)
  const getBrands = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/brands`)
      .then((response) => {
        setBrands(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // function get colors (get from csdl)
  const getColors = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/colors`)
      .then((response) => {
        setColors(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Lấy dữ liệu brands và colors khi chạy lần đầu
  useEffect(() => {
    getBrands();
    getColors();
    getCapacity();
  }, []);

  // function call api get capacity list
  const getCapacity = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/capacity`)
      .then((response) => {
        setCapacity(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Hàm được gọi khi giá trị màu sắc thay đổi
  const handleChange = (value) => {
    // set giá trị vào state colorSubmit
    setColorSubmit(value);
  };

  // select Capacity
  const handleInputChange = (index, key, value) => {
    const updatedRomInfo = [...capacitySubmit];
    updatedRomInfo[index][key] = value;
    setCapacitySubmit(updatedRomInfo);
  };

  const handleAddRom = () => {
    setCapacitySubmit([...capacitySubmit, { rom: "", price: 0 }]);
  };

  const handleRemoveRom = (index) => {
    const updatedRomInfo = [...capacitySubmit];
    updatedRomInfo.splice(index, 1);
    setCapacitySubmit(updatedRomInfo);
  };

  // function open modal
  const [isOpenModalCapcity, setIsOpenModalCapcity] = useState(false);

  const handleCancel = () => {
    setIsOpenModalCapcity(false);
  };

  const openModalAddCapacity = () => {
    setIsOpenModalCapcity(true);
  };

  // function logic modal
  // modal capacity
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/List/add/capacity`,
        values
      );

      if (result.status === 200) {
        setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
        }, 2000);
        getCapacity();
        setIsOpenModalCapcity(false);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          notification.error({
            message: "Cập nhật thất bại!",
          });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Cập nhật thất bại!",
        });
      }, 2000);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
    // message.error("Thêm thất bại");
  };

  return (
    <div className="container-content">
      <Modal
        title="Thêm lựa chọn cho dung lượng"
        open={isOpenModalCapcity}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name={"capacity"}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập dữ liệu rồi tiếp tục!",
              },
            ]}
          >
            <InputNumber
              placeholder="Nhập dung lượng"
              type="number"
              min={0}
              style={{ borderRadius: "3px", width: "100%" }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 19, span: 4 }}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
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
                {brands &&
                  brands.map((brand) => (
                    <option key={brand.name} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
              </select>
              {formik.errors.brand && (
                <span className="form-message">{formik.errors.brand}</span>
              )}
            </div>
            {/* guarantee Bảo hành */}
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
            {/* name */}
            <div className="form-group">
              <label className="form-label">Tên sản phẩm</label>
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
            {/* price giá*/}
            <div className="form-group">
              <label className="form-label">Giá</label>
              <input
                name="price"
                id="price"
                type="number"
                min={0}
                className="form-control"
                value={formik.values.price}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.price && (
                <span className="form-message">{formik.errors.price}</span>
              )}
            </div>
            {/* short description */}
            <div className="form-group">
              <label className="form-label">Mô tả ngắn</label>
              <textarea
                name="shortDescription"
                id="shortDescription"
                style={{ height: "80px" }}
                className="form-control"
                value={formik.values.shortDescription}
                onChange={formik.handleChange}
              ></textarea>
              {formik.errors.shortDescription && (
                <span className="form-message">
                  {formik.errors.shortDescription}
                </span>
              )}
            </div>
            {/* Series */}
            <div className="form-group">
              <label className="form-label">Series</label>
              <input
                type="text"
                name="series"
                id="series"
                className="form-control"
                value={formik.values.series}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.series && (
                <span className="form-message">{formik.errors.series}</span>
              )}
            </div>
            {/* Màu sắc */}
            <div className="form-group">
              <label className="form-label">Màu sắc</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Chọn màu sắc"
                  value={colorSubmit}
                  onChange={handleChange}
                  optionLabelProp="label"
                  size="large"
                >
                  {colors &&
                    colors.map((color, index) => (
                      <Option key={index} value={color.name} label={color.name}>
                        <Space>{color.name}</Space>
                      </Option>
                    ))}
                </Select>
              </div>
            </div>
            {/* category */}
            <div className="form-group">
              <label className="form-label">Loại</label>
              <input
                name="category"
                id="category"
                value={formik.values.category}
                className="form-control"
                onChange={formik.handleChange}
                readOnly
              ></input>
              {formik.errors.category && (
                <span className="form-message">{formik.errors.category}</span>
              )}
            </div>
            {/* capacity */}
            <div className="form-group">
              <label className="form-label">Dung lượng (ROM): </label>
              <table>
                <thead>
                  <tr>
                    <th>Dung lượng ROM</th>
                    <th>Giá</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {capacitySubmit.map((rom, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <select
                          className="form-control"
                          type="text"
                          value={rom.rom}
                          onChange={(e) =>
                            handleInputChange(index, "rom", e.target.value)
                          }
                        >
                          <option value="" defaultChecked>
                            -- Chọn dung lượng --
                          </option>
                          {[...capacity].map((capacity, index) => (
                            <option value={capacity.capacity}>
                              {formatCapacity(capacity.capacity)}
                            </option>
                          ))}
                        </select>
                        <Button
                          onClick={openModalAddCapacity}
                          icon={<PlusOutlined />}
                          style={{ margin: "0 0 0 5px" }}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="number"
                          min={0}
                          value={rom.price}
                          onChange={(e) =>
                            handleInputChange(index, "price", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="capacity-btn-delete-row"
                          onClick={() => handleRemoveRom(index)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className="capacity-btn-add-row"
                onClick={handleAddRom}
              >
                Thêm ROM
              </button>
            </div>
            {/* quantity */}
            <div className="form-group">
              <label className="form-label">Số lượng</label>
              <input
                name="quantity"
                id="quantity"
                type="number"
                min={1}
                className="form-control"
                value={formik.values.quantity}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.quantity && (
                <span className="form-message">{formik.errors.quantity}</span>
              )}
            </div>
            {/* image */}
            <ImageInput setMainImage={setMainImage} formik={formik} />
            {/* status */}
            <div
              style={{ flexDirection: "row", alignItems: "center" }}
              className="form-group"
            >
              <label className="form-label">Trạng thái: </label>
              <input
                style={{ width: "20px", marginLeft: "20px" }}
                name="status"
                id="status"
                type="checkbox"
                value={formik.values.status}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.status && (
                <span className="form-message">{formik.errors.status}</span>
              )}
            </div>
          </div>
          {/* Cấu hình chi tiết */}
          <div className="page2-control">
            <h3 style={{ fontWeight: "bold" }}>Cấu hình chi tiết</h3>
            {/* type screen */}
            <div className="form-group">
              <label className="form-label">Loại màn hình</label>
              <input
                type="text"
                name="screen"
                id="screen"
                className="form-control"
                value={formik.values.screen}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.screen && (
                <span className="form-message">{formik.errors.screen}</span>
              )}
            </div>
            {/* resolution */}
            <div className="form-group">
              <label className="form-label">Độ phân giải</label>
              <input
                type="text"
                name="resolution"
                id="resolution"
                className="form-control"
                value={formik.values.resolution}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.resolution && (
                <span className="form-message">{formik.errors.resolution}</span>
              )}
            </div>
            {/* rom */}
            <div className="form-group">
              <label className="form-label">Dung lượng lưu trữ</label>
              <input
                type="text"
                name="rom"
                id="rom"
                className="form-control"
                value={formik.values.rom}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.rom && (
                <span className="form-message">{formik.errors.rom}</span>
              )}
            </div>
            {/* OS */}
            <div className="form-group">
              <label className="form-label">Hệ điều hành</label>
              <input
                type="text"
                name="os"
                id="os"
                className="form-control"
                value={formik.values.os}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.os && (
                <span className="form-message">{formik.errors.os}</span>
              )}
            </div>
            {/* ram */}
            <div className="form-group">
              <label className="form-label">RAM</label>
              <input
                type="text"
                name="ram"
                id="ram"
                className="form-control"
                value={formik.values.ram}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.ram && (
                <span className="form-message">{formik.errors.ram}</span>
              )}
            </div>
            {/* chip */}
            <div className="form-group">
              <label className="form-label">Chip</label>
              <input
                type="text"
                name="chip"
                id="chip"
                className="form-control"
                value={formik.values.cpu}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.cpu && (
                <span className="form-message">{formik.errors.cpu}</span>
              )}
            </div>
            {/* pin */}
            <div className="form-group">
              <label className="form-label">Pin</label>
              <input
                type="text"
                name="pin"
                id="pin"
                className="form-control"
                value={formik.values.pin}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.pin && (
                <span className="form-message">{formik.errors.pin}</span>
              )}
            </div>
            {/* charging_port */}
            <div className="form-group">
              <label className="form-label">Cổng sạc</label>
              <input
                type="text"
                name="charging_port"
                id="charging_port"
                className="form-control"
                value={formik.values.charging_port}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.charging_port && (
                <span className="form-message">
                  {formik.errors.charging_port}
                </span>
              )}
            </div>
            {/* sim_type */}
            <div className="form-group">
              <label className="form-label">Loại sim</label>
              <input
                type="text"
                name="sim_type"
                id="sim_type"
                className="form-control"
                value={formik.values.sim_type}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.sim_type && (
                <span className="form-message">{formik.errors.sim_type}</span>
              )}
            </div>
            {/* mobile_network */}
            <div className="form-group">
              <label className="form-label">Mạng di động</label>
              <input
                type="text"
                name="mobile_network"
                id="mobile_network"
                className="form-control"
                value={formik.values.mobile_network}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.mobile_network && (
                <span className="form-message">
                  {formik.errors.mobile_network}
                </span>
              )}
            </div>
            {/* rear_camera */}
            <div className="form-group">
              <label className="form-label">Camera sau</label>
              <input
                type="text"
                name="rear_camera"
                id="rear_camera"
                className="form-control"
                value={formik.values.rear_camera}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.rear_camera && (
                <span className="form-message">
                  {formik.errors.rear_camera}
                </span>
              )}
            </div>
            {/* front_camera */}
            <div className="form-group">
              <label className="form-label">Camera trước</label>
              <input
                type="text"
                name="front_camera"
                id="front_camera"
                className="form-control"
                value={formik.values.front_camera}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.front_camera && (
                <span className="form-message">
                  {formik.errors.front_camera}
                </span>
              )}
            </div>
            {/* wifi */}
            <div className="form-group">
              <label className="form-label">Wifi</label>
              <input
                type="text"
                name="wifi"
                id="wifi"
                className="form-control"
                value={formik.values.wifi}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.wifi && (
                <span className="form-message">{formik.errors.wifi}</span>
              )}
            </div>
            {/* gps */}
            <div className="form-group">
              <label className="form-label">GPS</label>
              <input
                type="text"
                name="gps"
                id="gps"
                className="form-control"
                value={formik.values.gps}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.gps && (
                <span className="form-message">{formik.errors.gps}</span>
              )}
            </div>
            {/* bluetooth */}
            <div className="form-group">
              <label className="form-label">Bluetooth</label>
              <input
                type="text"
                name="bluetooth"
                id="bluetooth"
                className="form-control"
                value={formik.values.bluetooth}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.bluetooth && (
                <span className="form-message">{formik.errors.bluetooth}</span>
              )}
            </div>
            {/* headphone_jack */}
            <div className="form-group">
              <label className="form-label">Jack tai nghe</label>
              <input
                type="text"
                name="headphone_jack"
                id="headphone_jack"
                className="form-control"
                value={formik.values.headphone_jack}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.headphone_jack && (
                <span className="form-message">
                  {formik.errors.headphone_jack}
                </span>
              )}
            </div>
            {/* size */}
            <div className="form-group">
              <label className="form-label">Kích thước</label>
              <input
                type="text"
                name="size"
                id="size"
                className="form-control"
                value={formik.values.size}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.size && (
                <span className="form-message">{formik.errors.size}</span>
              )}
            </div>
            {/* Khối lượng */}
            <div className="form-group">
              <label className="form-label">Khối lượng</label>
              <input
                type="text"
                name="mass"
                id="mass"
                className="form-control"
                value={formik.values.mass}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.mass && (
                <span className="form-message">{formik.errors.mass}</span>
              )}
            </div>
            {/* accessory: Phụ kiện đi kèm */}
            <div className="form-group">
              <label className="form-label">Phụ kiện đi kèm</label>
              <input
                type="text"
                name="accessory"
                id="accessory"
                className="form-control"
                value={formik.values.accessory}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.accessory && (
                <span className="form-message">{formik.errors.accessory}</span>
              )}
            </div>
          </div>
        </div>
        {/* description */}
        <div className="form-group">
          <label className="form-label">Mô tả chi tiết</label>
          <CKEditor
            editor={ClassicEditor}
            data={formik.values?.description}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              // console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              formik.setFieldValue("description", data);
              // console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
              console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              console.log("Focus.", editor);
            }}
          />
          {/* {formik.errors.description && <span className="form-message" >{formik.errors.description}</span>} */}
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

export default NewPhone;
