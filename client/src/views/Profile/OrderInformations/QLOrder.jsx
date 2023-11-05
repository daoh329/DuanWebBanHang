import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function QLOrder() {
  const location = useLocation();
  const orderData = location.state.orderData;
  const paymentData = JSON.parse(orderData.paymentData);

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
        <div style={{width: 450, backgroundColor: 'white', borderRadius: '10px', padding: '10px'}}>
            <p style={{marginTop: 20, fontSize: 18, fontWeight: 'bold'}}>Thông tin hóa đơn</p>
            {paymentData && (paymentData.vnp_OrderInfo || paymentData.orderId) ? (
            <>
                <p>Mã thanh toán giao dịch: <span>{paymentData.vnp_OrderInfo || paymentData.orderId}</span></p>
                <p>Mã tham chiếu giao dịch: <span>{paymentData.vnp_TxnRef || paymentData.transId}</span></p>
                <p>Thời gian thực hiện: <span>{paymentData.vnp_PayDate || paymentData.responseTime}</span></p>
                <p>Loại thanh toán: <span>{paymentData.vnp_CardType || paymentData.payType}</span></p>
                <p>Ngân hàng: <span>{paymentData.vnp_BankCode || paymentData.orderType}</span></p>
                <p>Số giao dịch: <span>{paymentData.vnp_BankTranNo || paymentData.transId}</span></p>
                <p>Tổng tiền: <span>{(parseInt(paymentData.vnp_Amount ? paymentData.vnp_Amount / 100 : paymentData.amount)).toLocaleString()}</span></p>
                {/* Thêm các trường khác của paymentData tại đây */}
            </>
            ) : null}
        </div>
    </div>
  );
}

export default QLOrder;
