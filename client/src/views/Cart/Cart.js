import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  // Lấy dữ liệu từ session
  const initialCart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const [cart, setCart] = useState(initialCart);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Hàm này được gọi khi checkbox thay đổi trạng thái
  const handleCheckboxChange = (productId) => {
    const updatedSelectedProducts = [...selectedProducts];
    const index = updatedSelectedProducts.indexOf(productId);

    if (index === -1) {
      updatedSelectedProducts.push(productId);
    } else {
      updatedSelectedProducts.splice(index, 1);
    }

    setSelectedProducts(updatedSelectedProducts);

    // Lưu trạng thái checkbox vào sessionStorage
    const checkboxData = {
      selectAll,
      selectedProducts: updatedSelectedProducts,
    };
    sessionStorage.setItem('checkboxData', JSON.stringify(checkboxData));
  };

  // Hàm này được gọi khi checkbox "Chọn tất cả" thay đổi trạng thái
  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const allProductIds = cart.map((item) => item.id);
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts([]);
    }

    // Lưu trạng thái selectAll và selectedProducts vào sessionStorage
    const checkboxData = {
      selectAll: newSelectAll,
      selectedProducts: newSelectAll ? cart.map((item) => item.id) : [],
    };
    sessionStorage.setItem('checkboxData', JSON.stringify(checkboxData));
  };

  useEffect(() => {
    // Kiểm tra nếu có dữ liệu trong sessionStorage
    const savedCheckboxData = sessionStorage.getItem('checkboxData');

    if (savedCheckboxData) {
      const { selectAll: savedSelectAll, selectedProducts: savedSelectedProducts } = JSON.parse(savedCheckboxData);
      setSelectAll(savedSelectAll);
      setSelectedProducts(savedSelectedProducts);
    }
  }, []); // Thêm mảng rỗng để chỉ thực hiện khi component được mount



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
    window.location.reload();
  };





  // Hàm tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        // Tăng số lượng sản phẩm lên 1
        item.quantity += 1;
        // Cập nhật tổng tiền của sản phẩm
        item.totalPrice = item.quantity * item.price;
      }
      return item;
    });
    // Cập nhật giỏ hàng
    setCart(updatedCart);
    // Cập nhật tổng tiền
    const total = calculateTotalPrice();
    setTotalPrice(total);

    // Lưu giỏ hàng vào sessionStorage sau khi cập nhật
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Hàm giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        // Giảm số lượng sản phẩm đi 1, nhưng không thấp hơn 1
        item.quantity = Math.max(item.quantity - 1, 1);
        // Cập nhật tổng tiền của sản phẩm
        item.totalPrice = item.quantity * item.price;
      }
      return item;
    });
    // Cập nhật giỏ hàng
    setCart(updatedCart);
    // Cập nhật tổng tiền
    const total = calculateTotalPrice();
    setTotalPrice(total);

    // Lưu giỏ hàng vào sessionStorage sau khi cập nhật
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


  const handleViewDetailProduct = (products) => {
    // Kiểm tra xem 'id' có tồn tại hay không
    if (!products.id) {
      console.error('Product ID is undefined!');
      return;
    }
    // Lấy danh sách các sản phẩm đã xem từ session storage
    const historysp = JSON.parse(sessionStorage.getItem("products")) || [];
    // Tạo đối tượng sản phẩm mới
    const historyproduct = {
      name: products.name,
      price: products.price,
      avatar: products.thumbnail,
      id: products.id,
    };
    // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
    const isViewed = historysp.some(
      (product) => product.name === historyproduct.name
    );
    // Nếu sản phẩm mới chưa được xem
    if (!isViewed) {
      // Thêm đối tượng sản phẩm mới vào cuối danh sách
      historysp.push(historyproduct);
      // Lưu trữ danh sách các sản phẩm đã xem vào session storage
      sessionStorage.setItem("products", JSON.stringify(historysp));
    }

    console.log('click')
    navigate(`/detail/${products.id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);
  // Kiểm tra xem nút "Tiếp tục" có bị disabled hay không
  const isContinueButtonDisabled = selectedProducts.length === 0;
  // Hàm xử lý khi nút "Tiếp tục" được ấn
  const handleContinueClick = () => {
    // Lấy danh sách các sản phẩm được chọn từ giỏ hàng
    const selectedItems = cart.filter((item) => selectedProducts.includes(item.id));

    // Tính tổng tiền của các sản phẩm được chọn
    const total = calculateTotalPrice();

    // Tạo đối tượng chứa thông tin các sản phẩm và tổng tiền
    const buys = {
      selectedItems,
      total,
    };

    // Lưu thông tin vào sessionStorage
    sessionStorage.setItem("buys", JSON.stringify(buys));
    console.log('buys', buys)
    // Chuyển hướng đến trang tiếp theo (ví dụ: trang thanh toán)
    navigate("/buy"); // Điều này đòi hỏi bạn đã cấu hình routing cho trang thanh toán
  };

  return (
    <div>
      <div className="style-2">
        <div className="fle-x">
          <div className="mo-ta">
            <div className="title-mo">Giỏ hàng</div>
            <div className="khoi-tiet-cha">
              <MDBTable borderless>
                <MDBTableHead light>
                  <tr>
                    <th scope="col">
                      <Checkbox
                        onChange={handleSelectAllChange}
                        checked={selectAll}>
                      </Checkbox>
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
                          onClick={() => handleViewDetailProduct(item)}
                          className="image-tiet"
                          src={item.thumbnail}
                          alt="thumbnail"
                        />
                      </td>
                      <td style={{ lineHeight: '15px', fontSize: '12px' }}>{item.name}</td>

                      <td>
                        <div className="quantity-control">
                          <a
                            onClick={() => decreaseQuantity(item.id)}
                            className="quantity-button"
                          >
                            <i class="fa-solid fa-minus"></i>
                          </a>
                          <span>{item.quantity}</span>
                          <a
                            onClick={() => increaseQuantity(item.id)}
                            className="quantity-button"
                          >
                            <i class="fa-solid fa-plus"></i>
                          </a>
                        </div>
                      </td>
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
              <button
                className="btn-thanh"
                disabled={isContinueButtonDisabled}
                onClick={handleContinueClick} // Gọi hàm khi nút được ấn
              >
                Tiếp tục
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;

