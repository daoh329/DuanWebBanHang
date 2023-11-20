import React, { useState, useEffect, useRef } from "react";
// import firebase from 'firebase'
import { Image, Modal, Carousel } from "antd";
// Thư viện mdb
import { MDBContainer, MDBTable, MDBTableBody } from "mdb-react-ui-kit";
// link
import "./Detail.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { formatCurrency } from "../../util/FormatVnd";
import { format_sale } from "../../util/formatSale";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../../redux/cartSlice";
import { formatCapacity } from "../../util/formatCapacity";

import { useNavigate } from "react-router-dom";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import CardProduct from "../Card/Card";

function Detail() {
  const navigate = useNavigate();

  //Modal antd
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const dispatch = useDispatch();

  // sự kiện mở modal
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  //sự kiện ok
  const handleOk = () => {
    setIsModalOpen2(false);
  };
  //sự kiện đóng
  const handleCancel = () => {
    setIsModalOpen2(false);
  };

  //lấy thông tin vào modal
  const { id } = useParams();
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

  useEffect(() => {
    if (Detail) {
      let cp = [];
      [...Detail.variations].forEach((element) => {
        cp.push(element.capacity);
      });
      const sortColor = cp.sort((a, b) => a - b);
      setCapacities([...new Set(sortColor)]);
      setSelectedCapacity(sortColor[0]);
      colorChangeByCapacity(Detail, cp[0]);
    }
  }, [Detail]);

  // change color
  useEffect(() => {
    if (selectedColor && Detail) {
      const images = [...Detail.images].filter(
        (element) => element.color === selectedColor
      );
      setImagesSelected(images[0].path);
    }
  }, [selectedColor, Detail]);

  // change capacity
  useEffect(() => {
    if (selectedCapacity && Detail) {
      // Thay đổi color theo capacity
      colorChangeByCapacity(Detail, selectedCapacity);
    }
  }, [selectedCapacity, Detail]);

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
    setSelectedColor(cl[0]);
  };

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

  useEffect(() => {
    id && getProduct();
  }, [id]);

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

  // them giỏ hàng
  const cart = useSelector((state) => state.cart.products);
  const handleAddToCart = () => {
    // Check quantity
    if (Detail.remaining_quantity === 0) {
      message.warning("Sản phẩm đã hết hàng");
      return false;
    }
    // Check color
    if (!selectedColor) {
      message.warning("Vui lòng chọn màu sắc của sản phẩm");
      return false;
    }

    // Tạo một đối tượng mới với các thuộc tính cần thiết của sản phẩm
    const newItem = {
      id: Detail.id,
      main_image: Detail.main_image,
      thumbnail: imagesSelected[0],
      shortDescription: Detail.shortDescription,
      capacity: selectedCapacity,
      price: variationSelected.price,
      discount: variationSelected.discount_amount,
      brand: Detail.brand,
      color: selectedColor,
      //----
      quantity: 1,
      totalPrice: variationSelected.price - variationSelected.discount_amount,
    };

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === newItem.id
    );

    if (existingItemIndex !== -1) {
      // Sản phẩm đã tồn tại trong giỏ hàng, chỉ hiển thị thông báo
      message.success("Sản phẩm đã có trong giỏ hàng");
      return true;
    } else {
      // Thêm sản phẩm vào giỏ hàng
      const updatedCart = [...cart, newItem];
      // update redux state
      dispatch(addProductToCart(updatedCart));
      message.success("Sản phẩm đã được thêm vào giỏ hàng");
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
    // Kiểm tra xem 'id' có tồn tại hay không
    if (!products.id) {
      console.error("Product ID is undefined!");
      return;
    }
    // Lấy danh sách các sản phẩm đã xem từ session storage
    const historysp = JSON.parse(sessionStorage.getItem("products")) || [];

    // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
    const isViewed = historysp.some((product) => product.id === products.id);
    // Nếu sản phẩm mới chưa được xem
    if (!isViewed) {
      // Thêm đối tượng sản phẩm mới vào cuối danh sách
      historysp.push(products);
      // Lưu trữ danh sách các sản phẩm đã xem vào session storage
      sessionStorage.setItem("products", JSON.stringify(historysp));
    }
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
  const labels = {
    cpu: "Thế hệ CPU",
    chip: "Chip",
    vga: "Chíp đồ họa",
    screen: "Màn hình",
    // thêm các cặp khóa-giá trị khác nếu cần
  };

  return (
    <>
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
                {capacities && capacities.length > 1 && (
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
                            style={
                              selectedColor === color
                                ? {
                                    borderColor: "#024dbc",
                                    color: "#024dbc",
                                  }
                                : {}
                            }
                            key={index}
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
                        {formatCurrency(
                          selectedCapacity.price ? selectedCapacity.price : 0
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="css-oj899w">
                          {formatCurrency(
                            variationSelected.price -
                              variationSelected.discount_amount || 0
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

                {/* ------------------------------------------------------------ */}
                <div className="css-f1fyi0">
                  <div
                    width="100%"
                    color="divider"
                    className="css-1fm9yfq"
                  ></div>
                </div>

                <div className="css-1gs5ebu" style={{ display: "none" }}>
                  <div className="css-ixp6xz">Khuyến mãi đã nhận</div>
                  {/* phần khuyến mãi */}
                </div>
                <div className="css-30n8gl" style={{ display: "none" }}>
                  <div className="css-ixp6xz">
                    Chọn 1 trong những khuyến mãi sau
                  </div>
                  <div
                    data-content-region-name="optionalPromotion"
                    data-track-content="true"
                    data-content-name="Aug 2023 | New School Year, New Gear 160"
                    data-content-target="productDetail"
                    data-content-payload='{"sku":"220300268","action":"unselect","promotionID":472572,"screenName":"productDetail","index":0}'
                    className="att-product-detail-selection-promotion-472572 css-1nz6s82"
                    direction="row"
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
                      direction="column"
                      height="100%"
                      className="css-1qs7kih style-rjMwc"
                      id="style-rjMwc"
                    >
                      <div>
                        <div className="att-product-detail-selection-promotion-title-472572 css-1j2vnz6">
                          Giảm 4.000.000₫ (áp dụng vào giá sản phẩm)
                        </div>
                        <div className="att-product-detail-selection-promotion-description-472572 css-756cgs">
                          Khuyến mãi áp dụng khi mua tối thiểu 1 sản phẩm
                        </div>
                      </div>
                      <div width="100%" direction="row" className="css-1rt5kwy">
                        <div className="att-product-detail-selection-promotion-ended-at-472572 css-2cgl77">
                          HSD: 31/8/2023
                        </div>
                        <div className="css-1aa534q">Bỏ chọn</div>
                      </div>
                    </div>
                  </div>
                </div>

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
                <div
                  style={{ textAlign: "start" }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
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
                      <tr>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={1}>
                          Series
                        </td>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={3}>
                          {configuration.series}
                        </td>
                      </tr>
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
                          Cấu hình chi tiết
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={1}>
                          {configuration.screen
                            ? "Màn hình"
                            : configuration.chip
                            ? "Màn hình"
                            : ""}
                        </td>
                        <td colSpan={3}>
                          {configuration.screen || configuration.screen}
                        </td>
                      </tr>
                      <tr>
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
                      </tr>
                      {(configuration.vga || configuration.resolution) && (
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
                      )}
                      <tr>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={1}>
                          Ram
                        </td>
                        <td style={{ backgroundColor: "#f6f6f6" }} colSpan={3}>
                          {configuration.ram}
                        </td>
                      </tr>
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
                <div onClick={showModal2} className="xem-tiet">
                  Xem chi tiết cấu hình
                </div>
              </div>
            </div>
          </div>

          {/* modal xem-chi-tiet */}
          <Modal
            open={isModalOpen2}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
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
                  <tr>
                    <td colSpan={1}>Series</td>
                    <td colSpan={3}>{configuration.series}</td>
                  </tr>
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
                  <tr>
                    <td colSpan={1}>Hệ điều hành</td>
                    <td colSpan={3}>{configuration.os}</td>
                  </tr>
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
                  <tr>
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
                  </tr>
                  {(configuration.vga || configuration.resolution) && (
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
                  )}
                  <tr>
                    <td colSpan={1}>Màn hình</td>
                    <td colSpan={3}>{configuration.screen}</td>
                  </tr>
                  <tr>
                    <td colSpan={1}>Ram</td>
                    <td colSpan={3}>{configuration.ram}</td>
                  </tr>
                  <tr>
                    <td colSpan={1}>Rom</td>
                    <td colSpan={3}>{formatCapacity(selectedCapacity)}</td>
                  </tr>
                  {(configuration.maximum_number_of_storage_ports ||
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
                  )}
                  {(configuration.M2_slot_type_supported ||
                    configuration.mobile_network) && (
                    <tr>
                      <td colSpan={1}>
                        {configuration.M2_slot_type_supported
                          ? "Kiểu khe M.2 hỗ trợ"
                          : configuration.mobile_network
                          ? "Mạng di động"
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {configuration.M2_slot_type_supported ||
                          configuration.mobile_network}
                      </td>
                    </tr>
                  )}
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
                  {(configuration.connector || configuration.front_camera) && (
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
                  )}
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
                  {configuration.size && (
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
                  )}
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
                    <CardProduct
                      key={index}
                      item={item}
                      items={relatedProducts}
                      onClick={handleViewDetailProduct}
                    />
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
