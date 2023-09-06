
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Badge, Avatar, Dropdown, Affix, Button, Form, Breadcrumb } from 'antd';
import { DownOutlined, BellOutlined, ShoppingCartOutlined, UserOutlined, SearchOutlined, TagOutlined, EnvironmentOutlined, CommentOutlined, PhoneOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CheckSP.css'



const CheckSP = () => {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);


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

      <div className="d1 step1 snipcss-Ko5VG">

        <h4>Tra cứu thông tin đơn hàng</h4>
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
          <Button type="submit" onClick={handleConfirm} className="btn">
            Tra cứu
          </Button>
        </Form>
      </div>
    </div>


  );


};
export default CheckSP;