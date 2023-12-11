import React, { useState, useEffect, useRef } from "react";
import { Image, Modal, Carousel, Input, notification } from "antd";
import { MDBContainer, MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import {
  LeftOutlined,
  RightOutlined,
  ExclamationCircleFilled,
  CaretDownOutlined,
  CaretUpOutlined,
  PlusOutlined,
  MinusOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import "./Detail.css";
import { formatCurrency } from "../../util/FormatVnd";
import { format_sale } from "../../util/formatSale";
import { addProductToCart, increaseProduct } from "../../redux/cartSlice";
import { formatCapacity } from "../../util/formatCapacity";
import CardProduct from "../Card/Card";
import { addToRecentlyViewedProduct } from "../../util/servicesGlobal";
import { formatDateToDate } from "../../util/formatData";

const { error } = Modal;

function Detail() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  //Modal antd
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  // sự kiện mở modal
  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  //sự kiện đóng
  const handleCancel = () => {
    setIsModalOpen2(false);
  };

  //lấy thông tin vào modal
  const { id } = useParams();
  const location = useLocation();
  const { capacity, color } = location.state || { capacity: null, color: null };
  const [firstLoad, setFirstLoad] = useState(true);
  const [Detail, setDetail] = useState(null);
  const [configuration, setConfiguration] = useState({});
  const htmlContent = Detail?.description;
  const [currentImage, setCurrentImage] = useState(0);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState({});
  const [imagesSelected, setImagesSelected] = useState([]);
  const [variationSelected, setVariationSelected] = useState([]);

  const [capacities, setCapacities] = useState([]);
  const [colors, setColors] = useState([]);

  // Lọc những capacity có trong product (ko trùng nhau)
  useEffect(() => {
    if (Detail) {
      let cp = [];
      [...Detail.variations].forEach((element) => {
        cp.push(element.capacity);
      });
      const sortCapacity = cp.sort((a, b) => a - b);
      setCapacities([...new Set(sortCapacity)]);
      if (capacity && color && firstLoad) {
        setSelectedCapacity(capacity);
        setSelectedColor(color);
      } else {
        setSelectedCapacity(sortCapacity[0]);
      }
      setTimeout(() => {
        setFirstLoad(false);
      }, 2000);
    }
  }, [Detail]);

  // sự kiện khi color thay đổi (Thay đổi image)
  useEffect(() => {
    if (selectedColor && Object.keys(Detail).length !== 0) {
      const images = [...Detail.images].filter(
        (element) => element.color === selectedColor
      );
      if (images.length !== 0) {
        setImagesSelected(images[0].path);
      }
    }
  }, [selectedColor, Detail]);

  // sự kiện khi capacity thay đổi
  useEffect(() => {
    if (selectedCapacity && Detail) {
      // Thay đổi color theo capacity
      colorChangeByCapacity(Detail, selectedCapacity);
    }
  }, [selectedCapacity, Detail]);

  // hàm thay đổi màu theo capacity
  const colorChangeByCapacity = (Detail, capacitySelected) => {
    const findColorWithCapacity = Detail.variations.filter(
      (vatiation) => vatiation.capacity === capacitySelected
    );
    let cl = [];
    findColorWithCapacity.forEach((element) => {
      cl.push(element.color);
    });
    setColors(cl);
    // Mặc định chọn giá trị đầu tiên
    if (!color || !firstLoad) {
      setSelectedColor(cl[0]);
    }
  };

  // Hàm thay đổi giá khi color, capacity thay đổi
  useEffect(() => {
    if (selectedColor && Detail && selectedCapacity) {
      const vs = [...Detail.variations].filter(
        (element) =>
          element.color === selectedColor &&
          element.capacity === selectedCapacity
      );
      setVariationSelected(vs[0]);
    }
  }, [selectedCapacity, selectedColor, Detail]);

  // Lấy thông tin sản phẩm khi có id
  useEffect(() => {
    id && getProduct();
  }, [id]);

  // Hàm lấy thông tin sản phẩm
  const getProduct = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/detail/${id}`)
      .then((response) => {
        const data = response.data[0];
        // Lưu thông tin chi tiết của sản phẩm vào state
        setDetail(data);
        // Lưu thông tin cấu hình của sản phẩm vào state
        setConfiguration(data.configuration);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const carouselRef = useRef(null);

  const handlePreviousClick = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  // Hàm show modal delete product
  // const showDeleteConfirm = () => {
  //   error({
  //     title: "Tài khoản của bạn đã bị khóa và không thể sử dụng giỏ hàng",
  //     icon: <ExclamationCircleFilled />,
  //     centered: true,
  //     footer: false,
  //     maskClosable: true,
  //   });
  // };

  // them giỏ hàng
  const cart = useSelector((state) => state.cart.products);
  const handleAddToCart = () => {
    // if (user && user.isLocked !== 0) {
    //   showDeleteConfirm();
    //   return;
    // }

    // Check quantity
    if (variationSelected.remaining_quantity_variant === 0) {
      api.info({
        message: "Phân loại đã hết hàng",
      });
      return false;
    }
    // Tạo một đối tượng mới với các thuộc tính cần thiết của sản phẩm
    const newItem = {
      id: Detail.id,
      brand: Detail.brand,
      thumbnail: imagesSelected[0],
      shortDescription: Detail.shortDescription,
      capacity: variationSelected.capacity,
      color: variationSelected.color,
      price: variationSelected.price,
      discount: variationSelected.discount_amount,
      //----
      quantity: 1,
      totalPrice: variationSelected.price - variationSelected.discount_amount,
    };

    // console.log(newItem);
    // return;

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.id === newItem.id &&
        cartItem.color === newItem.color &&
        cartItem.capacity === newItem.capacity
    );

    if (existingItemIndex !== -1) {
      // Sản phẩm đã tồn tại trong giỏ hàng
      const itemUpdate = {
        product_id: Detail.id,
        capacity: variationSelected.capacity,
        color: variationSelected.color,
      };
      dispatch(increaseProduct(itemUpdate));
      api.success({
        message: "Đã thêm sản phẩm vào giỏ hàng",
      });
      return true;
    } else {
      // Thêm sản phẩm vào giỏ hàng
      const updatedCart = [...cart, newItem];
      // update redux state
      dispatch(addProductToCart(updatedCart));
      api.success({
        message: "Đã thêm sản phẩm vào giỏ hàng",
      });
      return true;
    }
  };

  // Hàm xử lý sự kiện khi nhấp vào hình thu nhỏ
  const handleThumbnailHover = (index) => {
    setCurrentImage(index);
    carouselRef.current.goTo(index);
  };

  // Hàm thay đổi màu sắc
  const handleChangeColor = (color) => {
    setSelectedColor(color.toString());
  };

  // Hàm thay đổi dung lượng
  const handleChangeCapacity = (capacity) => {
    setSelectedCapacity(capacity);
  };

  // Hàm để lấy sản phẩm liên quan
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    const getRelatedProducts = async (brand, categoryID) => {
      let relatedProducts = [];

      const laptopProducts = await fetch(
        `${process.env.REACT_APP_API_URL}/product/productslaptop`
      )
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error fetching laptop data:", error);
        });

      const phoneProducts = await fetch(
        `${process.env.REACT_APP_API_URL}/product/productsPhone`
      )
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error fetching phone data:", error);
        });

      const products = categoryID === 1 ? laptopProducts : phoneProducts;

      relatedProducts = products?.filter(
        (product) =>
          product.CategoryID === categoryID && product.id !== Detail.id
      );

      relatedProducts.sort((a, b) => {
        if (a.brand === brand) {
          return -1;
        } else if (b.brand === brand) {
          return 1;
        } else {
          return 0;
        }
      });
      setRelatedProducts(relatedProducts);
    };

    if (Detail) {
      getRelatedProducts(Detail.brand, Detail.CategoryID);
    }
  }, [Detail]);

  const handleViewDetailProduct = (products) => {
    addToRecentlyViewedProduct(products);
    navigate(`/detail/${products.id}`);
  };

  // logic scroll button product
  const ctnRef = useRef(null);

  const scrollTrai = () => {
    if (ctnRef.current) {
      ctnRef.current.scrollLeft -= 230; // Điều chỉnh khoảng cách cuộn tùy ý
    }
  };

  const scrollPhai = () => {
    if (ctnRef.current) {
      ctnRef.current.scrollLeft += 230; // Điều chỉnh khoảng cách cuộn tùy ý
    }
  };

  // Đối tượng chứa các cặp khóa-giá trị tương ứng
  // const labels = {
  //   cpu: "Thế hệ CPU",
  //   chip: "Chip",
  //   vga: "Chíp đồ họa",
  //   screen: "Màn hình",
  //   // thêm các cặp khóa-giá trị khác nếu cần
  // };

  // Hàm check remaining_quantity_variant
  // const checkDisableCapacity = (capacity) => {
  //   const d = [...Detail.variations].filter(
  //     (variant) => variant.capacity === capacity
  //   );
  //   const result = d.filter((value) => value.remaining_quantity_variant !== 0);
  //   return result.length !== 0 ? false : true;
  // };

  // console.log(variationSelected);
  // style

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderContent = () => {
    if (isExpanded) {
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    } else {
      // Hiển thị một phần của nội dung
      const partialContent = htmlContent.slice(0, 1500); // chỉnh số ký tự hiển thị tại đây
      return <div dangerouslySetInnerHTML={{ __html: partialContent }} />;
    }
  };
  const buttonClass = isExpanded ? "btn-thugon" : "btn-xemthem";

  // Lấy thông tin khuyến mãi của sản phẩm
  const [coupons, setCoupons] = useState([]);
  const [couponSelected, setCouponSelected] = useState({});
  useEffect(() => {
    getCoupons();
  }, []);

  const getCoupons = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/product/34/coupons`;
      const results = await axios.get(url);

      setCoupons(results.data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectedCoupon = (value) => {
    setCouponSelected(value);
  };

  return (
    <>
      {contextHolder}
      {Detail && (
        <div>
          <div className="style-1">
            <div className="css-4cffwv">
              <div className="css-1i1dodm tether-abutted tether-abutted-top tether-target-attached-top tether-element-attached-top tether-element-attached-center tether-target-attached-center">
                <div>
                  <div className="productDetailPreview style-FMPIO">
                    <div>
                      <MDBContainer>
                        <div style={{ width: "100%", position: "relative" }}>
                          <button
                            className="scroll-btn"
                            id="scroll-left-btn"
                            onClick={handlePreviousClick}
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>
                          <button
                            className="scroll-btn"
                            id="scroll-right-btn"
                            onClick={handleNextClick}
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                          <Carousel
                            autoplay
                            ref={carouselRef}
                            afterChange={(current) => setCurrentImage(current)}
                          >
                            {/* img main */}
                            {imagesSelected &&
                              [...imagesSelected].length > 0 &&
                              [...imagesSelected].map((path, index) => (
                                <div key={index}>
                                  <img
                                    src={process.env.REACT_APP_API_URL + path}
                                    alt={""}
                                    className="zoom-image"
                                  />
                                </div>
                              ))}
                          </Carousel>
                        </div>
                      </MDBContainer>
                    </div>
                  </div>
                  {/* Slider hình nhỏ */}
                  <div className="thumbnail-slider">
                    {imagesSelected &&
                      imagesSelected.length > 0 &&
                      [...imagesSelected].map((path, index) => (
                        <Image.PreviewGroup
                          key={index}
                          preview={{
                            onChange: (current, prev) =>
                              console.log(
                                `current index: ${current}, prev index: ${prev}`
                              ),
                          }}
                        >
                          <Image
                            width={80}
                            src={process.env.REACT_APP_API_URL + path}
                            onMouseEnter={() => handleThumbnailHover(index)} // Thay đổi từ onClick sang onMouseEnter
                            style={{
                              border:
                                currentImage === index
                                  ? "2px solid blue"
                                  : "none",
                            }}
                          />
                        </Image.PreviewGroup>
                      ))}
                  </div>
                </div>
                {/* hiển thị chi tiết  */}
              </div>
              <div className="css-6b3ezu">
                {/* ten, mã , thương hiệu */}
                <div>
                  <h1 className="css-4kh4rf">{Detail.shortDescription}</h1>
                  <div style={{ marginTop: "8px" }}>
                    <div
                      type="caption"
                      color="textSecondary"
                      className="css-1qm2d75"
                      id="style-La8m4"
                    >
                      Thương hiệu
                      <a
                        target="_self"
                        className="css-cbrxda"
                        href="/asus-brand.asus"
                      >
                        <span className="css-n67qkj"> {Detail?.brand}</span>
                      </a>
                      <span className="css-1qgvt7n"></span>
                      SKU: {Detail.id}
                      <span className="css-1qgvt7n"></span>
                      Mã vạch: &nbsp;
                      {configuration.part_number && configuration.part_number}
                    </div>
                  </div>
                </div>
                <br />

                {/* check box dung lượng*/}
                {capacities && (
                  <div className="block-select-color">
                    <p className="title-btn-color">
                      dung lượng (ROM): {formatCapacity(selectedCapacity)}
                    </p>
                    <div className="flex-btn-color">
                      {[...capacities].map((capacity, index) => (
                        <>
                          <div
                            key={index}
                            style={
                              selectedCapacity === capacity
                                ? {
                                    borderColor: "#024dbc",
                                    color: "#024dbc",
                                  }
                                : {}
                            }
                            onClick={() => handleChangeCapacity(capacity)}
                            className="custom-checkbox-input"
                          >
                            {formatCapacity(capacity)}
                          </div>
                          <br />
                        </>
                      ))}
                    </div>
                  </div>
                )}

                {/* check box màu sắc*/}
                {capacities &&
                  colors &&
                  (colors.length > 1 || capacities.length > 1) && (
                    <div className="block-select-color">
                      <p className="title-btn-color">
                        màu sắc: {selectedColor}
                      </p>
                      <div className="flex-btn-color">
                        {[...colors].map((color, index) => (
                          <div
                            key={index}
                            style={
                              selectedColor === color
                                ? {
                                    borderColor: "#024dbc",
                                    color: "#024dbc",
                                  }
                                : {}
                            }
                            onClick={() => handleChangeColor(color)}
                            className="custom-checkbox-input"
                          >
                            {color}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* giá tiền */}
                <br />
                {variationSelected && (
                  <div className="css-1q5zfcu">
                    {parseInt(variationSelected.discount_amount) === 0 ? (
                      <div className="css-oj899w">
                        {formatCurrency(variationSelected.price)}
                      </div>
                    ) : (
                      <>
                        <div className="css-oj899w">
                          {formatCurrency(
                            variationSelected.price -
                              variationSelected.discount_amount
                          )}
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          <span style={{ textDecoration: "line-through" }}>
                            {formatCurrency(variationSelected.price)}
                          </span>
                          &nbsp;
                          <span style={{ color: "#1435c3" }}>
                            {" "}
                            -
                            {format_sale(
                              variationSelected.price,
                              variationSelected.discount_amount
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* show remaining quantity variant */}
                {variationSelected?.remaining_quantity_variant !== 0 ? (
                  <>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                      {variationSelected?.remaining_quantity_variant}
                    </span>{" "}
                    <span>sản phẩm có sẵn</span>{" "}
                  </>
                ) : (
                  <h6
                    style={{
                      textTransform: "uppercase",
                      color: "red",
                      margin: "0",
                    }}
                  >
                    hết hàng
                  </h6>
                )}

                {/* component increase quantity */}
                {/* <div className="edit-quantity-group">
                  <button className="btn-increase">
                    <MinusOutlined />
                  </button>
                  <Input
                    className="input-quantity"
                    min={0}
                    type="number"
                    inputNumberStyle={{
                      width: "100%",
                      MozAppearance: "textfield",
                      margin: 0,
                    }}
                  />
                  <button className="btn-reduce">
                    <PlusOutlined />
                  </button>
                </div> */}

                {/* ------------------------------------------------------------ */}
                {/* divider */}
                <div className="css-f1fyi0">
                  <div
                    width="100%"
                    color="divider"
                    className="css-1fm9yfq"
                  ></div>
                </div>

                {/* phần khuyến mãi */}
                {/* {coupons && coupons.length !== 0 && (
                  <>
                    <div className="css-1gs5ebu">
                      <div className="css-ixp6xz">Khuyến mãi đã nhận</div>
                    </div>
                    <div className="css-30n8gl">
                      <div className="css-ixp6xz">
                        Chọn 1 trong những khuyến mãi sau
                      </div>
                      {coupons.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => selectedCoupon(item)}
                          className="css-1nz6s82"
                          id={couponSelected.id !== item.id && `css-1nz6s82`}
                        >
                          <div className="css-qx8kls">
                            <img
                              src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                              alt="icon"
                              height={25}
                              width={25}
                            />
                          </div>
                          <div
                            className="css-1qs7kih style-rjMwc"
                            id="style-rjMwc"
                          >
                            <div>
                              <div className=" css-1j2vnz6">
                                Giảm {formatCurrency(item.value_vnd)} (áp dụng
                                vào giá sản phẩm)
                              </div>
                              <div className=" css-756cgs">
                                Khuyến mãi áp dụng khi mua tối thiểu 1 sản phẩm
                              </div>
                            </div>
                            <div
                              width="100%"
                              direction="row"
                              className="css-1rt5kwy"
                            >
                              <div className=" css-2cgl77">
                                HSD: {formatDateToDate(item.end_date)}
                              </div>
                              <div className="css-1aa534q">
                                {couponSelected.id === item.id
                                  ? "Bỏ chọn"
                                  : "Áp dụng"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )} */}

                <div className="css-f7zc9t">
                  {/* button mua ngay */}
                  <div
                    data-content-region-name="descriptionDetail"
                    data-track-content="true"
                    data-content-name="buyNow"
                    data-content-target="cart"
                    data-content-payload='{"sku":"220300268","screenName":"productDetail"}'
                    className="css-yp9swi"
                  >
                    <button
                      height="2.5rem"
                      color="white"
                      className="att-detail-page-buy-now-button css-9p27dv"
                      type="button"
                      // onClick={showModal}
                      // sự kiện cho modal
                      onClick={(e) => {
                        const result = handleAddToCart();
                        result && window.location.replace("/cart");
                      }}
                    >
                      <div type="subtitle" className="css-ueraml">
                        MUA NGAY
                      </div>
                      <span id="style-Ff8iU" className="style-Ff8iU">
                        <div className="css-157jl91"></div>
                      </span>
                    </button>
                  </div>
                  {/* button thêm vào giỏ hàng */}
                  <div
                    data-content-region-name="descriptionDetail"
                    data-track-content="true"
                    data-content-name="addToCart"
                    data-content-target="productDetail"
                    data-content-payload='{"sku":"220300268","screenName":"productDetail"}'
                    className="css-yp9swi"
                  >
                    <button
                      height="2.5rem"
                      color="primary500"
                      className="css-1cxhzy5"
                      type="button"
                      onClick={handleAddToCart}
                    >
                      <div type="subtitle" className="css-ueraml">
                        THÊM VÀO GIỎ HÀNG
                      </div>
                      <span id="style-x5Hzq" className="style-x5Hzq">
                        <div className="css-157jl91"></div>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="css-1o4pdv8">
                  <div
                    width="100%"
                    color="divider"
                    className="css-1fm9yfq"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="style-2">
            <div className="fle-x">
              <div className="mo-ta">
                <div className="title-mo">Mô tả sản phẩm</div>
                {renderContent()}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button onClick={toggleExpanded} className={buttonClass}>
                    {isExpanded ? (
                      <>
                        Thu gọn <CaretUpOutlined />
                      </>
                    ) : (
                      <>
                        Xem thêm <CaretDownOutlined />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="chi-tiet">
                <div className="title-tiet">Thông tin chi tiết</div>
                <div className="khoi-tiet-cha">
                  <MDBTable className="table-tiet" borderless>
                    <MDBTableBody>
                      <tr>
                        <td colSpan={1}>Thương hiệu</td>
                        <td colSpan={3}>{Detail.brand}</td>
                      </tr>
                      <tr>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={1}>
                          Bảo hành
                        </td>
                        <td
                          style={{ backgroundColor: "#f6f6f6" }}
                          className="back-gr-tiet"
                          colSpan={3}
                        >
                          {configuration.guarantee}
                        </td>
                      </tr>
                      <tr>
                        <td className="style-tin-chung" colSpan={2}>
                          Thông tin chung
                        </td>
                      </tr>
                      {configuration.series && (
                        <tr>
                          <td
                            style={{ backgroundColor: "#f6f6f6" }}
                            colSpan={1}
                          >
                            Series
                          </td>
                          <td
                            style={{ backgroundColor: "#f6f6f6" }}
                            colSpan={3}
                          >
                            {configuration.series}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={1}>Màu sắc</td>
                        <td colSpan={3}>
                          {colors ? (
                            <div>
                              {colors.map((color, index) => (
                                <span key={index}>
                                  {color}
                                  {index < colors.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span></span>
                          )}
                        </td>
                      </tr>
                      {configuration.demand && (
                        <tr>
                          <td
                            style={{ backgroundColor: "#f6f6f6" }}
                            colSpan={1}
                          >
                            Nhu cầu
                          </td>
                          <td
                            style={{ backgroundColor: "#f6f6f6" }}
                            colSpan={3}
                          >
                            {configuration.demand}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="style-tin-chung" colSpan={1}>
                          Cấu hình
                        </td>
                      </tr>
                      {/* màn hình */}

                      <tr
                        style={{
                          display: configuration.screenTechnology
                            ? "table-row"
                            : "none",
                        }}
                      >
                        <td colSpan={1}>
                          {configuration.screenTechnology
                            ? " Loại màn hình"
                            : ""}
                        </td>
                        <td colSpan={3}>
                          {configuration.screenTechnology || ""}
                        </td>
                      </tr>
                      {/* cpu*/}

                      <tr
                        style={{
                          backgroundColor: "#f6f6f6",
                          display: configuration.cpu ? "table-row" : "none",
                        }}
                      >
                        <td colSpan={1}>{configuration.cpu ? " CPU" : ""}</td>
                        <td colSpan={3}>{configuration.cpu || ""}</td>
                      </tr>

                      {/* <tr>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={1}>
                          {configuration.cpu
                            ? "CPU"
                            : configuration.chip
                            ? "Chip"
                            : ""}
                        </td>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={3}>
                          {configuration.cpu || configuration.chip}
                        </td>
                      </tr> */}

                      {/* chip đồ họa, phân giải */}
                      {/* {(configuration.vga || configuration.resolution) && (
                        <tr>
                          <td colSpan={1}>
                            {configuration.vga
                              ? "Chip đồ họa"
                              : configuration.resolution
                              ? "Phân giải"
                              : ""}
                          </td>
                          <td colSpan={3}>
                            {configuration.vga || configuration.resolution}
                          </td>
                        </tr>
                      )} */}
                      {/* Ram */}
                      <tr
                        style={{
                          backgroundColor: "#f6f6f6",
                          display: configuration.ram ? "table-row" : "none",
                        }}
                      >
                        <td colSpan={1}>{configuration.ram ? " Ram" : ""}</td>
                        <td colSpan={3}>{configuration.ram || ""}</td>
                      </tr>
                      {/* <tr>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={1}>
                          Ram
                        </td>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={3}>
                          {configuration.ram}
                        </td>
                      </tr> */}
                      {/* Rom mặc định có */}
                      <tr>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={1}>
                          Rom
                        </td>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={3}>
                          {formatCapacity(selectedCapacity)}
                        </td>
                      </tr>
                    </MDBTableBody>
                  </MDBTable>
                </div>

                {/* Modal xem cấu hình chi tiết */}
                <div onClick={showModal2} className="xem-tiet">
                  Xem chi tiết cấu hình
                </div>
              </div>
            </div>
          </div>

          {/* modal xem-chi-tiet */}
          <Modal
            open={isModalOpen2}
            onCancel={handleCancel}
            width={700}
            footer={false}
          >
            {/* body */}
            <div className="khoi-tiet-cha">
              <div className="title-modal-cha">
                <div className="title-modal-con">Thông số kỹ thuật</div>
              </div>

              <MDBTable className="table-tiet" borderless>
                <MDBTableBody>
                  <tr>
                    <td colSpan={1}>Thương hiệu</td>
                    <td colSpan={3}>{Detail.brand}</td>
                  </tr>
                  <tr>
                    <td colSpan={1}>Bảo hành</td>
                    <td className="back-gr-tiet" colSpan={3}>
                      {configuration.guarantee}
                    </td>
                  </tr>
                  <tr>
                    <td className="style-tin-chung" colSpan={1}>
                      Thông tin chung
                    </td>
                  </tr>
                  {configuration.series && (
                    <tr>
                      <td colSpan={1}>Series</td>
                      <td colSpan={3}>{configuration.series}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={1}>Màu sắc</td>
                    <td colSpan={3}>
                      {colors ? (
                        <div>
                          {colors.map((color, index) => (
                            <span key={index}>
                              {color}
                              {index < colors.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span></span>
                      )}
                    </td>
                  </tr>
                  {configuration.demand && (
                    <tr>
                      <td style={{ backgroundColor: "#f6f6f6" }} colSpan={1}>
                        Nhu cầu
                      </td>
                      <td style={{ backgroundColor: "#f6f6f6" }} colSpan={3}>
                        {configuration.demand}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="style-tin-chung" colSpan={1}>
                      Cấu hình chi tiết
                    </td>
                  </tr>

                  {/* Hệ điều hành 1*/}
                  <tr
                    style={{ display: configuration.os ? "table-row" : "none" }}
                  >
                    <td colSpan={1}>
                      {configuration.os ? " Hệ điều hành" : ""}
                    </td>
                    <td colSpan={3}>{configuration.os || ""}</td>
                  </tr>

                  {/* CPU*/}
                  <tr
                    style={{
                      display: configuration.cpu ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>{configuration.cpu ? " CPU" : ""}</td>
                    <td colSpan={3}>{configuration.cpu || ""}</td>
                  </tr>

                  {/* Ram*/}
                  <tr
                    style={{
                      display: configuration.ram ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>{configuration.ram ? " Ram" : ""}</td>
                    <td colSpan={3}>{configuration.ram || ""}</td>
                  </tr>

                  {/* Rom*/}
                  <tr>
                    <td colSpan={1}>Rom</td>
                    <td colSpan={3}>{formatCapacity(selectedCapacity)}</td>
                  </tr>

                  {/* memoryStick*/}
                  <tr
                    style={{
                      display: configuration.memoryStick ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.memoryStick ? " Thẻ nhớ" : ""}
                    </td>
                    <td colSpan={3}>{configuration.memoryStick || ""}</td>
                  </tr>

                  {/*screenSize*/}
                  <tr
                    style={{
                      display: configuration.screenSize ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.screenSize ? " Kích thước màn hình" : ""}
                    </td>
                    <td colSpan={3}>{configuration.screenSize || ""}</td>
                  </tr>

                  {/*screenResolution*/}
                  <tr
                    style={{
                      display: configuration.screenResolution
                        ? "table-row"
                        : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.screenResolution
                        ? " Độ phân giải màn hình"
                        : ""}
                    </td>
                    <td colSpan={3}>{configuration.screenResolution || ""}</td>
                  </tr>

                  {/*screenTechnology*/}
                  <tr
                    style={{
                      display: configuration.screenTechnology
                        ? "table-row"
                        : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.screenTechnology
                        ? " Công nghệ màn hình"
                        : ""}
                    </td>
                    <td colSpan={3}>{configuration.screenTechnology || ""}</td>
                  </tr>

                  {/*mainCamera*/}
                  <tr
                    style={{
                      display: configuration.mainCamera ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.mainCamera ? " Camera chính" : ""}
                    </td>
                    <td colSpan={3}>{configuration.mainCamera || ""}</td>
                  </tr>

                  {/*frontCamera*/}
                  <tr
                    style={{
                      display: configuration.frontCamera ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.frontCamera ? " Camera Selfie" : ""}
                    </td>
                    <td colSpan={3}>{configuration.frontCamera || ""}</td>
                  </tr>

                  {/*Pin*/}
                  <tr
                    style={{
                      display: configuration.pin ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>{configuration.pin ? " Pin" : ""}</td>
                    <td colSpan={3}>{configuration.pin || ""}</td>
                  </tr>

                  {/*chargingTechnology*/}
                  <tr
                    style={{
                      display: configuration.chargingTechnology
                        ? "table-row"
                        : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.chargingTechnology ? " Công nghệ sạc" : ""}
                    </td>
                    <td colSpan={3}>
                      {configuration.chargingTechnology || ""}
                    </td>
                  </tr>

                  {/*connector*/}
                  <tr
                    style={{
                      display: configuration.connector ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.connector ? " Cổng kết nối" : ""}
                    </td>
                    <td colSpan={3}>{configuration.connector || ""}</td>
                  </tr>

                  {/*size*/}
                  <tr
                    style={{
                      display: configuration.size ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.size ? " Kích thước" : ""}
                    </td>
                    <td colSpan={3}>{configuration.size || ""}</td>
                  </tr>

                  {/*weight*/}
                  <tr
                    style={{
                      display: configuration.weight ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.weight ? " Trọng lượng" : ""}
                    </td>
                    <td colSpan={3}>{configuration.weight || ""}</td>
                  </tr>

                  {/*audioTechnology*/}
                  <tr
                    style={{
                      display: configuration.audioTechnology
                        ? "table-row"
                        : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.audioTechnology
                        ? " Công nghệ âm thanh"
                        : ""}
                    </td>
                    <td colSpan={3}>{configuration.audioTechnology || ""}</td>
                  </tr>

                  {/*loudspeaker*/}
                  <tr
                    style={{
                      display: configuration.loudspeaker ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.loudspeaker ? " Loa" : ""}
                    </td>
                    <td colSpan={3}>{configuration.loudspeaker || ""}</td>
                  </tr>

                  {/*sensor*/}
                  <tr
                    style={{
                      display: configuration.sensor ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.sensor ? " Cảm biến" : ""}
                    </td>
                    <td colSpan={3}>{configuration.sensor || ""}</td>
                  </tr>

                  {/*networkConnections*/}
                  <tr
                    style={{
                      display: configuration.networkConnections
                        ? "table-row"
                        : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.networkConnections ? " Kết nối mạng" : ""}
                    </td>
                    <td colSpan={3}>
                      {configuration.networkConnections || ""}
                    </td>
                  </tr>

                  {/*waterproof*/}
                  <tr
                    style={{
                      display: configuration.waterproof ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.waterproof ? " Chống nước" : ""}
                    </td>
                    <td colSpan={3}>{configuration.waterproof || ""}</td>
                  </tr>

                  {/*dustproof*/}
                  <tr
                    style={{
                      display: configuration.dustproof ? "table-row" : "none",
                    }}
                  >
                    <td colSpan={1}>
                      {configuration.dustproof ? " Chống bụi" : ""}
                    </td>
                    <td colSpan={3}>{configuration.dustproof || ""}</td>
                  </tr>

                  {/* 
                  <tr>
                    <td colSpan={1}>Hệ điều hành</td>
                    <td colSpan={3}>{configuration.os}</td>
                  </tr> */}

                  {/* <tr>
                  <td
                    style={{
                      display: configuration.cpu ? "table-cell" : "none",
                    }}
                    colSpan={1}
                  >
                    Thế hệ CPU
                  </td>
                  <td
                    style={{
                      display: configuration.cpu ? "table-cell" : "none",
                    }}
                    colSpan={3}
                  >
                    {configuration.cpu}
                  </td>
                </tr> */}
                  {/* <tr>
                    <td colSpan={1}>
                      {configuration.cpu
                        ? "CPU"
                        : configuration.chip
                        ? "Chip"
                        : ""}
                    </td>
                    <td colSpan={3}>
                      {configuration.cpu || configuration.chip}
                    </td>
                  </tr> */}

                  {(configuration.graphicsCard || configuration.resolution) && (
                    <tr>
                      <td colSpan={1}>
                        {configuration.graphicsCard
                          ? "Card đồ họa"
                          : configuration.resolution
                          ? "Phân giải"
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {configuration.graphicsCard || configuration.resolution}
                      </td>
                    </tr>
                  )}
                  {/* <tr>
                    <td colSpan={1}>Màn hình</td>
                    <td colSpan={3}>{configuration.screenSize}</td>
                  </tr> */}
                  {/* <tr>
                    <td colSpan={1}>Ram</td>
                    <td colSpan={3}>{configuration.ram}</td>
                  </tr> */}

                  {/* {(configuration.maximum_number_of_storage_ports ||
                    configuration.charging_port) && (
                    <tr>
                      <td colSpan={1}>
                        {configuration.maximum_number_of_storage_ports
                          ? "Số cổng lưu trữ tối đa"
                          : configuration.charging_port
                          ? "Cổng sạc"
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {configuration.maximum_number_of_storage_ports ||
                          configuration.charging_port}
                      </td>
                    </tr>
                  )} */}

                  {/* {(configuration.M2_slot_type_supported ||
                    configuration.networkConnections) && (
                    <tr>
                      <td colSpan={1}>
                        {configuration.M2_slot_type_supported
                          ? "Kiểu khe M.2 hỗ trợ"
                          : configuration.networkConnections
                          ? "Kết nối mạng"
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {configuration.M2_slot_type_supported ||
                          configuration.networkConnections}
                      </td>
                    </tr>
                  )} */}

                  {(configuration.output_port || configuration.rear_camera) && (
                    <tr>
                      <td colSpan={1}>
                        {configuration.output_port
                          ? "Cổng xuất hình"
                          : configuration.rear_camera
                          ? "Camera sau"
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {configuration.output_port || configuration.rear_camera}
                      </td>
                    </tr>
                  )}
                  {/* {(configuration.connector || configuration.front_camera) && (
                    <tr>
                      <td colSpan={1}>
                        {configuration.connector
                          ? "Cổng kết nối"
                          : configuration.front_camera
                          ? "Camera trước"
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {configuration.connector || configuration.front_camera}
                      </td>
                    </tr>
                  )} */}
                  {(configuration.wireless_connectivity ||
                    configuration.wifi) && (
                    <tr>
                      <td colSpan={1}>
                        {configuration.wireless_connectivity
                          ? "Kết nối không dây"
                          : configuration.wifi
                          ? "Wifi"
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {configuration.wireless_connectivity ||
                          configuration.wifi}
                      </td>
                    </tr>
                  )}
                  {(configuration.keyboard || configuration.gps) && (
                    <tr>
                      <td colSpan={1}>
                        {configuration.keyboard
                          ? "Bàn phím"
                          : configuration.gps
                          ? "GPS"
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {configuration.keyboard || configuration.gps}
                      </td>
                    </tr>
                  )}
                  {configuration.bluetooth && (
                    <tr>
                      <td colSpan={1}>Bluetooth</td>
                      <td colSpan={3}>{configuration.bluetooth}</td>
                    </tr>
                  )}
                  {configuration.headphone_jack && (
                    <tr>
                      <td colSpan={1}>Tai nghe</td>
                      <td colSpan={3}>{configuration.headphone_jack}</td>
                    </tr>
                  )}
                  {/* {configuration.size && (
                    <tr>
                      <td colSpan={1}>Kích thước</td>
                      <td colSpan={3}>{configuration.size}</td>
                    </tr>
                  )}
                  {configuration.pin && (
                    <tr>
                      <td colSpan={1}>Pin</td>
                      <td colSpan={3}>{configuration.pin}</td>
                    </tr>
                  )} */}
                  {configuration.mass && (
                    <tr>
                      <td colSpan={1}>Khối lượng</td>
                      <td colSpan={3}>{configuration.mass}</td>
                    </tr>
                  )}
                  {configuration.accessory && (
                    <>
                      <tr>
                        <td className="style-tin-chung" colSpan={1}>
                          Thông tin khác
                        </td>
                      </tr>
                      <tr>
                        <td className="style-tin-chung" colSpan={1}>
                          Phụ kiện đi kèm
                        </td>
                        <td colSpan={3}>{configuration.accessory}</td>
                      </tr>
                    </>
                  )}
                </MDBTableBody>
              </MDBTable>
            </div>
          </Modal>
          {/*  */}
          <div
            className="product-container"
            style={{
              borderRadius: "5px",
              position: "relative",
              width: "1234px",
              margin: "0 auto",
              marginTop: "30px",
              backgroundColor: "white",
            }}
          >
            <div>
              <div
                className="product-title"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  display: "-webkit-box",
                  padding: "20px",
                  color: "black",
                  borderBottom: "1px solid rgb(228, 229, 240)",
                }}
              >
                Sản phẩm tương tự
              </div>
            </div>
            <div className="scroll-group-phone">
              <div className="scroll-control-phone" ref={ctnRef}>
                {relatedProducts &&
                  relatedProducts.length > 0 &&
                  relatedProducts.map((item, index) => (
                    <div key={index}>
                      <CardProduct
                        key={index}
                        item={item}
                        items={relatedProducts}
                        onClick={() => handleViewDetailProduct(item)}
                      />
                    </div>
                  ))}
              </div>
              {/* button */}
              <button
                className="scroll-button"
                id="scroll-left-button"
                onClick={scrollTrai}
              >
                <LeftOutlined />
              </button>
              <button
                className="scroll-button"
                id="scroll-right-button"
                onClick={scrollPhai}
              >
                <RightOutlined />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Detail;
