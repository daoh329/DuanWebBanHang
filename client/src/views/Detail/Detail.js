import React, { useState,useEffect } from "react";
// Thư viện mdb
import {
  MDBCarousel,
  MDBCarouselItem,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
// link
import "./Detail.css";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Detail() {
// 

  //select
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const provinces = [
    { id: 1, name: 'Hồ Chí Minh ', districts: ['Thủ Đức', 'Biên Hòa', 'Vũng Tàu', 'Mỹ Tho', 'Bà Rịa', 'Tân An', 'Tây Ninh', 'Đồng Xoài', 'Đồng Xoài'] },
    { id: 2, name: 'Đắk Lăk', districts: ['Buôn Ma Thuột', 'Buôn Hồ', 'Ea Kar', 'Ea Súp', 'Krông Ana', 'Krông Bông', 'Krông Búk', 'M Drắk'] },
    { id: 3, name: 'Đà nẵng', districts: ['Quận I', 'Quận II', 'Quận III'] },

    // ... other provinces
  ];

  const handleProvinceChange = value => {
    const selectedProvinceData = provinces.find(province => province.id === value);
    setSelectedProvince(selectedProvinceData);
    setSelectedDistrict(null); // Reset selected district
  };

  const handleDistrictChange = value => {
    setSelectedDistrict(value);
  };

//
  const { id } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `https://64df1e7171c3335b25821aef.mockapi.io/users/${id}`
        );
        setUser(res && res.data && res.data ? res.data : []);
        console.log("check:", res);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [id]);
  // usestate của modal
  const [scrollableModal, setScrollableModal] = useState(false);
  //formik validate form
  // const formik = useFormik({
  //   initialValues: {
  //     firstName: "",
  //     address: "",
  //     phoneNumber: "",
  //   },
  //   validationSchema: Yup.object({
  //     firstName: Yup.string().required("Vui lòng nhập tên."),
  //     address: Yup.string().required("Vui lòng nhập địa chỉ."),
  //     phoneNumber: Yup.number().required("Vui lòng nhập số điện thoại."),
  //   }),
  //   onSubmit: (values) => {
  //     // Xử lý dữ liệu gửi đi sau khi xác thực thành công
  //     console.log(values);
  //   },
  // });
  //form
  const [quantity, setQuantity] = useState(1);
  const [productDetail, setProductDetail] = useState(null);
  useEffect(() => {

  const isEmptyObj = Object.keys(user).length === 0;
  const handleBackButton = () => {
    navigate(`/users`);
  };
  //
  // usestate của modal
  const [scrollableModal, setScrollableModal] = useState(false);
  //
  const formik = useFormik({
    initialValues: {
      firstName: "",
      address: "",
      // email: '',
      phoneNumber: "",
      // password: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Vui lòng nhập tên."),
      address: Yup.string().required("Vui lòng nhập địa chỉ."),
      // email: Yup.string().email('Email không hợp lệ.').required('Vui lòng nhập email.'),
      phoneNumber: Yup.number().required("Vui lòng nhập số điện thoại."),
      // password: Yup.string().required('Vui lòng nhập mật khẩu.'),
    }),
    onSubmit: (values) => {
      // Xử lý dữ liệu gửi đi sau khi xác thực thành công
      console.log(values);
    },
  });
  //
  return (
    <>
      <div>
       
      
            <div
              className="css-rfz8yf snipcss-lgA99 style-BooKL"
              id="style-BooKL"
            >
              <div className="css-4cffwv">
                <div className="css-1i1dodm tether-abutted tether-abutted-top tether-target-attached-top tether-element-attached-top tether-element-attached-center tether-target-attached-center">
                  <div>
                    <div className="productDetailPreview style-FMPIO">
                      <div width="100%">
                        {/*  className="css-j4683g" */}
                        {/* SLIder */}
                        <MDBCarousel showControls showIndicators dark fade>
                          <MDBCarouselItem
                            className="w-100 d-block"
                            itemId={1}
                          src={user.avatar}
                            alt="..."
                          ></MDBCarouselItem>
                          <MDBCarouselItem
                            className="w-100 d-block"
                            itemId={2}
                            src="https://lh3.googleusercontent.com/wFaBZbSH4BXYvOzCWFAt3NO1HgblJ1ygVmXTUx1BCmd0qL_xZkkpcA9UEag8i79qneu2r0A9T526sXCbPzeFXkI4DGCtmbV-=rw"
                            alt="..."
                          ></MDBCarouselItem>

                          <MDBCarouselItem
                            className="w-100 d-block"
                            itemId={3}
                            src="https://lh3.googleusercontent.com/lPsRWb6bFndzZQ9EFw-xVJO2WZUBqmpy5NGq2ueVdOSI89r8TFHSaNI_DcGHMyFK3mCj4cU8RoH7sXtcSLk89Tu0kBqkp6N8=rw"
                            alt="..."
                          ></MDBCarouselItem>
                        </MDBCarousel>
                      </div>
                    </div>
                    {/* slider hình nhỏ */}
                    {/* <div className="css-12isv00">
          <div className="css-4ok7dy">
            <div height="50px" width="50px" className="css-1dje825">
              <img
                src="https://lh3.googleusercontent.com/lPsRWb6bFndzZQ9EFw-xVJO2WZUBqmpy5NGq2ueVdOSI89r8TFHSaNI_DcGHMyFK3mCj4cU8RoH7sXtcSLk89Tu0kBqkp6N8=rw"
                loading="lazy"
                decoding="async"
                alt="Laptop ASUS ROG Strix G15 G513RC-HN038W (Ryzen 7 6800H/RAM 8GB/512GB SSD/ Windows 11)"
                id="style-g8cob"
                className="style-g8cob"
              />
            </div>
          </div>
          <div className="css-4ok7dy">
            <div height="50px" width="50px" className="css-1dje825">
              <img
                src="https://lh3.googleusercontent.com/wFaBZbSH4BXYvOzCWFAt3NO1HgblJ1ygVmXTUx1BCmd0qL_xZkkpcA9UEag8i79qneu2r0A9T526sXCbPzeFXkI4DGCtmbV-=rw"
                loading="lazy"
                decoding="async"
                alt="Laptop Asus ROG Strix G G513RC-HN038W"
                id="style-2ii5p"
                className="style-2ii5p"
              />
            </div>
          </div>
          <div className="css-4ok7dy">
            <div height="50px" width="50px" className="css-1dje825">
              <img
                src="https://lh3.googleusercontent.com/L0uhU3i4mXCqExP55YUDeaD3AmqNOfx2Nmxvdk5aD5b9lRzVZ20liMY9F-zhn0CEIy6M8qpNym-4HIpk2ERmftZG8iONNG2y=rw"
                loading="lazy"
                decoding="async"
                alt="Laptop Asus ROG Strix G G513RC-HN038W"
                id="style-Pt4Hw"
                className="style-Pt4Hw"
              />
            </div>
          </div>
          <div className="css-4ok7dy">
            <div height="50px" width="50px" className="css-1dje825">
              <img
                src="https://lh3.googleusercontent.com/0QDSMA5KSsuiMNe55B_LwvS9-C2tXEZNAkUDx_-seGxqbr5bLhftduTYQZdE-TINTPGKwepBY-V2V8_KoMiCxVrVur8lfFeV=rw"
                loading="lazy"
                decoding="async"
                alt="Laptop Asus ROG Strix G G513RC-HN038W"
                id="style-YViLt"
                className="style-YViLt"
              />
            </div>
          </div>
          <div className="css-1qorxog">
            <div height="50px" width="50px" className="css-1dje825">
              <img
                src="https://lh3.googleusercontent.com/Hbe8oJ8locI181eLzTt4nmjHMf5Qs2cpgJ1p6XL4tC9FFia0I7LbY9UHY9tzUDpyzYjlS9aNq0Yhcp6uWZwhl2MZvaDyp3XX=rw"
                loading="lazy"
                decoding="async"
                alt="Laptop Asus ROG Strix G G513RC-HN038W"
                id="style-vY6xg"
                className="style-vY6xg"
              />
            </div>
          </div>

        </div> */}
                  </div>
                  <div className="css-1o4pdv8">
                    <div
                      width="100%"
                      color="divider"
                      className="css-1fm9yfq"
                    ></div>
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
      </div> */}
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
                  </a>
                </div>
                <div className="css-6b3ezu">
                  {/* ten, mã , thương hiệu */}
                  <div>
                    <h1 className="css-4kh4rf">
                      {user.name}
                    </h1>
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
                          <span className="css-n67qkj">ASUS</span>
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
                      {user.Price}₫
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
                    <div
                      width="100%"
                      color="divider"
                      className="css-1fm9yfq"
                    ></div>
                  </div>
                  <div className="css-1gs5ebu">
                    <div className="css-ixp6xz">Khuyến mãi đã nhận</div>
                    {/* phần khuyến mãi */}
                    {/* <div direction="column" className="css-cs5l6d">
          <div
            className="att-product-detail-default-promotion-478703 css-ixczt2"
            direction="row"
          >
            <div className="css-67qlqa">
              <img
                src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                height={25}
                width={25}
              />
            </div>
            <span className="css-f0vs3e style-HrL9K" id="style-HrL9K">
              <span className="css-1lfpde8">
                1x Mã giảm thêm 5% tối đa 300.000đ cho toàn bộ sản phẩm Điện Máy
                - Điện Gia Dụng
              </span>
            </span>
          </div>
          <div
            className="att-product-detail-default-promotion-476721 css-ixczt2"
            direction="row"
          >
            <div className="css-67qlqa">
              <img
                src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                height={25}
                width={25}
              />
            </div>
            <span className="css-f0vs3e style-nGnMb" id="style-nGnMb">
              <span className="css-1lfpde8">
                1x Mã giảm thêm 500.000đ cho tai nghe Sony Inzone H3 khi mua kèm
                Laptop Gaming
              </span>
            </span>
          </div>
          <div
            className="att-product-detail-default-promotion-465873 css-ixczt2"
            direction="row"
          >
            <div className="css-67qlqa">
              <img
                src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                height={25}
                width={25}
              />
            </div>
            <span className="css-f0vs3e style-gFgtv" id="style-gFgtv">
              <span className="css-1lfpde8">
                1x Mã giảm thêm 150.000 cho một số chuột Logitech, MSI, Newmen,
                tai nghe Zidli
              </span>
            </span>
          </div>
          <div
            className="att-product-detail-default-promotion-465868 css-ixczt2"
            direction="row"
          >
            <div className="css-67qlqa">
              <img
                src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                height={25}
                width={25}
              />
            </div>
            <span className="css-f0vs3e style-BQTnj" id="style-BQTnj">
              <span className="css-1lfpde8">
                1x Ưu đãi mua Chuột Logitech G903 Hero với giá 1.300.000
              </span>
            </span>
          </div>
          <div
            className="att-product-detail-default-promotion-471793 css-ixczt2"
            direction="row"
          >
            <div className="css-67qlqa">
              <img
                src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                height={25}
                width={25}
              />
            </div>
            <span className="css-f0vs3e style-2EOLF" id="style-2EOLF">
              <span className="css-1lfpde8">
                1x Bộ hòa mạng SKY89S (Quà tặng) 1x Hộp quà Sinh Nhật Phong Vũ
                (Quà tặng)
              </span>
            </span>
          </div>
          <div
            className="att-product-detail-default-promotion-479377 css-ixczt2"
            direction="row"
          >
            <div className="css-67qlqa">
              <img
                src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                height={25}
                width={25}
              />
            </div>
            <span className="css-f0vs3e style-idjvb" id="style-idjvb">
              <span className="css-1lfpde8">
                1x Balo laptop Targus 15.6 TSB883 Black (Safire) (Quà tặng -
                logo Phong Vũ)
              </span>
            </span>
          </div>
          <div
            className="att-product-detail-default-promotion-465937 css-ixczt2"
            direction="row"
          >
            <div className="css-67qlqa">
              <img
                src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
                height={25}
                width={25}
              />
            </div>
            <span className="css-f0vs3e style-8Ho1C" id="style-8Ho1C">
              <span className="css-1lfpde8">
                1x Bộ nhớ/ Ram Laptop Kingston 8GB DDR5 4800MHz (KVR48S40BS6-8)
                (Quà tặng)
              </span>
            </span>
          </div>
        </div> */}
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
                        <div
                          width="100%"
                          direction="row"
                          className="css-1rt5kwy"
                        >
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
                        onClick={() => setScrollableModal(!scrollableModal)}
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
                    <div
                      width="100%"
                      color="divider"
                      className="css-1fm9yfq"
                    ></div>
                  </div>
                  <div className="BOXKHUYENMAILIENQUAN css-1rggx5t">
                    <div className="css-mz7xyg">Khuyến mãi liên quan</div>
                    <ul>
                      <li>
                        <span>
                          Tặng
                          <strong>
                            1 Bộ Voucher Sinh Nhật Phong Vũ (Quà tặng)
                          </strong>
                          cho đơn hàng từ
                          <span className="css-htm2b9">
                            10.000.000
                            <span className="css-1ul6wk9">đ</span>
                          </span>
                          có sản phẩm này
                        </span>
                      </li>
                      <li>
                        <span>
                          Nhập mã
                          <strong>PVASUS500K</strong>
                          giảm
                          <span className="css-6ohl53">500.000đ</span>
                          cho đơn hàng có sản phẩm này
                        </span>
                      </li>
                      <li>
                        <span>
                          Nhập mã
                          <strong>QRPV78</strong>
                          <br />- Giảm
                          <span id="style-Eaoys" className="style-Eaoys">
                            50.000đ
                          </span>
                          cho đơn từ 2,500,000đ
                          <br />- Giảm
                          <span id="style-NCGYS" className="style-NCGYS">
                            100.000đ
                          </span>
                          cho đơn từ 5,000,000đ
                          <br />- Giảm
                          <span id="style-E1gqK" className="style-E1gqK">
                            350.000đ
                          </span>
                          cho đơn từ 15,000,000đ
                          <br />
                          khi thanh toán qua VNPAY-QR.
                        </span>
                        <a
                          href="https://phongvu.vn/cong-nghe/uu-dai-vnpay/"
                          target="blank"
                          className="css-1ty6934"
                        >
                          Xem chi tiết
                        </a>
                      </li>
                      <li>
                        <span>
                          Nhập mã
                          <strong>SacomPV</strong>
                          <br />
                          1. Tặng ngay
                          <span id="style-J4qOQ" className="style-J4qOQ">
                            500.000đ
                          </span>
                          cho mỗi giao dịch thành công từ 10,000,000đ
                          <br />
                          2. Tặng ngay
                          <span id="style-pQct2" className="style-pQct2">
                            200.000đ
                          </span>
                          cho mỗi giao dịch thành công từ 5,000,000đ khi thanh
                          toán qua thẻ tín dụng quốc tế Sacombank.
                        </span>
                        <a
                          href="https://phongvu.vn/cong-nghe/uu-dai-ngan-hang/?nocache=true"
                          target="blank"
                          className="css-1ty6934"
                        >
                          Xem chi tiết
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="productAfterPromoBox"></div>
                </div>
              </div>
            </div>
   
        
        {/* modal */}
        <MDBModal
          show={scrollableModal}
          setShow={setScrollableModal}
          tabIndex="-1"
        >
          <MDBModalDialog size="lg" scrollable>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Chi tiết sản phẩm</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() => setScrollableModal(!scrollableModal)}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl
                  consectetur et. Vivamus sagittis lacus vel augue laoreet
                  rutrum faucibus dolor auctor.
                </p>
                <p>
                  Aenean lacinia bibendum nulla sed consectetur. Praesent
                  commodo cursus magna, vel scelerisque nisl consectetur et.
                  Donec sed odio dui. Donec ullamcorper nulla non metus auctor
                  fringilla.
                </p>
                <p>
                  Cras mattis consectetur purus sit amet fermentum. Cras justo
                  odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                  risus, porta ac consectetur ac, vestibulum at eros.
                </p>
                {/* fomr */}
                <form
                  onSubmit={formik.handleSubmit}
                  action="home"
                  method="detail"
                >
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        id="firstName"
                        name="firstName"
                        label="Tên người dùng"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <div>{formik.errors.firstName}</div>
                      ) : null}
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        id="address"
                        name="address"
                        label="Địa chỉ chi tiết"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.address && formik.errors.address ? (
                        <div>{formik.errors.address}</div>
                      ) : null}
                    </MDBCol>
                  </MDBRow>
                  <MDBInput
                    className="mb-4"
                    type="email"
                    id="email"
                    name="email"
                    label="Email(Không bắt buộc)"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div>{formik.errors.email}</div>
                  ) : null}
                  <MDBInput
                    className="mb-4"
                    type="number"
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Số điện thoại"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                    <div>{formik.errors.phoneNumber}</div>
                  ) : null}

                  <MDBBtn type="submit" className="mb-4" block>
                    Mua hàng
                  </MDBBtn>
                </form>
        */}

      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}>
        <Form.Item name="disabled" valuePropName="checked">
          
        </Form.Item>
        <Form.Item label="Giới tính">
          <Radio.Group>
            <Radio checked='true' value="man"> Anh </Radio>
            <Radio value="male"> Chị </Radio>
          </Radio.Group>
        </Form.Item>
        {/* Tên */}
        <Form.Item label="Tên">
          <Input/>
        </Form.Item>
{/* form select */}
        <Form.Item label="Thành phố">
        <Select onChange={handleProvinceChange}>
          {provinces.map(province => (
            <Select.Option key={province.id} value={province.id}>
              {province.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Huyện">
        {selectedProvince && (
          <Select onChange={handleDistrictChange} value={selectedDistrict}>
            {selectedProvince.districts.map(district => (
              <Select.Option key={district} value={district}>
                {district}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>


    {/* Địa chỉ chi tiết */}
    <Form.Item label="Địa chỉ chi tiết">
          <Input/>
        </Form.Item>

        <Form.Item label="Giao hàng">
          <TreeSelect
            treeData={[
              {
                title: 'Giờ hành chính',
                value: 'GHC',
              },
              {
                title: 'Tất cả ngày trong tuần',
                value: 'WEEKED',
              },
            ]}
          />
          
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input type="number"/>
        </Form.Item>
        <Form.Item label="Ghi chú">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item >
        <Button>Xác nhận</Button>
        </Form.Item>
      </Form>

              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn
                  color="secondary"
                  onClick={() => setScrollableModal(!setScrollableModal)}
                >
                  Đóng
                </MDBBtn>
                {/* <MDBBtn>Mua hàng</MDBBtn> */}
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </div>
    </>
  );
}

export default Detail;
