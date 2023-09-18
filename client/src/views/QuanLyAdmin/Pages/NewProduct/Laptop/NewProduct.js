import React, { useEffect, useState } from "react";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageInput from "../ImageComponent/ImageInput";

function NewProduct() {
  const formik = useFormik({
    initialValues: {
      brand: "",
      guarantee: "",
      name:"",
      price: 0,
      shortDescription: "",
      series_laptop: "",
      part_number: "",
      color: "",
      demand: "",
      category: "laptop",
      quantity: 1,
      images: [],
      status: false,
      description: "",
      cpu: "",
      screen: "",
      ram: "",
      vga: "",
      rom: "",
      maximum_number_of_storage_ports: "",
      M2_slot_type_supported: "",
      output_port: "",
      connector: "",
      wireless_connectivity: "",
      keyboard: "",
      os: "",
      pin: "",
      mass: "",
    },
    validationSchema: Yup.object().shape({
      brand: Yup.string().required("Vui lòng chọn thương hiệu của sản phẩm."),
      // guarantee: Yup.string().required("Vui lòng nhập trường này."),
      price: Yup.number().required("Vui lòng nhập giá sản phẩm"),
      shortDescription: Yup.string().required("Vui lòng nhập trường này."),
      // series_laptop: Yup.string().required("Vui lòng nhập trường này."),
      // part_number: Yup.string().required("Vui lòng nhập trường này."),
      // color: Yup.string().required("Vui lòng nhập trường này."),
      // demand: Yup.string().required("Vui lòng nhập trường này."),
      // category: Yup.string().required("Vui lòng nhập trường này."),
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
      // cpu: Yup.string().required("Vui lòng nhập trường này."),
      // screen: Yup.string().required("Vui lòng nhập trường này."),
      // ram: Yup.string().required("Vui lòng nhập trường này."),
      // vga: Yup.string().required("Vui lòng nhập trường này."),
      // rom: Yup.string().required("Vui lòng nhập trường này."),
      // maximum_number_of_storage_ports: Yup.string().required(
      //   "Vui lòng nhập trường này."
      // ),
      // M2_slot_type_supported: Yup.string().required(
      //   "Vui lòng nhập trường này."
      // ),
      // output_port: Yup.string().required("Vui lòng nhập trường này."),
      // connector: Yup.string().required("Vui lòng nhập trường này."),
      // wireless_connectivity: Yup.string().required("Vui lòng nhập trường này."),
      // keyboard: Yup.string().required("Vui lòng nhập trường này."),
      // os: Yup.string().required("Vui lòng nhập trường này."),
      // pin: Yup.string().required("Vui lòng nhập trường này."),
      // mass: Yup.string().required("Vui lòng nhập trường này."),
      // description: Yup.string().required("Vui lòng nhập trường này."),
    }),
    onSubmit: async (values) => {
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
          } else if (fieldName === "color") {
            const strColor = fieldValue.toString();
            const arrColor = strColor.split(",");
            arrColor.forEach((value) => {
              formData.append(fieldName, value.trim());
            });
          } else {
            formData.append(fieldName, fieldValue);
          }
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
            alert('Tạo sản phẩm thành công!')
          }else{
            alert("Tạo sản phẩm thất bại!")
          }
        })
        .catch((e) => {
          console.log(e);
          alert("Tạo sản phẩm thất bại.");
        });
    },
  });

  const [brands, setBrands] = useState([]);

  // function call api get brands
  const getBrands = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/brands`)
      .then((response) => {
        setBrands(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // get brands data
    getBrands();
  },[]);

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
            {/* price */}
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
            {/* Series laptop */}
            <div className="form-group">
              <label className="form-label">Series laptop</label>
              <input
                type="text"
                name="series_laptop"
                id="series_laptop"
                className="form-control"
                value={formik.values.series_laptop}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.series_laptop && (
                <span className="form-message">
                  {formik.errors.series_laptop}
                </span>
              )}
            </div>
            {/* Part-number */}
            <div className="form-group">
              <label className="form-label">Part-number</label>
              <input
                type="text"
                name="part_number"
                id="part_number"
                className="form-control"
                value={formik.values.part_number}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.part_number && (
                <span className="form-message">
                  {formik.errors.part_number}
                </span>
              )}
            </div>
            {/* Màu sắc */}
            <div className="form-group">
              <label className="form-label">
                Màu sắc (Mỗi màu cách nhau bởi dấu phẩy)
              </label>
              <input
                type="text"
                name="color"
                id="color"
                className="form-control"
                value={formik.values.color}
                onChange={formik.handleChange}
                placeholder="VD: Trắng,Đen,..."
              ></input>
              {formik.errors.color && (
                <span className="form-message">{formik.errors.color}</span>
              )}
            </div>
            {/* Nhu cầu */}
            <div className="form-group">
              <label className="form-label">Nhu cầu</label>
              <input
                type="text"
                name="demand"
                id="demand"
                className="form-control"
                value={formik.values.demand}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.demand && (
                <span className="form-message">{formik.errors.demand}</span>
              )}
            </div>
            {/* type */}
            <div className="form-group">
              <label className="form-label">Loại</label>
              <input
                name="category"
                id="category"
                value="laptop"
                className="form-control"
                onChange={formik.handleChange}
                readOnly
              ></input>
              {formik.errors.category && (
                <span className="form-message">{formik.errors.category}</span>
              )}
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
              <ImageInput formik={formik}/>
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
            {/* CPU */}
            <div className="form-group">
              <label className="form-label">CPU</label>
              <input
                type="text"
                name="cpu"
                id="cpu"
                className="form-control"
                value={formik.values.cpu}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.cpu && (
                <span className="form-message">{formik.errors.cpu}</span>
              )}
            </div>
            {/* screen */}
            <div className="form-group">
              <label className="form-label">Màn hình</label>
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
            {/* vga */}
            <div className="form-group">
              <label className="form-label">Đồ họa</label>
              <input
                type="text"
                name="vga"
                id="vga"
                className="form-control"
                value={formik.values.vga}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.vga && (
                <span className="form-message">{formik.errors.vga}</span>
              )}
            </div>
            {/* rom */}
            <div className="form-group">
              <label className="form-label">Lưu trữ</label>
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
            {/* cổng lưu trữ tối đa */}
            <div className="form-group">
              <label className="form-label">Số cổng lưu trữ tối đa</label>
              <input
                type="text"
                name="maximum_number_of_storage_ports"
                id="maximum_number_of_storage_ports"
                className="form-control"
                value={formik.values.maximum_number_of_storage_ports}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.maximum_number_of_storage_ports && (
                <span className="form-message">
                  {formik.errors.maximum_number_of_storage_ports}
                </span>
              )}
            </div>
            {/* Kiểu khe M.2 hỗ trợ */}
            <div className="form-group">
              <label className="form-label">Kiểu khe M.2 hỗ trợ</label>
              <input
                type="text"
                name="M2_slot_type_supported"
                id="M2_slot_type_supported"
                className="form-control"
                value={formik.values.M2_slot_type_supported}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.M2_slot_type_supported && (
                <span className="form-message">
                  {formik.errors.M2_slot_type_supported}
                </span>
              )}
            </div>
            {/* Cổng xuất hình */}
            <div className="form-group">
              <label className="form-label">Cổng xuất hình</label>
              <input
                type="text"
                name="output_port"
                id="output_port"
                className="form-control"
                value={formik.values.output_port}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.output_port && (
                <span className="form-message">
                  {formik.errors.output_port}
                </span>
              )}
            </div>
            {/* Cổng kết nối */}
            <div className="form-group">
              <label className="form-label">Cổng kết nối</label>
              <input
                type="text"
                name="connector"
                id="connector"
                className="form-control"
                value={formik.values.connector}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.connector && (
                <span className="form-message">{formik.errors.connector}</span>
              )}
            </div>
            {/* Kết nối không dây */}
            <div className="form-group">
              <label className="form-label">Kết nối không dây</label>
              <input
                type="text"
                name="wireless_connectivity"
                id="wireless_connectivity"
                className="form-control"
                value={formik.values.wireless_connectivity}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.wireless_connectivity && (
                <span className="form-message">
                  {formik.errors.wireless_connectivity}
                </span>
              )}
            </div>
            {/* Bàn phím */}
            <div className="form-group">
              <label className="form-label">Bàn phím</label>
              <input
                type="text"
                name="keyboard"
                id="keyboard"
                className="form-control"
                value={formik.values.keyboard}
                onChange={formik.handleChange}
              ></input>
              {formik.errors.keyboard && (
                <span className="form-message">{formik.errors.keyboard}</span>
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
      </form>
    </div>
  );
}
export default NewProduct;
