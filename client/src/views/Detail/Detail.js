import React, { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebaseConfig";
// import firebase from 'firebase'
import { Image, Button, Input, Radio, Modal, TreeSelect, Carousel } from "antd";
// Thư viện mdb
import { MDBContainer, MDBTable, MDBTableBody } from "mdb-react-ui-kit";
// link
import "./Detail.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Select } from "antd";
import { message } from "antd";
// import { CartProvider } from "../Cart/CartContext";
import { formatCurrency } from "../../util/FormatVnd";
import { format_sale } from "../../util/formatSale";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../../redux/cartSlice";
import CardProduct from "../Home/Card/Card";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const { Option } = Select;
//text area
const { TextArea } = Input;
//select

function Detail() {

  const navigate = useNavigate();

  const [selectedColors, setSelectedColors] = useState([]);

  // Hàm xử lý khi checkbox thay đổi
  // const handleCheckboxChange = (event) => {
  //   const colorId = parseInt(event.target.value); // Chuyển giá trị checkbox thành số
  //   if (event.target.checked) {
  //     // Nếu checkbox được chọn, thêm colorId vào danh sách selectedColors
  //     setSelectedColors([...selectedColors, colorId]);
  //   } else {
  //     // Nếu checkbox bỏ chọn, loại bỏ colorId khỏi danh sách selectedColors
  //     setSelectedColors(selectedColors.filter((id) => id !== colorId));
  //   }
  // };
  const [selectedColor, setSelectedColor] = useState(null);

  const handleCheckboxChange = (event, colorId) => {
    if (event.target.checked) {
      setSelectedColor(colorId);
    } else {
      setSelectedColor(null);
    }
  };
  //
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedMemory2, setSelectedMemory2] = useState(null);

  const handleMemoryChange = (memory) => {
    setSelectedMemory(memory);
  };
  const handleMemoryChange2 = (memory2) => {
    setSelectedMemory2(memory2);
  };
  // ------------------------------------------------------------------------------------------------------------------------main
  //Modal antd
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const dispatch = useDispatch();
  // sự kiện mở modal
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  //sự kiện ok
  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };
  //sự kiện đóng
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };
  // select mới
  const [city, setCity] = useState([]);
  // const [districts, setDistricts] = useState([]);
  // const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCity(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // select city
  const handleCityChange = (value) => {
    const selectedCity = city.find((city) => city.Id === value);
    setSelectedCity(selectedCity);
    setSelectedDistrict(null);
  };
  //select district
  const handleDistrictChange = (value) => {
    const selectedDistrict = selectedCity.Districts.find(
      (district) => district.Id === value
    );
    setSelectedDistrict(selectedDistrict);
  };
  //select ward
  const handleWardChange = (value) => {
    const selectedWard = selectedDistrict.Wards.find(
      (ward) => ward.Id === value
    );
    setSelectedWard(selectedWard);
  };

  //lấy thông tin vào modal
  const { id } = useParams();
  const [thumbnails, setThumbnails] = useState([]);
  const [Detail, setDetail] = useState({});
  const [configuration, setConfiguration] = useState({});
  const htmlContent = Detail.description;
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Gửi yêu cầu GET đến server để lấy thông tin chi tiết của sản phẩm
    getProduct();
  }, [id]);

  const getProduct = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/detail/${id}`)
      .then((response) => {
        // Lưu thông tin chi tiết của sản phẩm vào state
        setDetail(response.data);
        const configurationData = JSON.parse(response.data.configuration);
        setConfiguration(configurationData);

        // Lấy danh sách các thumbnail từ response.data và lưu vào state
        const productThumbnails = [...response.data.thumbnails];
        setThumbnails(productThumbnails);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  // so luong sp
  const [quantity, setQuantity] = useState(1);
  const [productDetail, setProductDetail] = useState(null);

  // Khai báo state cho các trường thông tin cá nhân
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [userName, setUserName] = useState("");
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");
  // const [status, setStatus] = useState('');
  // otp
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  useEffect(() => {
    const fetchedProductDetail = {
      productName: Detail.name,
      price: parseFloat(Detail.price),

      // Các thông tin khác bạn muốn lấy từ cơ sở dữ liệu
    };
    setProductDetail(fetchedProductDetail);
  }, [Detail]);

  const handleSendOTP = () => {
    // Set up reCAPTCHA verifier
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {});

    // Send OTP to user's phone number
    signInWithPhoneNumber(auth, phone, verifier)
      .then((result) => {
        setConfirmationResult(result);
      })
      .catch((error) => {
        if (error.code === "auth/too-many-requests") {
          alert(
            "Bạn đã nhập số điện thoại quá nhiều lần. Vui lòng thử lại sau ít phút."
          );
        } else {
          // Handle other errors
        }
      });
  };

  const handleVerifyOTP = () => {
    // Prompt user to enter OTP
    const code = window.prompt("Enter OTP");

    // Verify OTP
    confirmationResult.confirm(code).then((result) => {
      // User is signed in
      const user = result.user;
      setIsOTPVerified(true); // Cập nhật trạng thái xác minh OTP
    });
  };

  // Hàm xử lý khi người dùng nhấn nút "Xác nhận"
  const handleConfirm = async () => {
    if (!isOTPVerified) {
      // Nếu người dùng chưa xác minh mã OTP
      alert("Vui lòng xác minh mã OTP trước khi gửi đơn hàng");
      return;
    }
    // Lấy thông tin cá nhân của người dùng từ state hoặc form
    const data = {
      quantity: quantity,
      name: userName,
      address: `${selectedCity.Name}, ${selectedDistrict.Name}, ${selectedWard.Name}, ${address}`,
      deliveryMethod: deliveryMethod,
      phone: phone,
      note: note,
      status: "Chưa xác nhận",
    };

    // In ra giá trị của biến data
    console.log("Data:", data);
    // Gửi thông tin đăng ký lên server
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/order/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    // Xử lý kết quả trả về từ server NodeJS
    if (response.ok) {
      // Thông báo thành công
      alert("Thêm thông tin cá nhân thành công");
    } else {
      // Thông báo lỗi
      alert("Có lỗi xảy ra khi thêm thông tin cá nhân");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);

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
    if (Detail.remaining_quantity === 0) {
      message.warning("Sản phẩm đã hết hàng");
      return false;
    }
    // Tạo một đối tượng mới với các thuộc tính cần thiết của sản phẩm
    const newItem = {
      id: Detail.p_ID,
      main_image: Detail.main_image,
      thumbnail: Detail.thumbnails[0].thumbnail,
      shortDescription: Detail.shortDescription,
      price:
        Detail.discount > 0 && Detail.price > Detail.discount
          ? Detail.discount
          : Detail.price,
      brand: Detail.brand,
      quantity: 1,
      totalPrice:
        Detail.discount > 0 && Detail.price > Detail.discount
          ? Detail.discount
          : Detail.price, // Tính giá trị tổng tiền cho sản phẩm
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

  // const {AddToCart}= CartProvider();
  // const handleAddToCart = () => {

  //   AddToCart();
  //   message.success("Sản phẩm đã được thêm vào giỏ hàng");
  // };

  // Hàm xử lý sự kiện khi nhấp vào hình thu nhỏ
  const handleThumbnailHover = (index) => {
    setCurrentImage(index);
    carouselRef.current.goTo(index);
  };




  // Hàm để lấy sản phẩm liên quan
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    const getRelatedProducts = async (brand, categoryID) => {
      let relatedProducts = [];

      const laptopProducts = await fetch(`${process.env.REACT_APP_API_URL}/product/productslaptop`)
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error fetching laptop data:", error);
        });

      const phoneProducts = await fetch(`${process.env.REACT_APP_API_URL}/product/productsPhone`)
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error fetching phone data:", error);
        });

      const products = categoryID === 1 ? laptopProducts : phoneProducts;


      relatedProducts = products.filter(product => product.CategoryID === categoryID && product.id !== Detail.p_ID);

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
      console.log(relatedProducts)
    }
  }, [Detail]);



  // ------------------------
  const handleViewDetailProduct = (products) => {
    // Kiểm tra xem 'id' có tồn tại hay không
    if (!products.id) {
      console.error("Product ID is undefined!");
      return;
    }
    // Lấy danh sách các sản phẩm đã xem từ session storage
    const historysp = JSON.parse(sessionStorage.getItem("products")) || [];
    // Tạo đối tượng sản phẩm mới
    const historyproduct = {
      shortDescription: products.shortDescription,
      price: products.price,
      discount: products.discount,
      main_image: products.main_image,
      thumbnail: products.thumbnail,
      brand: products.brand,
      id: products.id,
    };
    // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
    const isViewed = historysp.some(
      (product) => product.id === historyproduct.id
    );
    // Nếu sản phẩm mới chưa được xem
    if (!isViewed) {
      // Thêm đối tượng sản phẩm mới vào cuối danh sách
      historysp.push(historyproduct);
      // Lưu trữ danh sách các sản phẩm đã xem vào session storage
      sessionStorage.setItem("products", JSON.stringify(historysp));
    }
    navigate(`/detail/${products.id}`);
    window.scrollTo(0, 0)
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
    cpu: 'Thế hệ CPU',
    chip: 'Chip',
    vga: 'Chíp đồ họa',
    screen: 'Màn hình',
    // thêm các cặp khóa-giá trị khác nếu cần
  };


  return (
    <>
      <div>
        <div className="style-1">
          <div className="css-4cffwv">
            <div className="css-1i1dodm tether-abutted tether-abutted-top tether-target-attached-top tether-element-attached-top tether-element-attached-center tether-target-attached-center">
              <div>
                <div className="productDetailPreview style-FMPIO">
                  <div>
                    <MDBContainer>
                      {/* <MDBCarousel showControls showIndicators dark fade>
                        {Detail && Detail.thumbnails && Detail.thumbnails.length > 0 && Detail.thumbnails.map((thumbnail, index) => (
                          <MDBCarouselItem
                            key={index}
                            itemId={index}
                            src={thumbnail.thumbnail}
                            alt={`Image ${index + 1}`}
                          >
                            <img
                              className="d-block w-100"
                              src={thumbnail.thumbnail}
                              alt={`Image ${index + 1}`}
                            />
                          </MDBCarouselItem>
                        ))}
                      </MDBCarousel> */}
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
                          {Detail &&
                            Detail.thumbnails &&
                            Detail.thumbnails.length > 0 &&
                            [...Detail.thumbnails].map((thumbnail, index) => (
                              <div key={index}>
                                {/* img main */}
                                <img
                                  src={
                                    process.env.REACT_APP_API_URL +
                                    thumbnail.thumbnail
                                  }
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
                  {Detail &&
                    Detail.thumbnails &&
                    Detail.thumbnails.length > 0 &&
                    [...Detail.thumbnails].map((thumbnail, index) => (
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
                          src={
                            process.env.REACT_APP_API_URL + thumbnail.thumbnail
                          }
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
                <div>
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
                      <span className="css-n67qkj"> {Detail.brand}</span>
                    </a>
                    <span className="css-1qgvt7n"></span>
                    SKU: {Detail.id}
                    <span className="css-1qgvt7n"></span>
                    Mã vạch: &nbsp;{configuration.part_number}
                  </div>
                </div>
              </div>
              <div className="css-qmrpdk" />
              {/* giá tiền */}
              <div className="css-1q5zfcu">
                {Detail?.discount == 0 ||
                  Detail.price - Detail.discount <= 0 ? (
                  <div className="css-oj899w">
                    {formatCurrency(Detail.price)}
                  </div>
                ) : (
                  <>
                    <div className="css-oj899w">
                      {formatCurrency(Detail.discount)}
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      <span style={{ textDecoration: "line-through" }}>
                        {formatCurrency(Detail.price)}
                      </span>
                      &nbsp;
                      <span style={{ color: "#1435c3" }}>
                        {" "}
                        -{format_sale(Detail.price, Detail.discount)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {/* check box dung lượng*/}
              <div className="css-f1fyi0">
                <div>
                  <label className="custom-checkbox-label">
                    <input
                      type="checkbox"
                      value="8GB"
                      checked={selectedMemory === "8GB"}
                      onChange={() => handleMemoryChange("8GB")}
                      className="custom-checkbox-input"
                    />
                    8GB
                  </label>

                  <label className="custom-checkbox-label">
                    <input
                      type="checkbox"
                      value="16GB"
                      checked={selectedMemory === "16GB"}
                      onChange={() => handleMemoryChange("16GB")}
                      className="custom-checkbox-input"
                    />
                    16GB
                  </label>

                  <p>Selected Memory: {selectedMemory}</p>
                </div>
              </div>
              {/* check box màu sắc*/}
              <div className="css-f1fyi0">
                <div>
                  {Detail.Colorname ? (
                    <div>
                      {Detail.Colorname.map((color) => (
                        <label className="custom-checkbox-label" key={color.id}>
                          <input
                            type="checkbox"
                            value={color.id}
                            onChange={(e) => handleCheckboxChange(e, color.id)}
                            checked={selectedColor === color.id}
                            className="custom-checkbox-input"
                          />
                          {color.Colorname}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <span></span>
                  )}
                </div>
              </div>

              <div className="css-f1fyi0">
                <div width="100%" color="divider" className="css-1fm9yfq"></div>
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
                <div width="100%" color="divider" className="css-1fm9yfq"></div>
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
                        {Detail.name}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={1}>Màu sắc</td>
                      <td colSpan={3}>
                        {Detail.Colorname ? (
                          <div>
                            {Detail.Colorname.map((color, index) => (
                              <span key={color.id}>
                                {color.Colorname}
                                {index < Detail.Colorname.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span></span>
                        )}
                      </td>
                    </tr>
                    { (configuration.demandn) && (
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
                    <td colSpan={1}>{configuration.screen ? 'Màn hình' : (configuration.chip ? 'Màn hình' : '')}</td>
                    <td colSpan={3}>{configuration.screen || configuration.screen}</td>
                  </tr>
                  <tr>
                    <td style={{ backgroundColor: "#f6f6f6" }} colSpan={1}>{configuration.cpu ? 'CPU' : (configuration.chip ? 'Chip' : '')}</td>
                    <td style={{ backgroundColor: "#f6f6f6" }} colSpan={3}>
                      {configuration.cpu || configuration.chip}
                    </td>
                  </tr>
                  { (configuration.vga || configuration.resolution) && (
                    <tr>
                      <td colSpan={1}>{configuration.vga ? 'Chip đồ họa' : (configuration.resolution ? 'Phân giải' : '')}</td>
                      <td colSpan={3}>{configuration.vga || configuration.resolution}</td>
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
                      {configuration.rom}
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

        {/* main */}
        {/* modal */}
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
        >
          {/* body */}
          {productDetail && (
            <div>
              <h2>Thông tin sản phẩm</h2>
              <Form layout="vertical">
                <Form.Item label="Tên sản phẩm">
                  <Input
                    className="product-name"
                    value={Detail.name}
                    disabled
                  />
                </Form.Item>
                <Form.Item label="Hình">
                  <Image width={380} src={Detail.avatar}></Image>
                </Form.Item>
                <Form.Item label="Giá">
                  <Input
                    value={productDetail.price * quantity + "đ"}
                    disabled
                  />
                </Form.Item>
                <Form.Item label="Số lượng">
                  <Button onClick={() => setQuantity(quantity - 1)}>-</Button>
                  <Input
                    value={quantity}
                    readOnly
                    style={{ width: 60, textAlign: "center" }}
                  />
                  <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
                </Form.Item>
              </Form>
            </div>
          )}
          <h2>Thông tin người dùng</h2>
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              maxWidth: 800,
            }}
          >
            <Form.Item name="disabled" valuePropName="checked"></Form.Item>
            {/* Giới tính */}
            <Form.Item label="Giới tính">
              <Radio.Group defaultValue="man">
                <Radio value="man">Anh</Radio>
                <Radio value="male">Chị</Radio>
              </Radio.Group>
            </Form.Item>
            {/* Tên */}
            <Form.Item label="Tên">
              <Input
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
            </Form.Item>
            {/* form select */}

            {/*  */}
            <Form.Item label="Thành phố">
              <Select onChange={handleCityChange}>
                {city.map((city) => (
                  <Option key={city.Id} value={city.Id}>
                    {city.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Huyện">
              <Select onChange={handleDistrictChange}>
                {selectedCity &&
                  selectedCity.Districts.map((district) => (
                    <Option key={district.Id} value={district.Id}>
                      {district.Name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item label="Xã">
              <Select onChange={handleWardChange}>
                {selectedDistrict &&
                  selectedDistrict.Wards.map((ward) => (
                    <Option key={ward.Id} value={ward.Id}>
                      {ward.Name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            {/* Địa chỉ chi tiết */}
            <Form.Item label="Địa chỉ chi tiết">
              <Input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </Form.Item>

            <Form.Item label="Giao hàng">
              <TreeSelect
                onChange={(value) => setDeliveryMethod(value)}
                value={deliveryMethod}
                treeData={[
                  {
                    title: "Giờ hành chính",
                    value: "GHC",
                  },
                  {
                    title: "Tất cả ngày trong tuần",
                    value: "TCNTT",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input onChange={(e) => setPhone(e.target.value)} value={phone} />
            </Form.Item>

            <Form.Item>
              <Button onClick={handleSendOTP}>Gửi mã OTP</Button>
              <div id="recaptcha-container"></div>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleVerifyOTP}>Nhập mã OTP đã gửi</Button>
            </Form.Item>

            <Form.Item label="Ghi chú">
              <TextArea
                onChange={(e) => setNote(e.target.value)}
                value={note}
                rows={4}
              />
            </Form.Item>

            <Form.Item>
              <Button onClick={handleConfirm}>Xác nhận</Button>
            </Form.Item>
          </Form>
        </Modal>
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
                  <td colSpan={1}>
                    Bảo hành
                  </td>
                  <td
                    className="back-gr-tiet"
                    colSpan={3}
                  >
                    {configuration.guarantee}
                  </td>
                </tr>
                <tr>
                  <td className="style-tin-chung" colSpan={1}>
                    Thông tin chung
                  </td>
                </tr>
                <tr>
                  <td colSpan={1}>
                    Series
                  </td>
                  <td colSpan={3}>
                    {Detail.name}
                  </td>
                </tr>
                <tr>

                  <td colSpan={1}>Màu sắc</td>
                  <td colSpan={3}>
                    {Detail.Colorname ? (
                      <div>
                        {Detail.Colorname.map((color, index) => (
                          <span key={color.id}>
                            {color.Colorname}
                            {index < Detail.Colorname.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </td>

                </tr>
                { (configuration.demandn) && (
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
                  <td colSpan={1}>{configuration.cpu ? 'CPU' : (configuration.chip ? 'Chip' : '')}</td>
                  <td colSpan={3}>
                    {configuration.cpu || configuration.chip}
                  </td>
                </tr>
                { (configuration.vga || configuration.resolution) && (
                  <tr>
                    <td colSpan={1}>{configuration.vga ? 'Chip đồ họa' : (configuration.resolution ? 'Phân giải' : '')}</td>
                    <td colSpan={3}>{configuration.vga || configuration.resolution}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={1}>Màn hình</td>
                  <td colSpan={3}>{configuration.screen}</td>
                </tr>
                <tr>
                  <td colSpan={1}>
                    Ram
                  </td>
                  <td colSpan={3}>
                    {configuration.ram}
                  </td>
                </tr>
                <tr>
                  <td colSpan={1}>
                    Lưu trữ
                  </td>
                  <td colSpan={3}>
                    {configuration.rom}
                  </td>
                </tr>
                { (configuration.maximum_number_of_storage_ports || configuration.charging_port) && (
                <tr>
                  <td colSpan={1}>{configuration.maximum_number_of_storage_ports ? 'Số cổng lưu trữ tối đa' : (configuration.charging_port ? 'Cổng sạc' : '')}</td>
                  <td colSpan={3}>
                    {configuration.maximum_number_of_storage_ports || configuration.charging_port}
                  </td>
                </tr>
                )}
                { (configuration.M2_slot_type_supported || configuration.mobile_network) && (
                  <tr>
                    <td colSpan={1}>{configuration.M2_slot_type_supported ? 'Kiểu khe M.2 hỗ trợ' : (configuration.mobile_network ? 'Mạng di động' : '')}</td>
                    <td colSpan={3}>
                      {configuration.M2_slot_type_supported || configuration.mobile_network}
                    </td>
                  </tr>
                )}
                { (configuration.output_port || configuration.rear_camera) && (
                  <tr>
                    <td colSpan={1}>{configuration.output_port ? 'Cổng xuất hình' : (configuration.rear_camera ? 'Camera sau' : '')}</td>
                    <td colSpan={3}>{configuration.output_port || configuration.rear_camera}</td>
                  </tr>
                )}
                { (configuration.connector || configuration.front_camera) && (
                <tr>
                  <td colSpan={1}>{configuration.connector ? 'Cổng kết nối' : (configuration.front_camera ? 'Camera trước' : '')}</td>
                  <td colSpan={3}>
                    {configuration.connector || configuration.front_camera}
                  </td>
                </tr>
                )}
                { (configuration.wireless_connectivity || configuration.wifi) && (
                <tr>
                  <td colSpan={1}>{configuration.wireless_connectivity ? 'Kết nối không dây' : (configuration.wifi ? 'Wifi' : '')}</td>
                  <td colSpan={3}>{configuration.wireless_connectivity || configuration.wifi}</td>
                </tr>
                )}
                { (configuration.keyboard || configuration.gps) && (
                  <tr>
                    <td colSpan={1}>{configuration.keyboard ? 'Bàn phím' : (configuration.gps ? 'GPS' : '')}</td>
                    <td colSpan={3}>
                      {configuration.keyboard || configuration.gps}
                    </td>
                  </tr>
                )}
                { (configuration.bluetooth) && (
                  <tr>
                    <td colSpan={1}>Bluetooth</td>
                    <td colSpan={3}>
                      {configuration.bluetooth}
                    </td>
                  </tr>
                )}
                { (configuration.headphone_jack) && (
                  <tr>
                    <td colSpan={1}>Tai nghe</td>
                    <td colSpan={3}>
                      {configuration.headphone_jack}
                    </td>
                  </tr>
                )}
                { (configuration.size) && (
                  <tr>
                    <td colSpan={1}>Kích thước</td>
                    <td colSpan={3}>
                      {configuration.size}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={1}>
                    Pin
                  </td>
                  <td colSpan={3}>
                    {configuration.pin}
                  </td>
                </tr>
                <tr>
                  <td colSpan={1}>Khối lượng</td>
                  <td colSpan={3}>{configuration.mass}</td>
                </tr>
                
                { (configuration.accessory) && (
                  <>
                    <tr>
                      <td className="style-tin-chung" colSpan={1}>
                        Thông tin khác
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="style-tin-chung"
                        colSpan={1}
                      >
                        Phụ kiện đi kèm
                      </td>
                      <td colSpan={3}>
                        {configuration.accessory}
                      </td>
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
    </>
  );
}

export default Detail;
