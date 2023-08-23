import React from "react";
import { FacebookOutlined, GoogleOutlined, PhoneOutlined } from "@ant-design/icons";
import "./login.css";

const Login = () => {
  return (
    <div className="login">
      {/* title */}
      <p className="title-login">
        Chào mừng bạn đến với PhongVu.vn | Laptop, PC, Màn hình, điện thoại,
        linh kiện Chính Hãng!
      </p>
      {/* btn login fb */}
      <button className="btn-login-fb">
        <FacebookOutlined className="icon-fb" />
        Tiếp tục với Facebook
      </button>
      {/* btn login gg */}
      <button className="btn-login-gg">
        <GoogleOutlined className="icon-gg" />
        Tiếp tục với Google
      </button>
      <br />
      <p>Hoặc</p>
      {/* btn login number phone */}
      <button className="btn-login-number-phone">
        <PhoneOutlined className="icon-number-phone" />
        Tiếp tục với số điện thoại
      </button>
    </div>
  );
};

export default Login;
