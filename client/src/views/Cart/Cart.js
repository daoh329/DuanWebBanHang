import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import "./Cart.css";
import {
  decreaseProduct,
  deleteProductInCart,
  increaseProduct,
} from "../../redux/cartSlice";
import { formatCapacity } from "../../util/formatCapacity";
import { formatCurrency } from "../../util/FormatVnd";
import { addToRecentlyViewedProduct } from "../../util/servicesGlobal";
import EmptyCart from "./EmptyCart ";

const { confirm } = Modal;

function Cart() {
  const navigate = useNavigate();
  // Lấy dữ liệu từ session
  const cart = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (productId, color, capacity) => {
    // Kiểm tra xem sản phẩm đã được chọn chưa
    const isSelected = selectedProducts.some(product =>
      product.id === productId && product.color === color && product.capacity === capacity
    );

    let updatedSelectedProducts;

    if (isSelected) {
      updatedSelectedProducts = selectedProducts.filter(
        product => !(product.id === productId && product.color === color && product.capacity === capacity)
      );
    } else {
      updatedSelectedProducts = [...selectedProducts, { id: productId, color, capacity }];
    }

    setSelectedProducts(updatedSelectedProducts);

    // Kiểm tra xem tất cả sản phẩm đã được chọn hay chưa
    const allProductsSelected = cart.every(item =>
      updatedSelectedProducts.some(product =>
        product.id === item.id && product.color === item.color && product.capacity === item.capacity
      )
    );

    setSelectAll(allProductsSelected);

    // Lưu trạng thái checkbox vào sessionStorage
    const checkboxData = {
      selectAll: allProductsSelected,
      selectedProducts: updatedSelectedProducts,
    };
    sessionStorage.setItem("checkboxData", JSON.stringify(checkboxData));
  };


  // Hàm này được gọi khi checkbox "Chọn tất cả" thay đổi trạng thái
  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const allProducts = cart.map((item) => ({
        id: item.id,
        color: item.color,
        capacity: item.capacity,
      }));
      setSelectedProducts(allProducts);
    } else {
      setSelectedProducts([]);
    }

    // Lưu trạng thái selectAll và selectedProducts vào sessionStorage
    const checkboxData = {
      selectAll: newSelectAll,
      selectedProducts: newSelectAll
        ? cart.map((item) => ({
          id: item.id,
          color: item.color,
          capacity: item.capacity,
        }))
        : [],
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
      setSelectedProducts(
        savedSelectedProducts.map((product) => ({
          id: product.id,
          color: product.color,
          capacity: product.capacity,
        }))
      );
    }
  }, []); // Thêm mảng rỗng để chỉ thực hiện khi component được mount

  const calculateTotalPrice = () => {
    // Lấy danh sách các sản phẩm được chọn từ danh sách giỏ hàng
    const selectedItems = cart.filter((item) =>
      selectedProducts.some(
        (product) =>
          product.id === item.id &&
          product.color === item.color &&
          product.capacity === item.capacity
      )
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
  const removeFromCart = (productId, color, capacity) => {
    const data = {
      product_id: productId,
      color,
      capacity,
    };
    dispatch(deleteProductInCart(data));
  };

  // Hàm show modal
  const showDeleteConfirm = (productId, color, capacity) => {
    confirm({
      title: "Bạn chắc chắn muốn bỏ sản phẩm này?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        removeFromCart(productId, color, capacity);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Hàm tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = (productId, color, capacity) => {
    const data = {
      product_id: productId,
      color,
      capacity,
    };
    dispatch(increaseProduct(data));
    // Cập nhật tổng tiền
    const total = calculateTotalPrice();
    setTotalPrice(total);
  };

  // Hàm giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = (productId, color, capacity) => {
    const cartToUpdate = [...cart].find(
      (product) =>
        product.id === productId &&
        product.color === color &&
        product.capacity === capacity
    );
    if (cartToUpdate.quantity <= 1) {
      showDeleteConfirm(productId, color, capacity);
      return;
    } else if (cartToUpdate.quantity > 1) {
      const data = {
        product_id: productId,
        color,
        capacity,
      };
      // Cập nhật giỏ hàng
      dispatch(decreaseProduct(data));
      // Cập nhật tổng tiền
      const total = calculateTotalPrice();
      setTotalPrice(total);
    }
  };

  // const [selectedItems, setSelectedItems] = useState([]);
  // const [sortedCart, setSortedCart] = useState([]); // Thêm state để lưu dữ liệu đã được sắp xếp
  const [totalPrice, setTotalPrice] = useState(0);
  const handleViewDetailProduct = (products) => {
    addToRecentlyViewedProduct(products);
    navigate(`/detail/${products.id}`);
  };

  useEffect(() => { }, []);
  // Kiểm tra xem nút "Tiếp tục" có bị disabled hay không
  const isContinueButtonDisabled = selectedProducts.length === 0;
  // Hàm xử lý khi nút "Tiếp tục" được ấn
  const handleContinueClick = () => {
    // Lấy danh sách các sản phẩm được chọn từ giỏ hàng
    const selectedItems = cart.filter((item) =>
      selectedProducts.some(
        (product) =>
          product.id === item.id &&
          product.color === item.color &&
          product.capacity === item.capacity
      )
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
        <div className="fle-x-cart">
          {cart.length > 0 ? (
            <>

              <div className="mo-ta-cart">
                <div className="title-mo-cart">Giỏ hàng</div>
                <div className="khoi-tiet-cha-cart">
                  <MDBTable borderless>
                    <MDBTableHead light>
                      <tr>
                        <th scope="col">
                          <Checkbox
                            onChange={handleSelectAllChange}
                            checked={selectAll}
                          ></Checkbox>
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
                        <th style={{ textAlign: "right" }} scope="col">
                          
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
                              checked={selectedProducts.some(
                                (product) =>
                                  product.id === item.id &&
                                  product.color === item.color &&
                                  product.capacity === item.capacity
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  item.id,
                                  item.color,
                                  item.capacity
                                )
                              }
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
                              {item?.capacity &&
                                formatCapacity(item?.capacity) + ","}{" "}
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
                              {formatCurrency(item.price - item.discount)}
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
                                {formatCurrency(item.price)}
                              </p>
                            )}
                          </td>
                          {/* quantity */}
                          <td style={{ display: "flex", justifyContent: "center" }}>
                            <div className="quantity-control">
                              <Link
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id,
                                    item.color,
                                    item.capacity
                                  )
                                }
                                className="quantity-button"
                              >
                                <i className="fa-solid fa-minus"></i>
                              </Link>
                              <span>{item.quantity}</span>
                              <Link
                                onClick={() =>
                                  increaseQuantity(
                                    item.id,
                                    item.color,
                                    item.capacity
                                  )
                                }
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
                            <Link
                              onClick={() =>
                                removeFromCart(item.id, item.color, item.capacity)
                              }
                            >
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
                <div className="khoi-tiet-cha-cart">
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
                    <a>Tiếp tục</a>
                  </button>
                </div>
              </div>
            </>
          ) : (<EmptyCart />)}
        </div>
      </div>
    </div>
  );
}

export default Cart;  