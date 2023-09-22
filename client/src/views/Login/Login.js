  import React, { useState,useEffect } from "react";
  import {
    FacebookOutlined,
    GoogleOutlined,
    PhoneOutlined,
  } from "@ant-design/icons";
  import "./login.css";

  const Login = () => {
    useEffect(() => {
      window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
    }, []);
    const [check, setCheck] = useState(false);

    const handleCheckbox = () => {
      setCheck(!check);
    };

    const handleOnClickFB = () => {
      if (check) {
        // Call API
        alert("Tính năng đang phát triển.");
        return;
      }
      return alert('Vui lòng đồng ý với chính sách điều khoản và bảo mật của chúng tôi.');
    };

    const handleOnClickGG = () => {
      if (check) {
        // Call API
        window.open(
          `${process.env.REACT_APP_API_URL}/auth/google/callback`,
          "_self"
        );
      }else{
        alert('Vui lòng đồng ý với chính sách điều khoản và bảo mật của chúng tôi.');
      }
    };

    const handleOnClickNumberPhone = () => {
      if (check) {
        // Call API
        alert("Tính năng đang phát triển.");
        return;
      }
      return alert('Vui lòng đồng ý với chính sách điều khoản và bảo mật của chúng tôi.');
    };

    return (
      <div className="login">
        {/* title */}
        <p className="title-login">
          Chào mừng bạn đến với PhongVu.vn | Laptop, PC, Màn hình, điện thoại,
          linh kiện Chính Hãng!
        </p>
        {/* btn login fb */}
        <button onClick={handleOnClickFB} className="btn-login-fb">
          <FacebookOutlined className="icon-fb" />
          Tiếp tục với Facebook
        </button>
        {/* btn login gg */}
        <button onClick={handleOnClickGG} className="btn-login-gg">
          <GoogleOutlined className="icon-gg" />
          Tiếp tục với Google
        </button>
        <br />
        <p>Hoặc</p>
        {/* btn login number phone */}
        <button onClick={handleOnClickNumberPhone} className="btn-login-number-phone">
          <PhoneOutlined className="icon-number-phone" />
          Tiếp tục với số điện thoại
        </button>
        {/* điều khoản (checkbox) */}
        <div className="terms-privacy-group">
          <input
            onChange={handleCheckbox}
            className="terms-privacy-control"
            type="checkbox"
            checked={check}
          />
          <p className="p-terms-privacy">
            Bằng việc đánh dấu vào ô này, Tôi xác nhận:
            <p style={{ margin: "0" }}>
              i. Đã đọc và đồng ý với{" "}
              <span>
                <a href="#">Điều kiện giao dịch chung</a>
              </span>{" "}
              và{" "}
              <span>
                <a href="#">Chính sách bảo mật</a>
              </span>{" "}
              của Phong Vũ, bao gồm việc cho phép Phong Vũ được thu thập, xử lý dữ
              liệu cá nhân theo chính sách bảo mật này và theo quy định pháp luật.
            </p>
            <p style={{ margin: "0" }}>
              ii. Các thông tin mà tôi cung cấp và đồng ý cho Phong Vũ xử lý trong
              quá trình thiết lập mối quan hệ, giao dịch giữa tôi và Phong Vũ là
              hợp pháp, chính xác, đầy đủ, hợp lệ và đã được sự đồng ý của Bên thứ
              ba (nếu có cung cấp thông tin của bên thứ ba)
            </p>
          </p>
        </div>
      </div>
    );
  };

  export default Login;
