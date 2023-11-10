import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Cart.css";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseProduct,
  deleteProductInCart,
  increaseProduct,
} from "../../redux/cartSlice";
import { formatCapacity } from "../../util/formatCapacity";
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}
function Cart() {
  const navigate = useNavigate();
  // Lấy dữ liệu từ session
  const cart = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (productId) => {
    // Kiểm tra xem sản phẩm đã được chọn chưa
    const isSelected = selectedProducts.includes(productId);
    let updatedSelectedProducts;

    if (isSelected) {
      // Nếu sản phẩm đã được chọn, hủy chọn nó
      updatedSelectedProducts = selectedProducts.filter(
        (id) => id !== productId
      );
      setSelectedProducts(updatedSelectedProducts);
    } else {
      // Nếu sản phẩm chưa được chọn, chọn nó và hủy chọn tất cả các sản phẩm khác
      updatedSelectedProducts = [productId];
      setSelectedProducts(updatedSelectedProducts);
      setSelectAll(false);
    }

    // Lưu trạng thái checkbox vào sessionStorage
    const checkboxData = {
      selectAll,
      selectedProducts: updatedSelectedProducts,
    };
    sessionStorage.setItem("checkboxData", JSON.stringify(checkboxData));
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
    sessionStorage.setItem("checkboxData", JSON.stringify(checkboxData));
  };

  useEffect(() => {
    // Kiểm tra nếu có dữ liệu trong sessionStorage
    const savedCheckboxData = sessionStorage.getItem("checkboxData");

    if (savedCheckboxData) {
      const {
        selectAll: savedSelectAll,
        selectedProducts: savedSelectedProducts,
      } = JSON.parse(savedCheckboxData);
      setSelectAll(savedSelectAll);
      setSelectedProducts(savedSelectedProducts);
    }
  }, []); // Thêm mảng rỗng để chỉ thực hiện khi component được mount

  const calculateTotalPrice = () => {
    // Lấy danh sách các sản phẩm được chọn từ danh sách giỏ hàng
    const selectedItems = cart.filter((item) =>
      selectedProducts.includes(item.id)
    );

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
    // xóa trong cart
    dispatch(deleteProductInCart(productId));
  };

  // Hàm tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = (productId) => {
    const data = {
      product_id: productId,
    };
    dispatch(increaseProduct(data));
    // Cập nhật tổng tiền
    const total = calculateTotalPrice();
    setTotalPrice(total);
  };
  // Hàm giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = (productId) => {
    const data = {
      product_id: productId,
    };
    // Cập nhật giỏ hàng
    dispatch(decreaseProduct(data));
    // Cập nhật tổng tiền
    const total = calculateTotalPrice();
    setTotalPrice(total);
  };

  // const [selectedItems, setSelectedItems] = useState([]);
  // const [sortedCart, setSortedCart] = useState([]); // Thêm state để lưu dữ liệu đã được sắp xếp
  const [totalPrice, setTotalPrice] = useState(0);
  const handleViewDetailProduct = (products) => {
    // Kiểm tra xem 'id' có tồn tại hay không
    if (!products.id) {
      console.error("Product ID is undefined!");
      return;
    }
    // Lấy danh sách các sản phẩm đã xem từ session storage
    const historysp = JSON.parse(sessionStorage.getItem("products")) || [];
    // Tạo đối tượng sản phẩm mới

    // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
    const isViewed = historysp.some(
      (product) => product.name === products.name
    );
    // Nếu sản phẩm mới chưa được xem
    if (!isViewed) {
      // Thêm đối tượng sản phẩm mới vào cuối danh sách
      historysp.push(products);
      // Lưu trữ danh sách các sản phẩm đã xem vào session storage
      sessionStorage.setItem("products", JSON.stringify(historysp));
    }
    navigate(`/detail/${products.id}`);
  };

  useEffect(() => {
  }, []);
  // Kiểm tra xem nút "Tiếp tục" có bị disabled hay không
  const isContinueButtonDisabled = selectedProducts.length === 0;
  // Hàm xử lý khi nút "Tiếp tục" được ấn
  const handleContinueClick = () => {
    // Lấy danh sách các sản phẩm được chọn từ giỏ hàng
    const selectedItems = cart.filter((item) =>
      selectedProducts.includes(item.id)
    );
    // Tính tổng tiền của các sản phẩm được chọn
    const total = calculateTotalPrice();
    // Tạo đối tượng chứa thông tin các sản phẩm và tổng tiền
    const buys = {
      selectedItems,
      total,
    };
    // Lưu thông tin vào sessionStorage
    sessionStorage.setItem("buys", JSON.stringify(buys));
    // Chuyển hướng đến trang tiếp theo (ví dụ: trang thanh toán)
    navigate("/buy"); // Điều này đòi hỏi bạn đã cấu hình routing cho trang thanh toán
  };

  return (
    <div>
      <div className="style-cart">
        <div className="fle-x">
          <div className="mo-ta">
            <div className="title-mo">Giỏ hàng</div>
            <div className="khoi-tiet-cha">
              <MDBTable borderless>
                <MDBTableHead light>
                  <tr>
                    <th scope="col">
                      {/* <Checkbox
                        onChange={handleSelectAllChange}
                        checked={selectAll}>
                      </Checkbox> */}
                    </th>
                    <th scope="col">Hình</th>
                    <th scope="col">Sản Phẩm</th>
                    <th style={{ textAlign: "right" }} scope="col">
                      Đơn giá
                    </th>
                    <th style={{ textAlign: "center" }} scope="col">
                      Số lượng
                    </th>
                    <th style={{ textAlign: "right" }} scope="col">
                      Thành tiền
                    </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {[...cart].reverse().map((item, index) => (
                    <tr key={index}>
                      {/* checkbox */}
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </td>
                      {/* image */}
                      <td style={{ width: "15%" }}>
                        <img
                          onClick={() => handleViewDetailProduct(item)}
                          className="image-tiet"
                          src={
                            item.main_image
                              ? process.env.REACT_APP_API_URL + item.main_image
                              : process.env.REACT_APP_API_URL + item.thumbnail
                          }
                          alt="main_image"
                        />
                      </td>
                      {/* description */}
                      <td>
                        <p className="cart-description-content">
                          {item.shortDescription}
                        </p>
                        <p className="cart-description-SKU">SKU: {item.id}</p>
                        <p className="cart-description-rom-color">
                          {" "}
                          {item?.capacity?.capacity &&
                            formatCapacity(item?.capacity?.capacity) + ","}{" "}
                          {item?.color}
                        </p>
                      </td>
                      {/* Đơn giá */}
                      <td style={{ textAlign: "right" }}>
                        <p
                          style={{
                            margin: "0",
                            fontWeight: "700",
                            color: "black",
                          }}
                        >
                          {formatCurrency(
                            item.capacity.capacity_price - item.discount
                          )}
                        </p>
                        {/* show discount */}
                        {item.discount > 0 && (
                          <p
                            style={{
                              margin: "0",
                              textDecoration: "line-through",
                              fontSize: "12px",
                            }}
                          >
                            {formatCurrency(item.capacity.capacity_price)}
                          </p>
                        )}
                      </td>
                      {/* quantity */}
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <div className="quantity-control">
                          <Link
                            onClick={() => decreaseQuantity(item.id)}
                            className="quantity-button"
                          >
                            <i className="fa-solid fa-minus"></i>
                          </Link>
                          <span>{item.quantity}</span>
                          <Link
                            onClick={() => increaseQuantity(item.id)}
                            className="quantity-button"
                          >
                            <i className="fa-solid fa-plus"></i>
                          </Link>
                        </div>
                      </td>
                      {/* Thành tiền */}
                      <td
                        style={{
                          margin: "0",
                          fontWeight: "700",
                          color: "black",
                          textAlign: "right",
                        }}
                      >
                        {formatCurrency(item.totalPrice)}
                      </td>
                      {/* btn delete product */}
                      <td>
                        <Link onClick={() => removeFromCart(item.id)}>
                          <i className="fa-solid fa-xmark"></i>
                        </Link>
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
