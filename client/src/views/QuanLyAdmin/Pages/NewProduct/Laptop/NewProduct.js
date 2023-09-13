import React, { useState, Component } from "react";
import "./style.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function NewProduct() {
  return (
    <div className="container-content">
      <form className="form" action="" method="">
        <div className="page1-control">
          <h3>Thông tin sản phẩm</h3>
          <div className="form-group">
            <label className="form-label">Thương hiệu</label>
            <select name="brand" className="form-control">
              <option value="">-- Chọn thương hiệu --</option>
              <option value="acer">Acer</option>
              <option value="macbook">Macbook</option>
              <option value="asus">Asus</option>
            </select>
            <span className="form-message"></span>
          </div>
          <div className="form-group">
            <label className="form-label">Giá</label>
            <input
              name="price"
              type="number"
              min={0}
              defaultValue={0}
              className="form-control"
            ></input>
            <span className="form-message"></span>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <input name="shortDescription" className="form-control"></input>
            <span className="form-message"></span>
          </div>
          <div className="form-group">
            <label className="form-label">Loại</label>
            <input
              name="category"
              value="laptop"
              className="form-control"
              readonly
            ></input>
            <span className="form-message"></span>
          </div>

          <div className="form-group">
            <label className="form-label">Số lượng</label>
            <input
              name="quantity"
              type="number"
              min={1}
              defaultValue={1}
              className="form-control"
            ></input>
            <span className="form-message"></span>
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <input name="status" type="checkbox"></input>
            <span className="form-message"></span>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả chi tiết</label>
            <CKEditor
              editor={ClassicEditor}
              data="Nhập mô tả chi tiết sản phẩm"
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
            <span className="form-message"></span>
          </div>
        </div>
        {/* Cấu hình chi tiết */}
        <div className="page2-control">
          <h3>Cấu hình chi tiết</h3>
          {/* CPU */}
          <div className="form-group">
            <label className="form-label">CPU</label>
            <input type="text" name="cpu" className="form-control"></input>
            <span className="form-message"></span>
          </div>
          {/* screen */}
          <div className="form-group">
            <label className="form-label">Màn hình</label>
            <input type="text" name="screen" className="form-control"></input>
            <span className="form-message"></span>
          </div>
          {/* ram */}
          <div className="form-group">
            <label className="form-label">RAM</label>
            <input type="text" name="ram" className="form-control"></input>
            <span className="form-message"></span>
          </div>
          {/* vga */}
          <div className="form-group">
            <label className="form-label">Đồ họa</label>
            <input type="text" name="vga" className="form-control"></input>
            <span className="form-message"></span>
          </div>
          {/* rom */}
          <div className="form-group">
            <label className="form-label">Lưu trữ</label>
            <input type="text" name="rom" className="form-control"></input>
            <span className="form-message"></span>
          </div>
          {/* cổng lưu trữ tối đa */}
          <div className="form-group">
            <label className="form-label">Số cổng lưu trữ tối đa</label>
            <input
              type="text"
              name="maximum_number_of_storage_ports"
              className="form-control"
            ></input>
            <span className="form-message"></span>
          </div>
          {/* Kiểu khe M.2 hỗ trợ */}
          <div className="form-group">
            <label className="form-label">Kiểu khe M.2 hỗ trợ</label>
            <input
              type="text"
              name="M.2_slot_type_supported"
              className="form-control"
            ></input>
            <span className="form-message"></span>
          </div>
          {/* Cổng xuất hình */}
          <div className="form-group">
            <label className="form-label">Cổng xuất hình</label>
            <input
              type="text"
              name="output_port"
              className="form-control"
            ></input>
            <span className="form-message"></span>
          </div>
          {/* Cổng kết nối */}
          <div className="form-group">
            <label className="form-label">Cổng kết nối</label>
            <input
              type="text"
              name="connector"
              className="form-control"
            ></input>
            <span className="form-message"></span>
          </div>
          {/* Kết nối không dây */}
          <div className="form-group">
            <label className="form-label">Kết nối không dây</label>
            <input
              type="text"
              name="wireless_connectivity"
              className="form-control"
            ></input>
            <span className="form-message"></span>
          </div>
          {/* Bàn phím */}
          <div className="form-group">
            <label className="form-label">Bàn phím</label>
            <input type="text" name="keyboard" className="form-control"></input>
            <span className="form-message"></span>
          </div>
          {/* OS */}
          <div className="form-group">
            <label className="form-label">Hệ điều hành</label>
            <input type="text" name="os" className="form-control"></input>
            <span className="form-message"></span>
          </div>
          {/* pin */}
          <div className="form-group">
            <label className="form-label">Pin</label>
            <input
              type="text"
              name="configuration"
              className="form-control"
            ></input>
            <span className="form-message"></span>
          </div>
          {/* Khối lượng */}
          <div className="form-group">
            <label className="form-label">Khối lượng</label>
            <input type="text" name="os" className="form-control"></input>
            <span className="form-message"></span>
          </div>
        </div>
      </form>
    </div>
  );
}
export default NewProduct;
