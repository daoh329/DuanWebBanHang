import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Modal, Button, Input, Tooltip } from "antd";
import {
  ExclamationCircleFilled,
  PlusOutlined,
  MinusOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import axios from "axios";

import "./Cart.css";
import {
  addProductToCart,
  decreaseProduct,
  deleteProductInCart,
  increaseProduct,
  updateProductCart,
} from "../../redux/cartSlice";
import { formatCapacity } from "../../util/formatCapacity";
import { formatCurrency } from "../../util/FormatVnd";
import { addToRecentlyViewedProduct } from "../../util/servicesGlobal";
import EmptyCart from "./EmptyCart ";
import { formatDateToDate } from "../../util/formatData";

const { confirm, info, config } = Modal;

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
  const showDeleteConfirm = (productId, color, capacity, coupons) => {
    confirm({
      title: "Chú ý",
      icon: <ExclamationCircleFilled />,
      content: "Bạn chắc chắn muốn bỏ sản phẩm này?",
      okText: "Đồng ý",
      okType: "primary",
      cancelText: "Hủy bỏ",
      centered: true,
      onOk() {
        removeFromCart(productId, color, capacity, coupons);
      },
      style: {
        overflow: "hidden",
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
        "Có một vài sản phẩm trong giỏ hàng đã hết hàng hoặc không còn được kinh doanh và đã được tự động xóa khỏi giỏ hàng";
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
    // Nếu chưa cập nhật, thực hiện cập nhật cart và đánh dấu đã cập nhật
    if (cart) {
      updateCart();
    }
  }, []);

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
          if (
            !arrId.some(
              (item) =>
                item.product_id === data.product_id &&
                item.capacity === data.capacity &&
                item.color === data.color
            )
          ) {
            arrId.push(data);
          }
        }
      }
      const api = `${process.env.REACT_APP_API_URL}/product/cart`;
      await axios.post(api, arrId).then((results) => {
        // console.log(arrId);
        // return;
        // Xử lí nếu có sản phẩm không còn tồn tại
        const products = [];
        const productsIdOut = [];
        // Lặp qua từng sản phẩm trong giỏ hàng
        arrId.forEach((arrIdItem) => {
          // Tìm những sản phẩm tương ứng trong giỏ hàng
          const productsFinded = [...results.data].find(
            (i) =>
              i?.id === arrIdItem.product_id &&
              i?.variations.color === arrIdItem.color &&
              i?.variations.capacity === arrIdItem.capacity &&
              i?.variations.remaining_quantity_variant > 0
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
        // return;
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
            allCoupons: products[i]?.coupons || [],
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

  const handleCheckboxChange = (productId, color, capacity, coupons) => {
    // Kiểm tra xem sản phẩm đã được chọn chưa
    const isSelected = selectedProducts.some(
      (product) =>
        product.id === productId &&
        product.color === color &&
        product.capacity === capacity &&
        product.coupons?.id === coupons?.id
    );

    let updatedSelectedProducts;

    if (isSelected) {
      updatedSelectedProducts = selectedProducts.filter(
        (product) =>
          !(
            product.id === productId &&
            product.color === color &&
            product.capacity === capacity &&
            product.coupons.id === coupons.id
          )
      );
    } else {
      updatedSelectedProducts = [
        ...selectedProducts,
        { id: productId, color, capacity, coupons },
      ];
    }

    setSelectedProducts(updatedSelectedProducts);
    // Kiểm tra xem tất cả sản phẩm đã được chọn hay chưa
    const allProductsSelected = cart.every((item) =>
      updatedSelectedProducts.some(
        (product) =>
          product.id === item.id &&
          product.color === item.color &&
          product.capacity === item.capacity &&
          product.coupons?.id === item.coupons?.id
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
        coupons: item.coupons,
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
            coupons: item.coupons,
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
      // setSelectAll(savedSelectAll);
      setSelectedProducts(savedSelectedProducts);

      // Kiểm tra xem tất cả sản phẩm đã được chọn hay chưa
      const allProductsSelected = cart.every((item) =>
        savedSelectedProducts.some(
          (product) =>
            product.id === item.id &&
            product.color === item.color &&
            product.capacity === item.capacity &&
            product.coupons?.id === item.coupons?.id
        )
      );
      setSelectAll(allProductsSelected);
      // Lưu trạng thái checkbox vào sessionStorage
      const checkboxData = {
        selectAll: allProductsSelected,
        selectedProducts: savedSelectedProducts,
      };
      sessionStorage.setItem("checkboxData", JSON.stringify(checkboxData));
    }
  }, [cart]);

  // const calculateTotalPrice = () => {
  //   // Lấy danh sách các sản phẩm được chọn từ danh sách giỏ hàng
  //   const selectedItems = cart.filter((item) =>
  //     selectedProducts.some(
  //       (product) =>
  //         product.id === item.id &&
  //         product.color === item.color &&
  //         product.capacity === item.capacity
  //       // && product.coupons?.id === item.coupons?.id
  //     )
  //   );
  //   // Tính tổng tiền của các sản phẩm được chọn
  //   const total = selectedItems.reduce((acc, item) => {
  //     return acc + item.totalPrice;
  //   }, 0);

  //   return total;
  // };

  const calculateTotalPrice = () => {
    // Lấy danh sách các sản phẩm được chọn từ danh sách giỏ hàng
    const selectedItems = cart.filter((item) =>
      selectedProducts.some(
        (product) =>
          product.id === item.id &&
          product.color === item.color &&
          product.capacity === item.capacity &&
          product.coupons.id === item.coupons.id
      )
    );
    // Tính tổng tiền của các sản phẩm được chọn
    let total = 0;
    for (let i = 0; i < selectedItems.length; i++) {
      total += selectedItems[i].totalPrice;
    }

    return total;
  };

  useEffect(() => {
    // Tính tổng tiền của các sản phẩm được chọn
    const total = calculateTotalPrice();
    // Cập nhật biến state tổng tiền
    setTotalPrice(total);
  }, [selectedProducts, cart]);

  //xóa sp
  const removeFromCart = (productId, color, capacity, coupons) => {
    // Kiểm tra xem sản phẩm đã được chọn chưa
    const isSelected = selectedProducts.some(
      (product) =>
        product.id === productId &&
        product.color === color &&
        product.capacity === capacity &&
        product.coupons?.id === coupons?.id
    );
    var newSelectedProducts = [...selectedProducts];
    if (isSelected) {
      newSelectedProducts = [...selectedProducts].filter(
        (product) =>
          !(
            product.id === productId &&
            product.color === color &&
            product.capacity === capacity &&
            product.coupons?.id === coupons?.id
          )
      );
      setSelectedProducts(newSelectedProducts);
    }
    const data = {
      product_id: productId,
      color,
      capacity,
      coupons,
    };
    dispatch(deleteProductInCart(data));

    // Lưu trạng thái checkbox vào sessionStorage
    const checkboxData = {
      selectAll: selectAll,
      selectedProducts: newSelectedProducts,
    };
    sessionStorage.setItem("checkboxData", JSON.stringify(checkboxData));

    updateCart();
  };

  // Hàm tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = async (productId, color, capacity, coupons) => {
    updateCart();
    // return;
    const data = {
      product_id: productId,
      color,
      capacity,
      coupons,
    };
    dispatch(increaseProduct(data));
    // Cập nhật tổng tiền
    const total = calculateTotalPrice();
    setTotalPrice(total);
  };

  // Hàm giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = async (productId, color, capacity, coupons) => {
    updateCart();
    const cartToUpdate = [...cart].find(
      (product) =>
        product.id === productId &&
        product.color === color &&
        product.capacity === capacity &&
        product?.coupons?.id === coupons?.id
    );
    if (cartToUpdate.quantity <= 1) {
      showDeleteConfirm(productId, color, capacity, coupons);
      return;
    } else if (cartToUpdate.quantity > 1) {
      const data = {
        product_id: productId,
        color,
        capacity,
        coupons,
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
    // console.log(products);
    // return;
    addToRecentlyViewedProduct(products);
    navigate(`/detail/${products.id}`, {
      state: { capacity: products.capacity, color: products.color },
    });
  };

  // Kiểm tra xem nút "Tiếp tục" có bị disabled hay không
  const isContinueButtonDisabled =
    selectedProducts.length === 0 || totalPrice === 0;

  // Hàm xử lý khi nút "Tiếp tục" được ấn
  const handleContinueClick = () => {
    // Lấy danh sách các sản phẩm được chọn từ giỏ hàng
    const selectedItems = cart.filter((item) =>
      selectedProducts.some(
        (product) =>
          product.id === item.id &&
          product.color === item.color &&
          product.capacity === item.capacity &&
          product.coupons?.id === item.coupons?.id
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

  const handleBlurQuantity = (value) => {
    // console.log("Blur: ", value);
  };

  // Lấy thông tin khuyến mãi của sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponSelected, setCouponSelected] = useState({});
  const [otherCouponSelected, setOtherCouponSelected] = useState([]);
  const [couponsCurrenClicked, setCouponsCurrenClicked] = useState([]);
  const [productClicked, setProductClicked] = useState(null);

  const hanldeSelectCoupons = (product, coupons, otherCoupons) => {
    setCouponSelected(coupons);
    setOtherCouponSelected(otherCoupons);
    if (Object.keys(coupons).length !== 0) {
      setCouponsCurrenClicked(() => [...otherCoupons, coupons]);
    } else {
      setCouponsCurrenClicked([...otherCoupons]);
    }
    setProductClicked(product);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // Nếu khuyến mãi được chọn khác với khuyến mãi trước đó thì mới thực hiện thay đổi
    if (productClicked.coupons.id !== couponSelected.id) {
      // Thực hiện thay đổi khuyến mãi
      // Lặp qua cart tìm sản phẩm muốn thay đổi và gán giá trị cuối cùng cho biến mới (newCart)
      const newCart = [...cart].map((item) => {
        if (
          item.id === productClicked.productId &&
          item.color === productClicked.color &&
          item.capacity === productClicked.capacity &&
          item.coupons.id === productClicked.coupons.id
        ) {
          // Nếu tìm thấy sản phẩm cần thay đổi
          // Tạo lại thuộc tính otherCoupons
          var otherCoupons; // Biến chứa các coupons không được chọn mới
          if (item.coupons.id) {
            // Nếu hiện tại đang có khuyến mại giá sẵn
            // Loại bỏ khuyến mại được chọn và thêm khuyến mại bị thay thế
            otherCoupons = [
              ...[...item.otherCoupons].filter(
                (v) => v.id !== couponSelected.id
              ),
              item.coupons,
            ];
          } else {
            // Nếu chưa áp khuyến mại giá
            // Loại bỏ khuyến mãi muốn sử dụng
            otherCoupons = [...item.otherCoupons].filter(
              (v) => v.id !== couponSelected.id
            );
          }
          // Trả về sản phẩm với mã giảm giá mới
          return {
            ...item,
            coupons: couponSelected,
            otherCoupons: otherCoupons,
            totalPrice:
              (item.price -
                (item.discount + parseInt(couponSelected.value_vnd || 0))) *
              item.quantity,
          };
        }
        return item;
      });

      // Kiểm tra những sản phẩm giống nhau và gộp lại
      // Object để lưu thông tin theo id, capacity, color, và coupons.id
      const itemMap = {};
      // Lặp qua từng phần tử trong cart
      newCart.forEach((item) => {
        const key = `${item.id}-${item.capacity}-${item.color}-${item.coupons.id}`;
        // Nếu key đã tồn tại trong itemMap, tăng quantity
        if (itemMap[key]) {
          itemMap[key].quantity += item.quantity;
          itemMap[key].totalPrice =
            (itemMap[key].price -
              (itemMap[key].discount +
                parseInt(itemMap[key].coupons.value_vnd || 0))) *
            itemMap[key].quantity;
        } else {
          // Nếu key chưa tồn tại, thêm vào itemMap
          itemMap[key] = { ...item };
        }
      });
      // Chuyển itemMap về dạng mảng
      const mergedCart = Object.values(itemMap);

      // Cập nhật redux
      dispatch(addProductToCart(mergedCart));
    }
    // tắt modal sau khi sử lí xong
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        title={<h4>Khuyến mãi sản phẩm</h4>}
        open={isModalOpen}
        closeIcon={false}
        footer={
          <Button
            style={{ borderRadius: "2px", fontSize: "13px" }}
            onClick={handleOk}
          >
            Đóng
          </Button>
        }
      >
        <>
          <div className="css-1gs5ebu">
            <div className="css-ixp6xz">Khuyến mãi đã nhận</div>
          </div>
          <div className="css-30n8gl">
            <div className="css-ixp6xz">Chọn 1 trong những khuyến mãi sau</div>
            {couponsCurrenClicked &&
              couponsCurrenClicked.map((item, index) => (
                <div
                  key={index}
                  className="css-1nz6s82"
                  style={{ cursor: "default" }}
                  id={couponSelected.id !== item.id ? `css-1nz6s82` : ""}
                >
                  <div className="css-qx8kls">
                    <img
                      src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                      alt="icon"
                      height={25}
                      width={25}
                    />
                  </div>
                  <div className="css-1qs7kih style-rjMwc" id="style-rjMwc">
                    <div>
                      <div className=" css-1j2vnz6">
                        Giảm {formatCurrency(item?.value_vnd)} (áp dụng vào giá
                        sản phẩm)
                      </div>
                      <div className=" css-756cgs">
                        Khuyến mãi áp dụng khi mua tối thiểu 1 sản phẩm
                      </div>
                    </div>
                    <div width="100%" direction="row" className="css-1rt5kwy">
                      <div className=" css-2cgl77">
                        HSD: {formatDateToDate(item?.end_date)}
                      </div>
                      <div
                        onClick={() => {
                          if (couponSelected.id === item.id) {
                            setCouponSelected({});
                          } else {
                            setCouponSelected(item);
                          }
                        }}
                        className="css-1aa534q"
                        style={{ cursor: "pointer" }}
                      >
                        {couponSelected?.id === item?.id
                          ? "Bỏ chọn"
                          : "Áp dụng"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      </Modal>
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
                            style={{ transform: "scale(1.1)" }}
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
                      {[...cart].reverse().map((cartItem, index) => (
                        <tr key={index}>
                          {/* checkbox */}
                          <td style={{ padding: 0 }}>
                            <div className="checkbox-item-div">
                              <Checkbox
                                style={{ transform: "scale(1.1)" }}
                                checked={selectedProducts.some(
                                  (product) =>
                                    product.id === cartItem.id &&
                                    product.color === cartItem.color &&
                                    product.capacity === cartItem.capacity &&
                                    product.coupons?.id === cartItem.coupons?.id
                                )}
                                onChange={() =>
                                  handleCheckboxChange(
                                    cartItem.id,
                                    cartItem.color,
                                    cartItem.capacity,
                                    cartItem.coupons
                                  )
                                }
                              />
                            </div>
                          </td>

                          {/* image */}
                          <td
                            style={{
                              maxWidth: "12%",
                              padding: 0,
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "120px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                onClick={() =>
                                  handleViewDetailProduct(cartItem)
                                }
                                className="image-tiet"
                                src={
                                  cartItem.main_image
                                    ? process.env.REACT_APP_API_URL +
                                      cartItem.main_image
                                    : process.env.REACT_APP_API_URL +
                                      cartItem.thumbnail
                                }
                                alt="main_image"
                              />
                            </div>
                          </td>
                          {/* description */}
                          <td style={styleFlexColumn}>
                            <p className="cart-description-content">
                              {cartItem.shortDescription}
                            </p>
                            <p className="cart-description-SKU">
                              SKU: {cartItem.id}
                            </p>
                            <p className="cart-description-rom-color">
                              {" "}
                              {cartItem?.capacity &&
                                formatCapacity(cartItem?.capacity) + ","}{" "}
                              {cartItem?.color}
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
                                cartItem.price -
                                  (cartItem.discount +
                                    parseInt(cartItem.coupons.value_vnd || 0))
                              )}
                            </p>
                            {/* show discount */}
                            {(cartItem.discount > 0 ||
                              cartItem.coupons?.value_vnd) && (
                              <p
                                style={{
                                  margin: "0",
                                  textDecoration: "line-through",
                                  fontSize: "12px",
                                }}
                              >
                                {formatCurrency(cartItem.price)}
                              </p>
                            )}
                          </td>
                          {/* quantity */}
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              flexDirection: "column",
                              aligncartItems: "center",
                            }}
                          >
                            <div className="quantity-control">
                              <Button
                                icon={<MinusOutlined />}
                                onClick={() =>
                                  decreaseQuantity(
                                    cartItem.id,
                                    cartItem.color,
                                    cartItem.capacity,
                                    cartItem.coupons
                                  )
                                }
                                id="quantity-button"
                              />
                              <Input
                                id="quantity-input"
                                value={cartItem.quantity}
                                type="number"
                                min={1}
                                max={999}
                                onBlur={(e) =>
                                  handleBlurQuantity({
                                    productId: cartItem.id,
                                    color: cartItem.color,
                                    capacity: cartItem.capacity,
                                  })
                                }
                              />
                              <Button
                                disabled={checkDisable(
                                  arrDisable,
                                  cartItem.id,
                                  cartItem.color,
                                  cartItem.capacity,
                                  cartItem.coupons
                                )}
                                icon={<PlusOutlined />}
                                onClick={() =>
                                  increaseQuantity(
                                    cartItem.id,
                                    cartItem.color,
                                    cartItem.capacity,
                                    cartItem.coupons
                                  )
                                }
                                id="quantity-button"
                              />
                            </div>
                            {/* btn delete */}
                            <div id="cart-btn-delete">
                              <span
                                style={{
                                  width: "max-content",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  showDeleteConfirm(
                                    cartItem.id,
                                    cartItem.color,
                                    cartItem.capacity,
                                    cartItem.coupons
                                  )
                                }
                              >
                                Xóa
                              </span>
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
                            {formatCurrency(cartItem.totalPrice)}
                          </td>
                          {/* select coupons */}
                          <td>
                            <div>
                              {(cartItem.coupons?.id ||
                                cartItem.otherCoupons?.length !== 0) && (
                                <Tooltip
                                  title="Chọn khuyến mãi"
                                  color="#024dbc"
                                >
                                  <GiftOutlined
                                    onClick={() =>
                                      hanldeSelectCoupons(
                                        {
                                          productId: cartItem.id,
                                          color: cartItem.color,
                                          capacity: cartItem.capacity,
                                          coupons: cartItem.coupons,
                                        },
                                        cartItem.coupons,
                                        cartItem.otherCoupons
                                      )
                                    }
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "24px",
                                      color: "red",
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              </div>
              <div className="chi-tiet-cart">
                <div className="title-thanh">Thanh Toán </div>
                <p style={{fontSize: "12px", userSelect: "text"}}>(Một số phương thức thanh toán có giới hạn số tiền giao dịch cụ thể. Trong trường hợp này vui lòng liên hệ: <span style={{fontWeight:"500"}}>0123456789</span>)</p>
                <div className="khoi-tiet-cha-cart">
                  <MDBTable className="table-tiet" borderless>
                    <MDBTableBody>
                      <tr style={{ fontSize: "14px", color: "black" }}>
                        <td>Tạm tính</td>
                        <th>{formatCurrency(totalPrice)}</th>
                      </tr>
                      <tr style={{ fontSize: "14px", color: "black" }}>
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
