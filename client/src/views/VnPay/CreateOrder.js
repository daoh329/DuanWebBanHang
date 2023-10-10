import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CreateOrder = () => {
  const [amount, setAmount] = useState(null);
  const [bankCode, setBankCode] = useState('');
  const [language, setLanguage] = useState('vn');

  const location = useLocation();
  // Lấy dữ liệu từ sessionStorage khi component được tải
  useEffect(() => {
    const buysDataFromSession = sessionStorage.getItem("buys");
    console.log("buysDataFromSession:", buysDataFromSession); // Kiểm tra dữ liệu trong sessionStorage
    if (buysDataFromSession) {
      const parsedBuysData = JSON.parse(buysDataFromSession);
      console.log("parsedBuysData:", parsedBuysData); // Kiểm tra dữ liệu sau khi chuyển đổi
      setAmount(parsedBuysData.total); // Cập nhật giá trị total vào state amount
      console.log("dữ liệu total:", parsedBuysData.total);
    }
  }, []);
  
  
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const amountParam = params.get('amount');
  //   if (amountParam) {
  //     setAmount(amountParam);
  //   }
  // }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const data = {
      amount,
      bankCode,
      language,
    };
  
    const response = await fetch(`${process.env.REACT_APP_API_URL}/pay/create_payment_url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json(); // Phân tích cú pháp body yêu cầu thành JSON
  
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    }
  };

  return (
    <div className="table-responsive">
      <form id="createOrder" onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{fontSize: 17, fontWeight: 'bold'}}>Số tiền</label>
          <input
            style={{width: 500, display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
            className="form-control"
            id="amount"
            name="amount"
            placeholder="Số tiền"
            value={amount}
            readOnly
          />
        </div>
        <div className="form-group">
          <label style={{fontSize: 17, fontWeight: 'bold'}}>Chọn Phương thức thanh toán:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="bankCode"
                value=""
                checked={bankCode === ''}
                onChange={() => setBankCode('')}
              />
              Cổng thanh toán VNPAYQR
            </label>
            <label style={{marginLeft: 50}}>
              <input
                type="checkbox"
                name="bankCode"
                value="VNPAYQR"
                checked={bankCode === 'VNPAYQR'}
                onChange={() => setBankCode('VNPAYQR')}
              />
              Thanh toán qua ứng dụng hỗ trợ VNPAYQR
            </label>
            <label style={{marginLeft: 50}}>
              <input
                type="checkbox"
                name="bankCode"
                value="VNBANK"
                checked={bankCode === 'VNBANK'}
                onChange={() => setBankCode('VNBANK')}
              />
              Thanh toán qua ATM-Tài khoản ngân hàng nội địa
            </label>
            <label style={{marginLeft: 50}}>
              <input
                type="checkbox"
                name="bankCode"
                value="INTCARD"
                checked={bankCode === 'INTCARD'}
                onChange={() => setBankCode('INTCARD')}
              />
              Thanh toán qua thẻ quốc tế
            </label>
          </div>
        </div>
        <div className="form-group">
          <label style={{fontSize: 17, fontWeight: 'bold'}}>Ngôn ngữ</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="language"
                value="vn"
                checked={language === 'vn'}
                onChange={() => setLanguage('vn')}
              />
              Tiếng việt
            </label>
            <label style={{marginLeft: 50}}>
              <input
                type="checkbox"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={() => setLanguage('en')}
              />
              Tiếng anh
            </label>
          </div>
        </div>
        <button className="btn btn-default" id="btnPopup" type="submit">
          Thanh toán
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
