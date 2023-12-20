import React, { useContext, useEffect, useRef } from 'react';
import { Button, Result } from 'antd';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, deleteProductInCart } from "../../redux/cartSlice";
import config from "../../config";
import { SocketContext } from '../App';

const BillSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.products);
  const socket = useContext(SocketContext);


  const removeFromCart = () => {
    // lấy sản phẩm được chọn mua
    var informationSelected = sessionStorage.getItem("buys");
    if (informationSelected) {
      informationSelected = JSON.parse(informationSelected).selectedItems;
      const data = [];
      // Nếu informationSelected là mảng
      Array.isArray(informationSelected) &&
        [...informationSelected].forEach((value) => {
          const item = {
            product_id: value.id,
            capacity: value.capacity,
            color: value.color,
            coupons: value.coupons
          };
          data.push(item);
        });
      // xóa trong cart redux
      data.forEach((item) => {
        dispatch(deleteProductInCart(item));
      });
    }
  };

  const hasRemovedFromCart = useRef(false);

  useEffect(() => {
    if (!hasRemovedFromCart.current && cart.length !== 0 && socket) {
      removeFromCart();
      hasRemovedFromCart.current = true;
      socket.emit("new-order-notification", { message: 'New order' });
    }
  }, [cart, socket]);
  
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentDataobject = Object.fromEntries(params);
    const paymentData = JSON.stringify(paymentDataobject);
    // console.log('Momo payment data:', paymentData);

    // Lấy các giá trị từ sessionStorage
    const UserID = sessionStorage.getItem('UserID');
    const addressID = sessionStorage.getItem('addressID');
    const productID = JSON.parse(sessionStorage.getItem('productID'));
    const quantity = JSON.parse(sessionStorage.getItem('quantity'));
    const color = JSON.parse(sessionStorage.getItem('color'));
    const capacity = JSON.parse(sessionStorage.getItem('capacity'));
    const totalPrice = JSON.parse(sessionStorage.getItem('totalPrice'));
    const discount = JSON.parse(sessionStorage.getItem('discount'));
    const coupons = JSON.parse(sessionStorage.getItem('coupons'));
    const deliveryMethod = sessionStorage.getItem('deliveryMethod');
    const paymentMenthod = sessionStorage.getItem('paymentMenthod');
    const note = sessionStorage.getItem('note');
    const totalAmount = sessionStorage.getItem('totalAmount');
    const status = sessionStorage.getItem('status');

    // Gửi dữ liệu lên server
    const data = {
      UserID,
      addressID,
      productID,
      quantity,
      color,
      capacity,
      totalPrice,
      discount,
      coupons,
      deliveryMethod,
      paymentMenthod,
      note,
      paymentData, // Thêm paymentData vào đối tượng data
      totalAmount,
      status,
    };

    // console.log("data: " + data)

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
      title={<div style={{ color: '#52c41a' }}>Đặt hàng thành công!</div>}
      subTitle={
        <div style={{ color: 'black' }}>
           {config.websiteLogo} cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của  {config.websiteLogo}.<br />
          Đơn hàng của bạn đã được đặt thành công,  {config.websiteLogo} sẽ liên hệ xác nhận lại với bạn!<br />
           {config.websiteLogo} xin cảm ơn!
        </div>
      }
      extra={[
        <Button type="primary" key="console" href='/'>
          Về trang chủ
        </Button>,
        <Button key="profile" href="/profile/order">
        Xem đơn hàng
      </Button>,
        <Button key="buy" href='/cart'>Mua lại</Button>
      ]}
    />
  );
};

export default BillSuccess;