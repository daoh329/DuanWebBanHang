
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Badge, Avatar, Dropdown, Affix, Button,Form } from 'antd';
import { DownOutlined, BellOutlined, ShoppingCartOutlined, UserOutlined, SearchOutlined, TagOutlined, EnvironmentOutlined, CommentOutlined, PhoneOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CheckSP.css'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebaseConfig";


const CheckSP = () => {

  // otp
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState(""); 
  
  const handleSendOTP = () => {
    // Set up reCAPTCHA verifier
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {});

    // Send OTP to user's phone number
    signInWithPhoneNumber(auth, phone, verifier).then((result) => {
      setConfirmationResult(result);
    });
  };

  const handleVerifyOTP = () => {
    // Prompt user to enter OTP
    const code = window.prompt("Enter OTP");

    // Verify OTP
    confirmationResult.confirm(code).then((result) => {
      // User is signed in
      const user = result.user;
      setIsOTPVerified(true); // Cập nhật trạng thái xác minh OTP
    });
  };

  // Hàm xử lý khi người dùng nhấn nút "Xác nhận"
  const handleConfirmOTP = async () => {
    if (!isOTPVerified) {
      alert("Vui lòng xác minh mã OTP trước");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/checkOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: enteredOTP,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.isValid) {
          alert("Mã OTP hợp lệ");
        } else {
          alert("Mã OTP không hợp lệ");
        }
      } else {
        alert("Có lỗi khi kiểm tra mã OTP");
      }
    } catch (error) {
      console.error("Lỗi: ", error);
    }
  };
  

  
//phone
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

// phone
    const [phone, setPhone] = useState('');
    const handleConfirm = async () => {
        // Lưu giá trị phone vào session
        window.sessionStorage.setItem('phone', phone);
        navigate(`/orderHistory/${phone}`);
    }

    useEffect(() => {
        // Tải dữ liệu từ API khi component được render
        fetch('https://64df1e7171c3335b25821aef.mockapi.io/users')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    return (
<div className="d1 step1 snipcss-Ko5VG">
  <span>Tra cứu thông tin đơn hàng</span>
  <Form >
    <div className="input-area">
      <i className="iconoh-phone-blue input-icon"></i>
      <input
      onChange={(e) => setPhone(e.target.value)} value={phone}
        type="tel"
        name="txtPhoneNumber"
        id="txtPhoneNumber"
        onkeypress="ValidateOnlyNumber(event)"
        placeholder="Nhập số điện thoại mua hàng"
        autoComplete="off"
        maxLength={15}
      />
    </div>
    <label className="hide"></label>
            <Form.Item>
              <Button onClick={handleSendOTP}>Gửi mã OTP</Button>
              <div id="recaptcha-container"></div>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleVerifyOTP}>Nhập mã OTP đã gửi</Button>
            </Form.Item>
    <Button type="submit" onClick={handleConfirmOTP} className="btn">
      Tra cứu
    </Button>
  </Form>
</div>

    );


};
export default CheckSP;