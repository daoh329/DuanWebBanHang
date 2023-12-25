import React, { useState, useEffect } from "react";
import "./login.css";
import {
  FacebookFilled,
  GoogleOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { MDBIcon } from "mdb-react-ui-kit";
import { Checkbox, Input, Modal, message } from "antd";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import OtpInput from "otp-input-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const { info } = Modal;

const Login = () => {
  let navigate = useNavigate();

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

  // Hàm show modal motification
  const showNotification = (title, content) => {
    info({
      title: title || "Thông báo!",
      icon: <ExclamationCircleFilled />,
      content: content || "...",
      centered: true,
      okText:"Đóng",
      maskClosable: true,
    });
  };

  const handleOnClickFB = () => {
    showNotification(null, "Tính năng sẽ được hoàn thiện trong phiên bản tới");
    return;
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
        `${process.env.REACT_APP_API_URL}/auth/login/google`,
        "_self"
      );
    } else {
      showNotification(
        null,
        "Vui lòng xác nhận đồng ý với các điều khoản và điều kiện dịch vụ để tiếp tục"
      );
    }
  };

  const handleOnClickNumberPhone = () => {
    showNotification(null, "Tính năng sẽ được hoàn thiện trong phiên bản tới");
    return;
    if (check) {
      return setOpenModal(true);
    }
    alert(
      "Vui lòng đồng ý với chính sách điều khoản và bảo mật của chúng tôi."
    );
  };

  // function onCaptchVerify() {
  //   window.recaptchaVerifier = new RecaptchaVerifier(
  //     auth,
  //     "recaptcha-container",
  //     {
  //       size: "invisible",
  //       callback: (response) => {
  //         onSignup();
  //       },
  //       "expired-callback": () => {},
  //     }
  //   );
  // }

  // const onSignup = async () => {
  //   if (numberPhone.length <= 0) {
  //     return setErrorNumberPhone("Vui lòng nhập số điện thoại!");
  //   }
  //   const regex = new RegExp(/^(0[2-9])([0-9]{8})$/);
  //   if (!regex.test(numberPhone)) {
  //     return setErrorNumberPhone("Vui lòng nhập đúng định dạng số điện thoại!");
  //   }
  //   setConfirmLoading(true);

  //   if (!window.recaptchaVerifier) {
  //     onCaptchVerify(); // open capcha
  //   }
  //   const appVerifier = window.recaptchaVerifier;

  //   const formatPhone = "+84" + numberPhone;

  //   await signInWithPhoneNumber(auth, formatPhone, appVerifier)
  //     .then((confirmationResult) => {
  //       window.confirmationResult = confirmationResult;
  //       setTimeout(() => {
  //         setConfirmLoading(false);
  //         setOpenInputOTP(true);
  //         setErrorNumberPhone("");
  //         message.success("Đã gửi mã OTP!");
  //       }, 2000);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setErrorNumberPhone("");
  //       setConfirmLoading(false);
  //       message.error("Gửi mã OTP không thành công!");
  //     });
  // };

  // const handleConfirmOTP = async () => {
  //   if (OTP.length <= 0) {
  //     return setErrorNumberPhone("Vui lòng nhập mã OTP của bạn!");
  //   }
  //   setConfirmLoading(true);
  //   try {
  //     const res = await window.confirmationResult.confirm(OTP);
  //     const result = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/auth/login-otp`,
  //       {
  //         phoneNumber: res.user.phoneNumber,
  //       }
  //     );
  //     if (result.status === 200) {
  //       setTimeout(() => {
  //         setConfirmLoading(false);
  //         setOpenModal(false);
  //         setOpenInputOTP(false);
  //         setErrorNumberPhone("");
  //         setOTP("");
  //         message.success("Xác nhận thành công!");
  //       }, 1000);
  //       setTimeout(() => {
  //         navigate("/");
  //         window.location.reload();
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setConfirmLoading(false);
  //     message.success("Xác nhận thất bại!");
  //   }
  // };

  const handleCancel = () => {
    setOpenModal(false);
    setOpenInputOTP(false);
    setErrorNumberPhone("");
    setOTP("");
    setConfirmLoading(false);
  };

  return (
    <div className="login-group">
      <div className="login">
        {/* title */}
        <p className="title-login">
          Chào mừng bạn đến với {config.websiteLogo} | Laptop, điện thoại Chính
          Hãng!
        </p>
        <div id="recaptcha-container"></div>
        {/* btn login fb */}
        <button onClick={handleOnClickFB} className="btn-login-fb">
          <FacebookFilled className="icon-fb" />
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
          <MDBIcon fas icon="phone" className="icon-number-phone" />
          Tiếp tục với số điện thoại
        </button>
        <Modal
          title={
            openInputOTP
              ? `Nhập mã OTP vừa được gửi về số điện thoại ${numberPhone}`
              : "Nhập số điện thoại của bạn"
          }
          open={openModal}
          // onOk={openInputOTP ? handleConfirmOTP : onSignup}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          cancelText={"Đóng"}
          closeIcon={false}
        >
          {openInputOTP ? (
            <OtpInput
              value={OTP}
              onChange={setOTP}
              OTPLength={6}
              otpType="number"
              disabled={false}
              className="input-otp"
            />
          ) : (
            <Input
              value={numberPhone}
              onChange={(e) => {
                setNumberPhone(e.target.value);
              }}
              placeholder="Nhập số điện thoại tại đây."
              className="input-phone"
            />
          )}

          {errorNumberPhone && (
            <p style={{ color: "red" }}>{errorNumberPhone}</p>
          )}
        </Modal>
        {/* điều khoản (checkbox) */}
        <div className="terms-privacy-group">
          <Checkbox
            onChange={handleCheckbox}
            className="terms-privacy-control"
            checked={check}
          />
          <div className="p-terms-privacy">
            Bằng việc đánh dấu vào ô này, Tôi xác nhận:
            <p style={{ margin: "0" }}>
              i. Đã đọc và đồng ý với{" "}
              <span>
                <a href="/chinh-sach-doi-tra">Chính sách mua hàng</a>
              </span>{" "}
              và{" "}
              <span>
                <a href="#">Chính sách bảo mật</a>
              </span>{" "}
              của {config.websiteLogo}, bao gồm việc cho phép {config.websiteLogo} được thu thập, xử lý
              dữ liệu cá nhân theo chính sách bảo mật này và theo quy định pháp
              luật.
            </p>
            <p style={{ margin: "0" }}>
              ii. Các thông tin mà tôi cung cấp và đồng ý cho {config.websiteLogo} xử lý
              trong quá trình thiết lập mối quan hệ, giao dịch giữa tôi và {config.websiteLogo} là hợp pháp, chính xác, đầy đủ, hợp lệ và đã được sự đồng ý của
              Bên thứ ba (nếu có cung cấp thông tin của bên thứ ba)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
