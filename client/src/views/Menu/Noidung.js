import { Header } from "antd/es/layout/layout";
import React, { useState, useEffect } from "react";
import { Breadcrumb } from "antd";
import "./Noidung.css";

function Noidung() {
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <a href="/">Danh mục</a>,
          },

        ]}
      />
      {/* Nội dung khác của trang */}

      <body>
        <div className="div_main">
          <div>Điện thoại</div>
          <div>Iphone</div>

          <div>Laptop</div>

          <div>Phụ kiện</div>

          <div>Khuyến mãi</div>
          <div>Showroom</div>
          <div>Tư vấn doanh nghiệp</div>
          <div>Liên hệ</div>
          <div>Tin tức</div>
        </div>
      </body>
    </>
  );
}

export default Noidung;
