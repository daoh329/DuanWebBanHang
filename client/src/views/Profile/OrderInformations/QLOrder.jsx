import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, Divider } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import axios from "axios";
import { formatCurrency } from "../../../util/FormatVnd";
import { utcToZonedTime, format } from 'date-fns-tz';

function QLOrder() {


  const location = useLocation();
  const orderData = location.state.orderData;
  const order_id = orderData.order_id;
  const paymentData = JSON.parse(orderData.paymentData);
  const color = orderData.color;
  const productID = orderData.productID;
  const shortDescription = orderData.shortDescription;
  const totalAmount = orderData.totalAmount;
  const capacity = orderData.capacity;
  const quantity = orderData.quantity;

  const products = orderData.products;
  const user_name = orderData.user_name;
  const deliveryMethod = orderData.deliveryMethod;
  const address = orderData.address;
  const delivery_phone = orderData.delivery_phone;
  const delivery_email = orderData.delivery_email;
  const order_created_at = orderData.order_created_at;
  const productIDs = products.map(product => product.productID);

  const navigate = useNavigate();

  const handleCancelOrder = () => {
    navigate(-1);
  };
  const handleDetails = (product) => {
    // Kiểm tra xem 'id' có tồn tại hay không
    if (!product.productID) {
      console.error("Product ID is undefined!");
      return;
    }
    // Lấy danh sách các sản phẩm đã xem từ session storage
    const historysp = JSON.parse(sessionStorage.getItem("products")) || [];

    // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
    const isViewed = historysp.some((historyProduct) => historyProduct.id === product.productID);
    // Nếu sản phẩm mới chưa được xem
    if (!isViewed) {
      // Thêm đối tượng sản phẩm mới vào cuối danh sách
      historysp.push(product);
      // Lưu trữ danh sách các sản phẩm đã xem vào session storage
      sessionStorage.setItem("products", JSON.stringify(historysp));
    }
    navigate(`/detail/${product.productID}`);
  };

  const date = new Date(orderData.order_created_at);
  const fmt = 'HH:mm:ss -  dd/MM/yyyy';

  // Chuyển đổi thời gian thành thời gian theo múi giờ UTC
  const zonedDate = utcToZonedTime(date, 'Etc/UTC');

  // Định dạng thời gian theo múi giờ UTC
  const output = format(zonedDate, fmt, { timeZone: 'Etc/UTC' });


  return (
    <div style={{ display: "block", width: '1100px', margin: '0 auto' }}>

      <div style={{ display: 'flex', marginTop: 30, columnGap: '10px' }}>

        <div style={{ margin: "0 auto" }}>
          <div style={{ width: '100%', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              onClick={handleCancelOrder}
              id="order-informations-title-btn"
              icon={<LeftOutlined />}
            />
            <h5>mã đơn hàng: {order_id}</h5>
          </div>
          <div style={{ width: 366, height: 370, backgroundColor: 'white', borderRadius: '10px', padding: '10px', marginTop: 15, textAlign: 'left' }}>
            <p style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Thông tin người nhận</p>
            <p><b>Người nhận:</b> <span style={{ fontWeight: 'normal' }}>{user_name}</span></p>
            <p><b>Email:</b> <span style={{ fontWeight: 'normal' }}>{delivery_email}</span></p>
            <p><b>Điện thoại:</b> <span style={{ fontWeight: 'normal' }}>{delivery_phone}</span></p>
            <p><b>Địa chỉ:</b> <span style={{ fontWeight: 'normal' }}>{address}</span></p>
            <p><b>Hình thức nhận hàng:</b> <span style={{ fontWeight: 'normal' }}>{deliveryMethod}</span></p>

          </div>
        </div>

        <div style={{ width: 366, height: 370, backgroundColor: 'white', borderRadius: '10px', padding: '10px', marginTop: 46, textAlign: 'left' }}>
          <p style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Thông tin đơn hàng</p>
          <p>
            <b>Trạng thái đơn hàng:</b>{" "}
            <span>
              {(() => {
                switch (orderData.order_status) {
                  case 0: return "Chờ xác nhận";
                  case 1: return "Đã xác nhận";
                  case 2: return "Đã hủy";
                  case 3: return "Đang vận chuyển";
                  case 4: return "Đã giao hàng";
                  case 5: return "Giao hàng không thành công";
                  default: return "Không xác định";
                }
              })()}
            </span>
          </p>
          <p>
            <b>Thời gian tạo: </b>
            {/* <span>{format(new Date(orderData.order_created_at), "HH:mm:ss dd/MM/yyyy")}</span><br /> */}
            <span>{output}</span>
          </p>
        </div>

        <div>
          <div style={{ width: 366, height: 370, backgroundColor: 'white', borderRadius: '10px', padding: '10px', marginTop: 46, textAlign: 'left' }}>
            <p style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Thông tin hóa đơn</p>
            {paymentData && (paymentData.vnp_OrderInfo || paymentData.orderId) ? (
              <>
                <p><b>Mã thanh toán giao dịch:</b> <span style={{ fontWeight: 'normal' }}>{paymentData.vnp_OrderInfo || paymentData.orderId}</span></p>
                <p><b>Mã tham chiếu giao dịch:</b> <span style={{ fontWeight: 'normal' }}>{paymentData.vnp_TxnRef || paymentData.transId}</span></p>
                <p><b>Thời gian thực hiện:</b> <span style={{ fontWeight: 'normal' }}>{paymentData.vnp_PayDate || paymentData.responseTime}</span></p>
                <p><b>Loại thanh toán:</b> <span style={{ fontWeight: 'normal' }}>{paymentData.vnp_CardType || paymentData.payType}</span></p>
                <p><b>Ngân hàng:</b> <span style={{ fontWeight: 'normal' }}>{paymentData.vnp_BankCode || paymentData.orderType}</span></p>
                <p><b>Số giao dịch:</b> <span style={{ fontWeight: 'normal' }}>{paymentData.vnp_BankTranNo || paymentData.transId}</span></p>
                <p><b>Tổng tiền:</b> <span style={{ fontWeight: 'normal' }}>{(parseInt(paymentData.vnp_Amount ? paymentData.vnp_Amount / 100 : paymentData.amount)).toLocaleString()}</span></p>
                {/* Thêm các trường khác của paymentData tại đây */}
              </>
            ) : 'Thanh toán khi nhận hàng'}
          </div>
        </div>

      </div>


      <div className="order-informations-block-2">
        <div className="block-2-title">
          <h6>Sản phẩm</h6>
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={{ display: 'grid', gap: '10px' }}>
          {products.map((product, index) => (
            <div key={index} className="product-item">
              <div className="product-image">
                <img onClick={() => handleDetails(product)} src={process.env.REACT_APP_API_URL + product.main_image} alt="" />
              </div>
              <div className="product-infomations" style={{ textAlign: 'left' }}>
                <p onClick={() => handleDetails(product)} className="name">{product.name}</p>
                <p style={{ margin: "0", color: "#a6a4a4" }}>Màu sắc: {product.color}</p>
                <p style={{ margin: "0", color: "#a6a4a4" }}>Dung lượng: {product.capacity}</p>

              </div>
              <div className="product-total">
                <p style={{ fontWeight: "500" }}>{formatCurrency(product.totalPrice)}</p>
                <p style={{ color: "#a6a4a4" }}>x{product.quantity}</p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div >
  );
}

export default QLOrder;
