import React, { useContext, useEffect } from "react";
import { Button, Result } from "antd";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { addProductToCart, deleteProductInCart } from "../../redux/cartSlice";
import config from "../../config";
import { SocketContext } from "../App";

const BuySuccess = () => {
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

  useEffect(() => {
    // Kiểm tra nếu thanh toán đã thành công
    if (Cookies.get("paymentSuccess") === "true" && cart.length !== 0) {
      // Xóa trạng thái thanh toán thành công và thông tin về những sản phẩm được chọn
      Cookies.set("paymentSuccess", "false");
      // Xóa những sản phẩm được chọn khỏi giỏ hàng
      removeFromCart();
      // Gửi thông báo cho admin
    }
    if (socket) {
      socket.emit("new-order-notification", { message: 'New order' });
    }
  }, [cart, socket]);

  return (
    <Result
      status="success"
      title={<div style={{ color: "#52c41a" }}>Đặt hàng thành công!</div>}
      subTitle={
        <div style={{ color: "black" }}>
           {config.websiteLogo} cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của
           {config.websiteLogo}.
          <br />
          Đơn hàng của bạn đã được đặt thành công,  {config.websiteLogo} sẽ liên hệ xác
          nhận lại với bạn!
          <br />
           {config.websiteLogo} xin cảm ơn!
        </div>
      }
      extra={[
        <Button type="primary" key="console" href="/">
          Về trang chủ
        </Button>,
        <Button key="profile" href="/profile/order">
          Xem đơn hàng
        </Button>,
        <Button key="buy" href="/cart">
          Mua lại
        </Button>,
      ]}
    />
  );
};

export default BuySuccess;
