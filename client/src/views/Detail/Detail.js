import React, { useState, useEffect, useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebaseConfig";
// import firebase from 'firebase'
import {
  Image,
  Button,
  Checkbox,
  Input,
  Radio,
  Modal,
  TreeSelect,
  Carousel
} from "antd";
// Thư viện mdb
import { MDBCarousel, MDBCarouselItem, MDBContainer } from "mdb-react-ui-kit";
// link
import "./Detail.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Select } from "antd";

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
const { Option } = Select;
//text area
const { TextArea } = Input;
//select

function Detail() {
  // ------------------------------------------------------------------------------------------------------------------------main
  //Modal antd
  const [isModalOpen, setIsModalOpen] = useState(false);
  // sự kiện mở modal
  const showModal = () => {
    setIsModalOpen(true);
  };
  //sự kiện ok
  const handleOk = () => {
    setIsModalOpen(false);
  };
  //sự kiện đóng
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // select mới
  const [city, setCity] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
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
  const [Detail, setDetail] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    // Gửi yêu cầu GET đến server để lấy thông tin chi tiết của sản phẩm
    axios.get(`${process.env.REACT_APP_API_URL}/product/detail/${id}`)
      .then(response => {
        // Lưu thông tin chi tiết của sản phẩm vào state
        setDetail(response.data);

        // Lấy danh sách các thumbnail từ response.data và lưu vào state
        const productThumbnails = response.data.thumbnails;
        setThumbnails(productThumbnails);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id]);

 // Tạo các mục cho Carousel từ danh sách thumbnails
 const carouselItems = thumbnails.map(thumbnail => (
  <div key={thumbnail.id}>
    <img src={thumbnail.thumbnail} alt={`Thumbnail ${thumbnail.id}`} />
  </div>
));

  // so luong sp
  const [quantity, setQuantity] = useState(1);
  const [productDetail, setProductDetail] = useState(null);

  // Khai báo state cho các trường thông tin cá nhân
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [userName, setUserName] = useState('');
  const [note, setNote] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
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
          alert("Bạn đã nhập số điện thoại quá nhiều lần. Vui lòng thử lại sau ít phút.");
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
      alert('Vui lòng xác minh mã OTP trước khi gửi đơn hàng');
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
      status: 'Chưa xác nhận',
    };

    // In ra giá trị của biến data
    console.log("Data:", data);
    // Gửi thông tin đăng ký lên server
    const response = await fetch(`${process.env.REACT_APP_API_URL}/order/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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

  return (
    <>
      <div>
        <div className="css-rfz8yf snipcss-lgA99 style-BooKL" id="style-BooKL">
          <div className="css-4cffwv">
            <div className="css-1i1dodm tether-abutted tether-abutted-top tether-target-attached-top tether-element-attached-top tether-element-attached-center tether-target-attached-center">
              <div>
                {/* day la de hinhf */}
                <div className="productDetailPreview style-FMPIO">
                  <div width="100%" height="100%">
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
                      <div style={{ width: '100%', position: 'relative' }}>
                        <button className="scroll-btn" id="scroll-left-btn" onClick={handlePreviousClick}>
                        <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <button className="scroll-btn" id="scroll-right-btn" onClick={handleNextClick}>
                        <i class="fa-solid fa-chevron-right"></i>
                        </button>
                        <Carousel autoplay ref={carouselRef}>
                          {Detail &&
                            Detail.thumbnails &&
                            Detail.thumbnails.length > 0 &&
                            Detail.thumbnails.map((thumbnail, index) => (
                              <div key={index}>
                                <img src={thumbnail.thumbnail} alt={`Image ${index + 1}`} />
                              </div>
                            ))}

                        </Carousel>

                      </div>

                    </MDBContainer>

                  </div>
                </div>


                {/* Slider hình nhỏ */}
                <div className="thumbnail-slider">
                  {Detail && Detail.thumbnails && Detail.thumbnails.length > 0 && Detail.thumbnails.map((thumbnail, index) => (
                    <Image.PreviewGroup
                      key={index}
                      preview={{
                        onChange: (current, prev) =>
                          console.log(`current index: ${current}, prev index: ${prev}`),
                      }}
                    >
                      <Image width={80} src={thumbnail.thumbnail} />
                    </Image.PreviewGroup>
                  ))}
                </div>
              </div>
              {/* hiển thị chi tiết  */}

              {/* <div className="css-1nv5d5l">
                - CPU: AMD Ryzen 7 6800H
                <br />
                - Màn hình: 15.6" IPS (1920 x 1080),144Hz
                <br />
                - RAM: 1 x 8GB DDR5 4800MHz
                <br />
                - Đồ họa: RTX 3050 4GB GDDR6 / AMD Radeon 680M
                <br />
                - Lưu trữ: 512GB SSD M.2 NVMe /
                <br />
                - Hệ điều hành: Windows 11 Home
                <br />
                - Pin: 4 cell 56 Wh Pin liền
                <br />- Khối lượng: 2.1kg
              </div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="css-gmt3b"
                color="link500"
              >
                <div
                  type="body"
                  className="button-text css-msc1w4"
                  color="link500"
                >
                  Xem thông tin chi tiết
                </div>
              </a> */}
            </div>
            <div className="css-6b3ezu">
              {/* ten, mã , thương hiệu */}
              <div>
                <h1 className="css-4kh4rf">{Detail.name}</h1>
                <div>
                  <div
                    type="caption"
                    color="textSecondary"
                    className="css-1qm2d75 style-La8m4"
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
                    SKU: 220300268
                    <span className="css-1qgvt7n"></span>
                    Mã vạch: &nbsp;603122
                  </div>
                </div>
              </div>

              <div className="css-qmrpdk"></div>
              {/* giá tiền */}
              <div className="css-1q5zfcu">
                <div
                  type="title"
                  className="att-product-detail-latest-price css-oj899w"
                  color="primary500"
                >
                  {Detail.price}₫
                </div>
                <div className="css-3mjppt">
                  <div
                    type="caption"
                    className="att-product-detail-retail-price css-1gnksc0"
                    color="textSecondary"
                  >
                    26.990.000₫
                  </div>
                  <div
                    type="caption"
                    color="primary500"
                    className="css-1qruly8"
                  >
                    -14.82%
                  </div>
                </div>
              </div>
              <div className="css-f1fyi0">
                <div width="100%" color="divider" className="css-1fm9yfq"></div>
              </div>
              <div className="css-1gs5ebu">
                <div className="css-ixp6xz">Khuyến mãi đã nhận</div>
                {/* phần khuyến mãi */}
              </div>
              <div className="css-30n8gl">
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
                    onClick={showModal}
                  // sự kiện cho modal
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

        {/* modal */}
        <Modal
          title="Basic Modal"
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
                  <Input className="product-name" value={Detail.name} disabled />
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
        {/*  */}
      </div>
    </>
  );
}

export default Detail;