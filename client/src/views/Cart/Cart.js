import React, { useState, useEffect } from "react";
import { Table, Button, Layout, Space, Col, Row, Card, Checkbox } from "antd";
import { format } from "date-fns";
import axios from "axios";
import { useCart } from "../Cart/CartContext";
import "./Cart.css";
import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCheckbox,
} from "mdb-react-ui-kit";
const { Header, Footer, Sider, Content } = Layout;
function Cart() {
  // Lấy giỏ hàng hiện tại từ session
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const [selectedItems, setSelectedItems] = useState([]);
  const [sortedCart, setSortedCart] = useState([]); // Thêm state để lưu dữ liệu đã được sắp xếp

  // useEffect(() => {
  //   // Sắp xếp dữ liệu sản phẩm theo thời gian mới nhất đầu tiên
  //   const sortedProducts = [...cart].sort((a, b) => {
  //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   });
  //   setSortedCart(sortedProducts);
  // }, [cart]);

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, record) => <Checkbox />,
      width: 50,
    },
    {
      title: "",
      dataIndex: "thumbnail",
      key: "thumbnail",

      render: (_, record) => (
        <img
          src={record.thumbnail}
          alt="thumbnail"
          style={{ width: "200px", height: "50px" }}
        />
      ),
      width: 50,
    },
    { title: "Sản Phẩm", dataIndex: "name", key: "name" },
    { title: "Đơn giá", dataIndex: "price", key: "price" },
    { title: "Thành tiền", dataIndex: "price", key: "price" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);
  return (
    <div>
      <div className="style-2">
        <div className="fle-x">
          <div className="mo-ta">
            <div className="title-mo">Mô tả sản phâm</div>

            <div className="khoi-tiet-cha">
              
            <MDBTable borderless>
  <MDBTableHead light>
    <tr>
      <th scope="col">
        <MDBCheckbox></MDBCheckbox>
      </th>
      <th scope="col">Hình</th>
      <th scope="col">Sản Phẩm</th>
      <th scope="col">Đơn giá</th>
      <th scope="col">Thành tiền</th>
    </tr>
  </MDBTableHead>
  <MDBTableBody>
    {cart.map((item, index) => (
      <tr key={index}>
        <td>
          <MDBCheckbox></MDBCheckbox>
        </td>
        <td  style={{width:'20%'}}>
          <img
          className="image-tiet"
            src={item.thumbnail}
            alt="thumbnail"
            
          />
        </td>
        <td style={{lineHeight:'15px',fontSize:'12px'}}>{item.name}</td>
        <td>{item.price}</td>
        <td>{item.price}</td>
      </tr>
    ))}
  </MDBTableBody>
</MDBTable>
            </div>
          </div>

          <div className="chi-tiet">
            <div className="title-thanh">Thanh Toán</div>
             <div className="khoi-tiet-cha">

                <MDBTable className="table-tiet" borderless>
                <MDBTableBody>
                {cart.map((item, index) => (
                <tr key={index}>
                <td>Tạm tính</td>
                <th>{item.price}</th>
                </tr>))} 
                {cart.map((item, index) => (
                <tr key={index}>
                <td>Thanh Toán</td>
                <th>{item.price}</th>
                </tr>))}  
                
               

                      </MDBTableBody>
                      </MDBTable>
                      <button className="btn-thanh">Tiếp tục</button>
                        </div> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

