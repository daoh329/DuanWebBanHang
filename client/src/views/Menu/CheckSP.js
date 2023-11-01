
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Badge, Avatar, Dropdown, Affix, Button, Form, Breadcrumb } from 'antd';
import { DownOutlined, BellOutlined, ShoppingCartOutlined, UserOutlined, SearchOutlined, TagOutlined, EnvironmentOutlined, CommentOutlined, PhoneOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CheckSP.css'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const CheckSP = () => {

  // Đang sửa otp
  // Khai báo state cho các trường thông tin cá nhân
  // const [phone, setPhone] = useState('');
//   const [status, setStatus] = useState('');
// // otp
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [isOTPVerified, setIsOTPVerified] = useState(false);
 
  
//   const handleSendOTP = () => {
//     // Set up reCAPTCHA verifier
//     const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {});

//     // Send OTP to user's phone number
//     signInWithPhoneNumber(auth, phone, verifier).then((result) => {
//       setConfirmationResult(result);
//     });
//   };

//   const handleVerifyOTP = () => {
//     // Prompt user to enter OTP
//     const code = window.prompt("Enter OTP");

//     // Verify OTP
//     confirmationResult.confirm(code).then((result) => {
//       // User is signed in
//       const user = result.user;
//       setIsOTPVerified(true); // Cập nhật trạng thái xác minh OTP
//     });
//   };

//   // Hàm xử lý khi người dùng nhấn nút "Xác nhận"
//   const handleConfirm = async () => {
//     const data = {
//       phone: phone,
//       status:'Chưa xác nhận',
//     };

//     // In ra giá trị của biến data
//     console.log("Data:", data);

//     // Gửi thông tin đăng ký lên server
//     const response = await fetch("http://localhost:3000/order/order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     // Xử lý kết quả trả về từ server NodeJS
//     if (response.ok) {
//       // Thông báo thành công
//       alert("thành công");
//     } else {
//       // Thông báo lỗi
//       alert("Có lỗi ");
//     }
//   };
  

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
  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);

  return (
    <div style={{margin:'0 auto', width:'80%',marginTop:'10px'}}>
      <h6>
        <Breadcrumb
        items={[
          {
            title: <a href="/">Home</a>,
          },
          {
            title: <a href="/checkSP">Tra cứu</a>,
          }
        ]}
      />
      </h6>
      

        <h4>Tra cứu thông tin đơn hàng</h4>
        <Form >
          <div className="input-area">
            <i className="iconoh-phone-blue input-icon"></i>
      <Input size="large"
           placeholder="Nhập số điện thoại"
            prefix={<UserOutlined />} 
            onChange={(e) => setPhone(e.target.value)} value={phone}
            type="tel"
            name="txtPhoneNumber"
            id="txtPhoneNumber"
            onkeypress="ValidateOnlyNumber(event)"
            autoComplete="off"
              maxLength={15}
            />
          </div>
          <label className="hide"></label>
          <Button type="submit" onClick={handleConfirm} className="btn">
            Tra cứu
          </Button>
        </Form>

    </div>


  );


};
export default CheckSP;