import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useLocation } from 'react-router-dom';
const BillSuccess = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentDataobject = Object.fromEntries(params);
    const paymentData= JSON.stringify(paymentDataobject);
    console.log('Momo payment data:', paymentData);
  
    // Lấy các giá trị từ sessionStorage
    const UserID = sessionStorage.getItem('UserID');
    const addressID = sessionStorage.getItem('addressID');
    const productID = sessionStorage.getItem('productID');
    const quantity = sessionStorage.getItem('quantity');
    const color = sessionStorage.getItem('color');
    const capacity = sessionStorage.getItem('capacity');
    const deliveryMethod = sessionStorage.getItem('deliveryMethod');
    const paymentMenthod = sessionStorage.getItem('paymentMenthod');
    const note = sessionStorage.getItem('note');
    const totalAmount = sessionStorage.getItem('totalAmount');
    const status = sessionStorage.getItem('status');
  
    // // In ra các giá trị
    // console.log('UserID:', userID);
    // console.log('addressID:', addressID);
    // console.log('productID:', productID);
    // console.log('quantity:', quantity);
    // console.log('deliveryMethod:', deliveryMethod);
    // console.log('paymentMenthod:', paymentMenthod);
    // console.log('note:', note);
    // console.log('status:', status);
  
    // Gửi dữ liệu lên server
    const data = {
        UserID,
        addressID,
        productID,
        quantity,
        color,
        capacity,
        deliveryMethod,
        paymentMenthod,
        note,
        paymentData, // Thêm paymentData vào đối tượng data
        totalAmount,
        status,
    };
  
    fetch(`${process.env.REACT_APP_API_URL}/order/paymentmomo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }, [location]);


  return (
    <Result
      status="success"
      title={<div style={{color:'#52c41a'}}>Đặt hàng thành công!</div>}
      subTitle={
          <div style={{color:'black'}}>
            DINHMINH.VN cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của DINHMINH.VN.<br />
            Đơn hàng của bạn đã được đặt thành công, DINHMINH.VN sẽ liên hệ xác nhận lại với bạn!<br />
            DINHMINH.VN xin cảm ơn!
          </div>
        }
      extra={[
        <Button type="primary" key="console" href='/'>
          Về trang chủ
        </Button>,
        <Button key="buy" href='/cart'>Mua lại</Button>
      ]}
    />
  );
};

export default BillSuccess;