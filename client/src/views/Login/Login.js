import React, { useState, useEffect } from "react";
import "./login.css";
import {
  FacebookOutlined,
  GoogleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Modal, notification } from "antd";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);

  const [check, setCheck] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [numberPhone, setNumberPhone] = useState("");
  const [errorNumberPhone, setErrorNumberPhone] = useState("");
  const [openInputOTP, setOpenInputOTP] = useState(false);
  const [OTP, setOTP] = useState("");

  const handleCheckbox = () => {
    setCheck(!check);
  };

  const handleOnClickFB = () => {
    if (check) {
      // Call API
      alert("Tính năng đang phát triển.");
      return;
    }
    return alert(
      "Vui lòng đồng ý với chính sách điều khoản và bảo mật của chúng tôi."
    );
  };

  const handleOnClickGG = () => {
    if (check) {
      // Call API
      window.open(
        `${process.env.REACT_APP_API_URL}/auth/google/callback`,
        "_self"
      );
    } else {
      alert(
        "Vui lòng đồng ý với chính sách điều khoản và bảo mật của chúng tôi."
      );
    }
  };

  const handleOnClickNumberPhone = () => {
    if (check) {
      setOpenModal(true);
      return;
    }
    return alert(
      "Vui lòng đồng ý với chính sách điều khoản và bảo mật của chúng tôi."
    );
  };

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  }

  const handleCancel = () => {
    setOpenModal(false);
    setOpenInputOTP(false);
    setErrorNumberPhone("");
  };

  const onSignup = () => {
    try {
      if (numberPhone.length <= 0) {
        return setErrorNumberPhone("Vui lòng nhập số điện thoại!");
      }
      setConfirmLoading(true);

      onCaptchVerify(); // open capcha
      const appVerifier = window.recaptchaVerifier;

      const formatPhone = "+" + numberPhone;
      signInWithPhoneNumber(auth, formatPhone, appVerifier).then(
        (confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setTimeout(() => {
            setConfirmLoading(false);
            setOpenInputOTP(true);
            setErrorNumberPhone("");
            notification.success({
              message: "Thành công",
              description: "Đã gửi mã OTP!",
            });
          }, 2000);
        }
      );
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
      notification.error({
        message: "Thất bại",
        description: "Không thể gửi mã OTP!",
      });
    }
  };

  const handleConfirmOTP = () => {
    try {
      if (OTP.length <= 0) {
        return setErrorNumberPhone("Vui lòng nhập mã OTP của bạn!");
      }
      setConfirmLoading(true);
      window.confirmationResult.confirm(OTP).then(async (res) => {
        setTimeout(() => {
          setConfirmLoading(false);
          setErrorNumberPhone("");
          notification.success({
            message: "Thành công",
            description: "Xác nhận thành công!",
          });
        }, 2000);
      });
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
      notification.error({
        message: "Thất bại",
        description: "Xác nhận thất bại!",
      });
    }
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
      <button
        onClick={handleOnClickNumberPhone}
        className="btn-login-number-phone"
      >
        <PhoneOutlined className="icon-number-phone" />
        Tiếp tục với số điện thoại
      </button>
      <div id="recaptcha-container"></div>
      <Modal
        title={
          openInputOTP
            ? `Nhập mã OTP vừa được gửi về số điện thoại ${numberPhone}`
            : "Nhập số điện thoại của bạn"
        }
        open={openModal}
        onOk={openInputOTP ? handleConfirmOTP : onSignup}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        closeIcon={false}
      >
        {openInputOTP ? (
          <OtpInput
            value={OTP}
            onChange={setOTP}
            OTPLength={6}
            otpType="number"
            disabled={false}
          />
        ) : (
          <PhoneInput
            value={numberPhone}
            onChange={setNumberPhone}
            placeholder="Nhập số điện thoại tại đây."
            country={"vn"}
          />
        )}

        {errorNumberPhone && <p style={{ color: "red" }}>{errorNumberPhone}</p>}
      </Modal>
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
