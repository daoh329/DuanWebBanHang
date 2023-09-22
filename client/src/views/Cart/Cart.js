import React, { useState, useEffect } from "react";
import { Table, Button, Layout, Space, Col, Row, Card, Checkbox } from "antd";
import axios from "axios";
import { useCart } from "../Cart/CartContext";
import { useNavigate } from "react-router-dom";
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

  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

    const handleCheckboxChange = (productId) => {
      const updatedSelectedProducts = [...selectedProducts];
      const index = updatedSelectedProducts.indexOf(productId);
      if (index === -1) {

        updatedSelectedProducts.push(productId);
      } else {
        updatedSelectedProducts.splice(index, 1);
      }
      setSelectedProducts(updatedSelectedProducts);

  }
  const isContinueButtonDisabled = selectedProducts.length === 0;

  
const Buy = () => {
  window.location.href = '/buy';
};
  //chuyển đến trang chi tiết

  const handleViewDetailproducts = (products) => {
    console.log("click oke");
    navigate(`/detail/${products.id}`);
  };
  
  
const calculateTotalPrice = () => {
  const selectedItems = cart.filter((item) => selectedProducts.includes(item.id));
  const total = selectedItems.reduce((acc, item) => {
    return acc + item.totalPrice;
  }, 0);
  return total;
};

useEffect(() => {
  // Tính tổng tiền của các sản phẩm được chọn
  const total = calculateTotalPrice();
  // Cập nhật biến state tổng tiền
  setTotalPrice(total);
}, [selectedProducts, cart]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [sortedCart, setSortedCart] = useState([]); // Thêm state để lưu dữ liệu đã được sắp xếp
 

  // useEffect(() => {
  //   // Sắp xếp dữ liệu sản phẩm theo thời gian mới nhất đầu tiên
  //   const sortedProducts = [...cart].sort((a, b) => {
  //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   });
  //   setSortedCart(sortedProducts);
  // }, [cart]);

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
                    </th>
                    <th scope="col">Hình</th>
                    <th scope="col">Sản Phẩm</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Đơn giá</th>
                    <th scope="col">Thành tiền</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </td>
                      <td style={{ width: '20%' }}>
                        <img
                      onClick={() => handleViewDetailproducts(item)}
                          className="image-tiet"
                          src={item.thumbnail}
                          alt="thumbnail"
                        />
                      </td>
                      <td  onClick={() => handleViewDetailproducts(item)}  style={{ lineHeight: '15px', fontSize: '12px' }}>{item.name}</td>
                      
                      <td>
                      {item.quantity}
                      </td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td> 
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </div>

          </div>
          <div className="chi-tiet-cart">
            <div className="title-thanh">Thanh Toán</div>
            <div className="khoi-tiet-cha">
              <MDBTable className="table-tiet" borderless>
                <MDBTableBody>
                  <tr>
                    <td>Tạm tính</td>

                    <th>{totalPrice}</th>
                  </tr>
                  <tr>
                    <td>Tổng tiền</td>

                    <th>{totalPrice}</th>
                  </tr>
                </MDBTableBody>
              </MDBTable>
              {/* Nút "Tiếp tục" sẽ được disabled nếu isChecked là false */}
              <button className="btn-thanh" onClick={Buy} disabled={isContinueButtonDisabled}>Tiếp tục</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;

