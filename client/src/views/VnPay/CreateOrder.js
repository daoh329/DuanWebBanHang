import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateOrder = () => {
  const [amount, setAmount] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [language, setLanguage] = useState('vn');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/pay/create_payment_url`, {
      amount,
      bankCode,
      language,
    });

    if (response.data && response.data.url) {
      window.location.href = response.data.url;
    }
  };

  return (
    <div className="table-responsive">
      <form id="createOrder" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Số tiền</label>
          <input
            className="form-control"
            id="amount"
            name="amount"
            placeholder="Số tiền"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Chọn Phương thức thanh toán:</label>
          <div>
            <label>
              <input
                type="radio"
                name="bankCode"
                value=""
                checked={bankCode === ''}
                onChange={() => setBankCode('')}
              />
              Cổng thanh toán VNPAYQR
            </label>
            <label>
              <input
                type="radio"
                name="bankCode"
                value="VNPAYQR"
                checked={bankCode === 'VNPAYQR'}
                onChange={() => setBankCode('VNPAYQR')}
              />
              Thanh toán qua ứng dụng hỗ trợ VNPAYQR
            </label>
            <label>
              <input
                type="radio"
                name="bankCode"
                value="VNBANK"
                checked={bankCode === 'VNBANK'}
                onChange={() => setBankCode('VNBANK')}
              />
              Thanh toán qua ATM-Tài khoản ngân hàng nội địa
            </label>
            <label>
              <input
                type="radio"
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
          <label>Ngôn ngữ</label>
          <div>
            <label>
              <input
                type="radio"
                name="language"
                value="vn"
                checked={language === 'vn'}
                onChange={() => setLanguage('vn')}
              />
              Tiếng việt
            </label>
            <label>
              <input
                type="radio"
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
