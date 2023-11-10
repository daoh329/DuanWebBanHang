import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, Divider } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";

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
  const navigate = useNavigate();

  const handleCancelOrder = () => {
    navigate(-1);
  };
  return (
    <div style={{display:'flex', marginTop: 30}}>
      
    <div style={{marginLeft: 200}}>
      <div style={{width: '100%', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Button
          onClick={handleCancelOrder}
          id="order-informations-title-btn"
          icon={<LeftOutlined />}
        />
        <h5>mã đơn hàng: {order_id}</h5>
      </div>
      <div style={{width: 450, height: 370,backgroundColor: 'white', borderRadius: '10px', padding: '10px', marginTop: 15}}>
          <p style={{marginTop: 20, fontSize: 18, fontWeight: 'bold'}}>Thông tin sản phẩm</p>
          <p><b>SKU:</b> <span style={{fontWeight: 'normal'}}>{productID}</span></p>
          <p><b>Tên sản phẩm:</b> <span style={{fontWeight: 'normal'}}>{shortDescription}</span></p>
          <p><b>Màu:</b> <span style={{fontWeight: 'normal'}}>{color}</span></p>
          <p><b>Dung lượng:</b> <span style={{fontWeight: 'normal'}}>{capacity} gb</span></p>
          <p><b>Số lượng:</b> <span style={{fontWeight: 'normal'}}>{quantity}</span></p>
          <p><b>Tổng giá:</b> <span style={{fontWeight: 'normal'}}>{totalAmount} vnđ</span></p>       
      </div>
    </div>

    <div style={{marginLeft: 200}}>
      <div style={{width: 450, height: 370,backgroundColor: 'white', borderRadius: '10px', padding: '10px', marginTop: 46}}>
          <p style={{marginTop: 20, fontSize: 18, fontWeight: 'bold'}}>Thông tin hóa đơn</p>
          {paymentData && (paymentData.vnp_OrderInfo || paymentData.orderId) ? (
          <>
              <p><b>Mã thanh toán giao dịch:</b> <span style={{fontWeight: 'normal'}}>{paymentData.vnp_OrderInfo || paymentData.orderId}</span></p>
              <p><b>Mã tham chiếu giao dịch:</b> <span style={{fontWeight: 'normal'}}>{paymentData.vnp_TxnRef || paymentData.transId}</span></p>
              <p><b>Thời gian thực hiện:</b> <span style={{fontWeight: 'normal'}}>{paymentData.vnp_PayDate || paymentData.responseTime}</span></p>
              <p><b>Loại thanh toán:</b> <span style={{fontWeight: 'normal'}}>{paymentData.vnp_CardType || paymentData.payType}</span></p>
              <p><b>Ngân hàng:</b> <span style={{fontWeight: 'normal'}}>{paymentData.vnp_BankCode || paymentData.orderType}</span></p>
              <p><b>Số giao dịch:</b> <span style={{fontWeight: 'normal'}}>{paymentData.vnp_BankTranNo || paymentData.transId}</span></p>
              <p><b>Tổng tiền:</b> <span style={{fontWeight: 'normal'}}>{(parseInt(paymentData.vnp_Amount ? paymentData.vnp_Amount / 100 : paymentData.amount)).toLocaleString()}</span></p>
              {/* Thêm các trường khác của paymentData tại đây */}
          </>
          ) : 'Thanh toán khi nhận hàng'}
      </div>
    </div>
  </div>
  );
}

export default QLOrder;
