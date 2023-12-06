import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Modal, Button } from "antd";
import {
  ExclamationCircleFilled,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import axios from "axios";

import "./Cart.css";
import {
  decreaseProduct,
  deleteProductInCart,
  increaseProduct,
  updateProductCart,
} from "../../redux/cartSlice";
import { formatCapacity } from "../../util/formatCapacity";
import { formatCurrency } from "../../util/FormatVnd";
import { addToRecentlyViewedProduct } from "../../util/servicesGlobal";
import EmptyCart from "./EmptyCart ";

const { confirm } = Modal;

function Cart() {
  const navigate = useNavigate();
  // Lấy dữ liệu từ redux
  const cart = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  const [productsOfCartBD, setProductOfCartDB] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [arrDisable, setArrDisable] = useState([]);
  const [checkQuantityChange, setCheckQuantityChange] = useState(false);
  const [checkProductDelete, setCheckProductDelete] = useState(false);

  // Hàm show modal delete product
  const showDeleteConfirm = (productId, color, capacity) => {
    confirm({
      title: "Bạn chắc chắn muốn bỏ sản phẩm này?",
      icon: <ExclamationCircleFilled />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Trở lại",
      centered: true,
      onOk() {
        removeFromCart(productId, color, capacity);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Hàm show modal auto change quantity
  const showAutoChangeQuantity = (title, content) => {
    confirm({
      title: title || "Thông báo!",
      icon: <ExclamationCircleFilled />,
      content:
        content ||
        "Chúng tôi đã điều chỉnh lại số lượng một số sản phẩm do số lượng sản phẩm còn lại không đủ so với số lượng trong giỏ hàng của bạn",
      centered: true,
      footer: false,
      maskClosable: true,
    });
  };

  const checkDisable = (arrDisable, productId, color, capacity) => {
    const result = [...arrDisable].some(
      (item) =>
        item.productId === productId &&
        item.color === color &&
        item.capacity === capacity
    );
    return result;
  };

  // Set disable Button (+) sp to cart when start
  useEffect(() => {
    if (productsOfCartBD.length !== 0 && cart.length !== 0) {
      [...productsOfCartBD].forEach((product) => {
        [...cart].forEach((item) => {
          if (
            product.id === item.id &&
            product.variations.color === item.color &&
            product.variations.capacity === item.capacity &&
            product.variations.remaining_quantity_variant === item.quantity
          ) {
            // Kiểm tra xem btn có đang bị tắt không
            if (!checkDisable(arrDisable, item.id, item.color, item.capacity)) {
              // Nếu không bị tắt thì thực hiện tắt
              setArrDisable((prevArrDisable) => [
                ...prevArrDisable,
                {
                  productId: item.id,
                  color: item.color,
                  capacity: item.capacity,
                },
              ]);
            }
          } else if (
            product.id === item.id &&
            product.variations.color === item.color &&
            product.variations.capacity === item.capacity &&
            product.variations.remaining_quantity_variant > item.quantity
          ) {
            // Kiểm tra xem btn có đang bị tắt không
            if (checkDisable(arrDisable, item.id, item.color, item.capacity)) {
              const newArr = arrDisable.filter(
                (v) =>
                  !(
                    v.productId === item.id &&
                    v.color === item.color &&
                    v.capacity === item.capacity
                  )
              );
              setArrDisable(newArr);
            }
          }
        });
      });
    }
  }, [productsOfCartBD, cart]);

  // Bật thông báo nếu có sản phẩm trong giỏ hàng không còn tồn tại
  // và đã được tự động xóa khỏi giỏ hàng
  useEffect(() => {
    if (checkProductDelete) {
      const content =
        "Có một vài sản phẩm trong giỏ hàng không còn được kinh doanh và đã được tự động xóa khỏi giỏ hàng";
      showAutoChangeQuantity(null, content);
      setCheckQuantityChange(false);
    }
  }, [checkProductDelete]);

  // Bật thông báo nếu số lượng còn lại ít hơn trong giỏ hàng
  // và đã cập nhật số lượng trong giỏ hàng bằng số lượng còn lại
  useEffect(() => {
    if (checkQuantityChange) {
      showAutoChangeQuantity();
      setCheckQuantityChange(false);
    }
  }, [checkQuantityChange]);

  useEffect(() => {
    updateCart();
  }, [cart]);

  // cập nhật giỏ hàng khi onClick to Cart
  const updateCart = async () => {
    try {
      if (cart.length === 0) return;
      let arrId = [];
      if (cart.length > 0) {
        for (let i = 0; i < cart.length; i++) {
          const data = {
            product_id: cart[i].id,
            capacity: cart[i].capacity,
            color: cart[i].color,
          };
          arrId.push(data);
        }
      }
      const api = `${process.env.REACT_APP_API_URL}/product/cart`;
      await axios.post(api, arrId).then((results) => {
        // Xử lí nếu có sản phẩm không còn tồn tại
        const products = [];
        const productsIdOut = [];
        // Lặp qua từng id sản phẩm trong giỏ hàng
        arrId.forEach((arrIdItem) => {
          // Tìm những sản phẩm tương ứng trong giỏ hàng
          const productsFinded = [...results.data].find(
            (i) =>
              i?.id === arrIdItem.product_id &&
              i?.variations.color === arrIdItem.color &&
              i?.variations.capacity === arrIdItem.capacity
          );
          // Kiểm tra sản phẩm còn và bị xóa
          if (productsFinded) {
            // Nếu có thì push vào mảng products
            products.push(productsFinded);
          } else {
            // Nếu sản phẩm bị xóa thì thêm id vào mảng productsIdOut
            productsIdOut.push(arrIdItem);
          }
        });
        // Xử lí bỏ sản phẩm bị xóa khỏi giỏ hàng
        // Lặp qua từng id sản phẩm bị xóa
        if (productsIdOut.length !== 0) {
          productsIdOut.forEach((value) => {
            dispatch(deleteProductInCart(value));
            setCheckProductDelete(true);
          });
        }
        // Xử lí cập nhật sản phẩm còn lại
        setProductOfCartDB(products);
        for (let i = 0; i < products.length; i++) {
          const newItem = {
            id: products[i].id,
            main_image: products[i].main_image,
            shortDescription: products[i].shortDescription,
            capacity: products[i].variations.capacity,
            color: products[i].variations.color,
            price: products[i].variations.price,
            discount: products[i].variations.discount_amount,
            thumbnail: products[i].images[0],
            brand: products[i].brand,
            remaining_quantity:
              products[i].variations.remaining_quantity_variant,
          };
          [...cart].forEach((product) => {
            if (
              product.id === newItem.id &&
              product.color === newItem.color &&
              product.capacity === newItem.capacity &&
              product.quantity > newItem.remaining_quantity
            ) {
              setCheckQuantityChange(true);
            }
          });

          // Cập nhật giỏ hàng tại redux
          dispatch(updateProductCart(newItem));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = (productId, color, capacity) => {
    // Kiểm tra xem sản phẩm đã được chọn chưa
    const isSelected = selectedProducts.some(
      (product) =>
        product.id === productId &&
        product.color === color &&
        product.capacity === capacity
    );

    let updatedSelectedProducts;

    if (isSelected) {
      updatedSelectedProducts = selectedProducts.filter(
        (product) =>
          !(
            product.id === productId &&
            product.color === color &&
            product.capacity === capacity
          )
      );
    } else {
      updatedSelectedProducts = [
        ...selectedProducts,
        { id: productId, color, capacity },
      ];
    }

    setSelectedProducts(updatedSelectedProducts);
    // Kiểm tra xem tất cả sản phẩm đã được chọn hay chưa
    const allProductsSelected = cart.every((item) =>
      updatedSelectedProducts.some(
        (product) =>
          product.id === item.id &&
          product.color === item.color &&
          product.capacity === item.capacity
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

  // Hàm tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = async (productId, color, capacity) => {
    updateCart();
    const data = {
      product_id: productId,
      color,
      capacity,
    };
    dispatch(increaseProduct(data));
    // Cập nhật tổng tiền
    const total = calculateTotalPrice();
    setTotalPrice(total);
    // const url = `${process.env.REACT_APP_API_URL}/product/${productId}/variant`;
    // await axios
    //   .post(url, data, { withCredentials: true })
    //   .then((results) => {
    //     const remaining_quantity = results.data[0].remaining_quantity_variant;
    //     const cartToUpdate = [...cart].find(
    //       (product) =>
    //         product.id === productId &&
    //         product.color === color &&
    //         product.capacity === capacity
    //     );
    //     if (cartToUpdate && remaining_quantity) {
    //       if (remaining_quantity - cartToUpdate.quantity > 1) {

    //       } else if (remaining_quantity - cartToUpdate.quantity === 1) {
    //         dispatch(increaseProduct(data));
    //         // Cập nhật tổng tiền
    //         const total = calculateTotalPrice();
    //         setTotalPrice(total);
    //         // setIsDisableIncreaseQuantity(true);
    //         const dataDisable = [...arrDisable];
    //         dataDisable.push({ productId, color, capacity });
    //         setArrDisable(dataDisable);
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  // Hàm giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = async (productId, color, capacity) => {
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
      // const url = `${process.env.REACT_APP_API_URL}/product/${productId}/variant`;
      // await axios
      //   .post(url, data, { withCredentials: true })
      //   .then((results) => {
      //     const remaining_quantity = results.data[0].remaining_quantity_variant;
      //     if (cartToUpdate && remaining_quantity) {
      //       // Cập nhật giỏ hàng
      //       dispatch(decreaseProduct(data));
      //       // Cập nhật tổng tiền
      //       const total = calculateTotalPrice();
      //       setTotalPrice(total);
      //       if (remaining_quantity - (cartToUpdate.quantity - 1) === 0) {
      //         // Nếu sản phẩm còn lại bằng sản phẩm trong giỏ hàng
      //         // Thực hiện tắt btn
      //         const dataDisable = [...arrDisable];
      //         dataDisable.push({ productId, color, capacity });
      //         setArrDisable(dataDisable);
      //       } else if (remaining_quantity - (cartToUpdate.quantity - 1) > 0) {
      //         // Nếu sản phẩm còn lại lớn hơn sản phẩm trong giỏ hàng
      //         // Thực hiện bật btn
      //         const dataDisable = [...arrDisable];
      //         // Kiểm tra xem btn có đang bị tắt không
      //         if (checkDisable(dataDisable, productId, color, capacity)) {
      //           const newData = dataDisable.find(
      //             (item) =>
      //               item.productId !== productId &&
      //               item.color !== color &&
      //               item.capacity !== capacity
      //           );
      //           if (newData) {
      //             setArrDisable([newData]);
      //           } else {
      //             setArrDisable([]);
      //           }
      //         }
      //       }
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    }
  };

  // const [selectedItems, setSelectedItems] = useState([]);
  // const [sortedCart, setSortedCart] = useState([]); // Thêm state để lưu dữ liệu đã được sắp xếp
  const [totalPrice, setTotalPrice] = useState(0);
  const handleViewDetailProduct = (products) => {
    addToRecentlyViewedProduct(products);
    navigate(`/detail/${products.id}`);
  };

  useEffect(() => {}, []);
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

  const styleFlexColumn = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
                        <th style={{ textAlign: "right" }} scope="col"></th>
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
                                  ? process.env.REACT_APP_API_URL +
                                    item.main_image
                                  : process.env.REACT_APP_API_URL +
                                    item.thumbnail
                              }
                              alt="main_image"
                            />
                          </td>
                          {/* description */}
                          <td style={styleFlexColumn}>
                            <p className="cart-description-content">
                              {item.shortDescription}
                            </p>
                            <p className="cart-description-SKU">
                              SKU: {item.id}
                            </p>
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
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div className="quantity-control">
                              <Button
                                icon={<MinusOutlined />}
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id,
                                    item.color,
                                    item.capacity
                                  )
                                }
                                id="quantity-button"
                              />
                              <span style={{ fontWeight: "bold" }}>
                                {item.quantity}
                              </span>
                              <Button
                                disabled={checkDisable(
                                  arrDisable,
                                  item.id,
                                  item.color,
                                  item.capacity
                                )}
                                icon={<PlusOutlined />}
                                onClick={() =>
                                  increaseQuantity(
                                    item.id,
                                    item.color,
                                    item.capacity
                                  )
                                }
                                id="quantity-button"
                              />
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
                                removeFromCart(
                                  item.id,
                                  item.color,
                                  item.capacity
                                )
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
          ) : (
            <EmptyCart />
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
