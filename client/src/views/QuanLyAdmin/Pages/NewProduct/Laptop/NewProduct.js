import React, { useState, Component } from "react";
import "./style.css";
import { useFormik } from "formik";
import * as Yub from "yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function NewProduct() {
  const formik = useFormik({
    initialValues: {
      brand: "",
      guarantee: "",
      price: 0,
      shortDescription: "",
      series_laptop: "",
      part_number: "",
      color: "",
      demand: "",
      category: "laptop",
      quantity: 1,
      status: false,
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
      description: "",
    },
    validationSchema: Yub.object({
      brand: Yub.string().required("Vui lòng chọn thương hiệu của sản phẩm."),
      guarantee: Yub.string().required("Vui lòng nhập trường này."),
      price: Yub.number().required("Vui lòng nhập giá sản phẩm"),
      shortDescription: Yub.string().required("Vui lòng nhập trường này."),
      series_laptop: Yub.string().required("Vui lòng nhập trường này."),
      part_number: Yub.string().required("Vui lòng nhập trường này."),
      color: Yub.string().required("Vui lòng nhập trường này."),
      demand: Yub.string().required("Vui lòng nhập trường này."),
      category: Yub.string().required("Vui lòng nhập trường này."),
      quantity: Yub.string().required("Vui lòng nhập trường này."),
      cpu: Yub.string().required("Vui lòng nhập trường này."),
      screen: Yub.string().required("Vui lòng nhập trường này."),
      ram: Yub.string().required("Vui lòng nhập trường này."),
      vga: Yub.string().required("Vui lòng nhập trường này."),
      rom: Yub.string().required("Vui lòng nhập trường này."),
      maximum_number_of_storage_ports: Yub.string().required(
        "Vui lòng nhập trường này."
      ),
      M2_slot_type_supported: Yub.string().required(
        "Vui lòng nhập trường này."
      ),
      output_port: Yub.string().required("Vui lòng nhập trường này."),
      connector: Yub.string().required("Vui lòng nhập trường này."),
      wireless_connectivity: Yub.string().required("Vui lòng nhập trường này."),
      keyboard: Yub.string().required("Vui lòng nhập trường này."),
      os: Yub.string().required("Vui lòng nhập trường này."),
      pin: Yub.string().required("Vui lòng nhập trường này."),
      mass: Yub.string().required("Vui lòng nhập trường này."),
      description: Yub.string().required("Vui lòng nhập trường này."),
    }),
    onSubmit: (values) => {
      // console.log(values);
    },
  });
  console.log(formik.errors);
  return (
    <div className="container-content">
      <form className="form" id="form-create-laptop" action="#" method="">
        <div className="page-group">
          <div className="page1-control">
            <h3>Thông tin sản phẩm</h3>
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
                <option value="acer">Acer</option>
                <option value="macbook">Macbook</option>
                <option value="asus">Asus</option>
              </select>
              <span className="form-message"></span>
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
              <span className="form-message"></span>
            </div>
            {/* price */}
            <div className="form-group">
              <label className="form-label">Giá</label>
              <input
                name="price"
                id="price"
                type="number"
                min={0}
                defaultValue={0}
                className="form-control"
                value={formik.values.price}
                onChange={formik.handleChange}
              ></input>
              <span className="form-message"></span>
            </div>
            {/* short description */}
            <div className="form-group">
              <label className="form-label">Mô tả ngắn</label>
              <textarea
                name="shortDescription"
                id="shortDescription"
                className="form-control"
                value={formik.values.shortDescription}
                onChange={formik.handleChange}
              ></textarea>
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
            </div>
            {/* Màu sắc */}
            <div className="form-group">
              <label className="form-label">Màu sắc</label>
              <input
                type="text"
                name="color"
                id="color"
                className="form-control"
                value={formik.values.color}
                onChange={formik.handleChange}
              ></input>
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
                readonly
              ></input>
              <span className="form-message"></span>
            </div>
            {/* quantity */}
            <div className="form-group">
              <label className="form-label">Số lượng</label>
              <input
                name="quantity"
                id="quantity"
                type="number"
                min={1}
                defaultValue={1}
                className="form-control"
                value={formik.values.quantity}
                onChange={formik.handleChange}
              ></input>
              <span className="form-message"></span>
            </div>
            {/* status */}
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <input
                name="status"
                id="status"
                type="checkbox"
                value={formik.values.status}
                onChange={formik.handleChange}
              ></input>
              <span className="form-message"></span>
            </div>
          </div>
          {/* Cấu hình chi tiết */}
          <div className="page2-control">
            <h3>Cấu hình chi tiết</h3>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
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
              <span className="form-message"></span>
            </div>
          </div>
        </div>
        {/* description */}
        <div className="form-group">
          <label className="form-label">Mô tả chi tiết</label>
          <CKEditor
            editor={ClassicEditor}
            name="description"
            id="description"
            data="Nhập mô tả chi tiết sản phẩm"
            
          />
          <span className="form-message"></span>
        </div>
        <button type="submit" className="btn-submit-form">
          Xác nhận
        </button>
      </form>
    </div>
  );
}
export default NewProduct;
