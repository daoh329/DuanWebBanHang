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

      <body className="body-noi-dung">
        <span className="css-1oc0336"></span>
        <div className="div_main">
          <div className="div_main2">
{/* div */}
<div style={{flexShrink:"0"}}>
   <a className="css-cbrxda" href="/">
  <div className="css-1g2qfl">
    <div className="css-1knqu6t" style={{height:"48",width:"48"}}>
      <img src="https://lh3.googleusercontent.com/LCJxxd-ZKpaa2oQPlJBV_cEmSVXfo44wDEAeC-rUcnEmEAjp0Sr9MyMVA4Q3kMiwmxXdtD1hvhbqmQMZocUkspSyeg8wvI8=w80-rw"
      style={{width:"100%",height:"48px",objectFit:"contain",position:"absolute",top:"0",left:"0"}}/>
    </div>
    <div className="css-1dr385k">Điện thoại</div>
  </div>
  </a>
  </div>
  {/* div */}
<div style={{flexShrink:"0"}}>
   <a className="css-cbrxda" href="/">
  <div className="css-1g2qfl">
    <div className="css-1knqu6t" style={{height:"48",width:"48"}}>
      <img src="https://lh3.googleusercontent.com/5VBbfT5QnruyaQGLg5i3MSaMk_WDRAIrvF1R63pnGTKZ0D3tlnrK18db3tjqruJOIRvl5gveasYKyO0SoK5h4Ipmm8UbV3A=w80-rw"
      style={{width:"100%",height:"48px",objectFit:"contain",position:"absolute",top:"0",left:"0"}}/>
    </div>
    <div className="css-1dr385k">Iphone</div>
  </div>
  </a>
  </div>
  {/* div */}
<div style={{flexShrink:"0"}}>
   <a className="css-cbrxda" href="/">
  <div className="css-1g2qfl">
    <div className="css-1knqu6t" style={{height:"48",width:"48"}}>
      <img src="https://lh3.googleusercontent.com/FfWF1Pw4BwylSwKn7l1SmAWR2COVyxaMix9DaGJUbV1PpHcANWNJoAuhp1mj5kSO06_-W74LeyN3Hzx3R4ucuRDjXVJ5Cb3F9A=w80-rw"
      style={{width:"100%",height:"48px",objectFit:"contain",position:"absolute",top:"0",left:"0"}}/>
    </div>
    <div className="css-1dr385k">Laptop</div>
  </div>
  </a>
  </div>
  {/* div */}
<div style={{flexShrink:"0"}}>
   <a className="css-cbrxda" href="/">
  <div className="css-1g2qfl">
    <div className="css-1knqu6t" style={{height:"48",width:"48"}}>
      <img src="https://lh3.googleusercontent.com/pxT4tcJhyd9QyLWIrtsCyHkBMwzkxnf_yqVBXwLl5uGHXnOaexsV5h9TBiMUaxm8G9S3DJpwGutvEXbA9vN5raFD6mkHhoaz=w80-rw"
       style={{width:"100%",height:"48px",objectFit:"contain",position:"absolute",top:"0",left:"0"}}/>
    </div>
    <div className="css-1dr385k">Phụ kiện</div>
  </div>
  </a>
  </div>
  {/* div */}
<div style={{flexShrink:"0"}}>
   <a className="css-cbrxda" href="/showroom">
  <div className="css-1g2qfl">
    <div className="css-1knqu6t" style={{height:"48",width:"48"}}>
      <img src="https://img.icons8.com/ios-glyphs/80/map-marker.png" alt="map-marker"
       style={{width:"100%",height:"48px",objectFit:"contain",position:"absolute",top:"0",left:"0"}}/>
    </div>
    <div typeof="caption" className="css-1dr385k">Showroom</div>
  </div>
  </a>
  </div>
  {/* div */}
<div style={{flexShrink:"0"}}>
   <a className="css-cbrxda" href="/support">
  <div className="css-1g2qfl">
    <div className="css-1knqu6t" style={{height:"48",width:"48"}}>
      <img src="https://img.icons8.com/ios-glyphs/80/filled-chat.png" alt="messaging-"
      style={{width:"100%",height:"48px",objectFit:"contain",position:"absolute",top:"0",left:"0"}}/>
    </div>
    <div typeof="caption" className="css-1dr385k">Tư vấn<br/>doanh nghiệp</div>
  </div>
  </a>
  </div>
  {/* div */}
<div style={{flexShrink:"0"}}>
   <a className="css-cbrxda" href="/host">
  <div className="css-1g2qfl">
    <div className="css-1knqu6t" style={{height:"48",width:"48"}}>
      <img src="https://img.icons8.com/ios-glyphs/80/man-on-phone--v1.png" alt="man-on-phone--v1"
      style={{width:"100%",height:"48px",objectFit:"contain",position:"absolute",top:"0",left:"0"}}/>
    </div>
    <div  style={{content:'Business consultancy'}} className="css-1dr385k">Liên hệ</div>
  </div>
  </a>
  </div>
  {/* div */}
<div style={{flexShrink:"0"}}>
   <a className="css-cbrxda" href="/tin-tuc">
  <div className="css-1g2qfl">
    <div className="css-1knqu6t" style={{height:"48",width:"48"}}>
      <img src="https://img.icons8.com/ios/80/info-popup.png"
      style={{width:"100%",height:"48px",objectFit:"contain",position:"absolute",top:"0",left:"0"}}/>
    </div>
    <div className="css-1dr385k">Tin tức</div>
  </div>
  </a>
  </div>


          </div>
        </div>
      </body>
    </>
  );
}

export default Noidung;
