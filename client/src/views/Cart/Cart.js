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
function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
function Cart() {

  // Lấy dữ liệu từ session
 const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem("cart")) || []);
  const [selectedProducts, setSelectedProducts] = useState([]);
  // Hàm này được gọi khi checkbox thay đổi trạng thái
  const handleCheckboxChange = (productId) => {
    const updatedSelectedProducts = [...selectedProducts];
    const index = updatedSelectedProducts.indexOf(productId);

    if (index === -1) {
      // Nếu sản phẩm chưa được chọn, thêm vào danh sách các sản phẩm được chọn
      updatedSelectedProducts.push(productId);
    } else {
      // Nếu sản phẩm đã được chọn, loại bỏ khỏi danh sách các sản phẩm được chọn
      updatedSelectedProducts.splice(index, 1);
    }

    // Cập nhật danh sách các sản phẩm được chọn
    setSelectedProducts(updatedSelectedProducts);
  };
 

  

  const calculateTotalPrice = () => {
    // Lấy danh sách các sản phẩm được chọn từ danh sách giỏ hàng
    const selectedItems = cart.filter((item) => selectedProducts.includes(item.id));

    // Tính tổng tiền của các sản phẩm được chọn
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

  //xóa sp
  const removeFromCart = (productId) => {
    // Tìm sản phẩm cần xóa trong giỏ hàng
    const updatedCart = cart.filter((item) => item.id !== productId);
    
    // Cập nhật danh sách giỏ hàng
    setCart(updatedCart);
    
    // Cập nhật danh sách sản phẩm được chọn (nếu sản phẩm bị xóa đang được chọn)
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((productId) => productId !== productId)
    );
  
    // Lưu danh sách giỏ hàng đã cập nhật vào session
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  


  const [selectedItems, setSelectedItems] = useState([]);
  const [sortedCart, setSortedCart] = useState([]); // Thêm state để lưu dữ liệu đã được sắp xếp

  // useEffect(() => {
  //   // Sắp xếp dữ liệu sản phẩm theo thời gian mới nhất đầu tiên
  //   const sortedProducts = [...cart].sort((a, b) => {
  //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   });
  //   setSortedCart(sortedProducts);
  // }, [cart]);

  const [totalPrice, setTotalPrice] = useState(0);

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
  // Kiểm tra xem nút "Tiếp tục" có bị disabled hay không
  const isContinueButtonDisabled = selectedProducts.length === 0;
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
                          className="image-tiet"
                          src={item.thumbnail}
                          alt="thumbnail"
                        />
                      </td>
                      <td style={{ lineHeight: '15px', fontSize: '12px' }}>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.totalPrice)}</td>
                      <td>
                        <a onClick={() => removeFromCart(item.id)}>
                        <i class="fa-solid fa-xmark"></i>
                        </a>
                      </td>
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

                    <th>{formatCurrency(totalPrice)}</th>
                  </tr>
                  <tr>
                    <td>Tổng tiền</td>

                    <th>{formatCurrency(totalPrice)}</th>
                  </tr>
                </MDBTableBody>
              </MDBTable>
              {/* Nút "Tiếp tục" sẽ được disabled nếu isChecked là false */}
              <button className="btn-thanh" disabled={isContinueButtonDisabled}>Tiếp tục</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;

