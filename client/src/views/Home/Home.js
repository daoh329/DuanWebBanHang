
import React, { useRef } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Layout, Carousel, Tabs, Card, Button, Pagination } from "antd";
import { LeftOutlined, RightOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from "antd";
import "./Home.scss";
import {parse, stringify} from 'flatted';

import { useCart } from "../Cart/CartContext";
const { Header } = Layout;
const { TabPane } = Tabs;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [topLaptop, setTopLaptop] = useState([]);
  const navigate = useNavigate();

  //top 10 laptop bán chạy
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/order/laptopbanchay`)
      .then((res) => {
        setTopLaptop(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

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
      shortDescription: products.shortDescription,
      price: products.price,
      avatar: products.thumbnail,
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

    console.log('click')
    navigate(`/detail/${products.id}`);
  };

  const handleViewDetailproducts = (products) => {
    console.log("click oke");
    navigate(`/detail/${products.id}`);
  };

  const [historysp, sethistorysp] = useState([]);

  useEffect(() => {
    // Lấy giá trị từ session storage
    const storedProducts = JSON.parse(sessionStorage.getItem("products")) || [];
    // Cập nhật state
    sethistorysp(storedProducts);
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/product/products`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  // them giỏ hàng
  const { addToCart } = useCart();
  const handleAddToCart = (item) => {
    // addToCart(item);
    message.success("Sản phẩm đã được thêm vào giỏ hàng");

    // Lấy giỏ hàng hiện tại từ session
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Thêm sản phẩm vào giỏ hàng
    cart.push(item);

    // Lưu giỏ hàng đã cập nhật vào session
    sessionStorage.setItem("cart", JSON.stringify(cart));
    console.log(">>>", cart);
  };

  //---------------------------
  const sliderImages = [
    "https://lh3.googleusercontent.com/nV_K95Q26s6tERRT59QYqB3vD2h_SYomuwf2l1kvgazvydeWkAU2fORAQvYtwxnR6fq2bLCUvtpGnZEXOr8puo48_L2ythw=w1920-rw",
    "https://lh3.googleusercontent.com/2-2QrEjqAfQPnLqeUBT_bVj4Zbg9IoEk_nfAQcmVQGE6JZ_GCBXLmiNQcW2lT540qrYw6cqCV8l1QNGTm_elc7-XfFsMC1dW=w1920-rw",
    "https://lh3.googleusercontent.com/GinkeWEQkjkO4POE_srKxjJlYPFehSTUvihpc7Z7UGru7l8ukGwKKp5GSDRrW9MYI8OE-5YSN8lfMBsvVOaV_jXEfpGDp3iu4w=w1920-rw",
    "https://lh3.googleusercontent.com/KU0g__QTkLdAAyt_Oa18jVsgyXlIkWGSoEZNHKSjLtSB91w-442-nKtaUDOFantvGyLslr22rM_kJVkWARby5s75UFrXWUo=w1920-rw",
    "https://lh3.googleusercontent.com/qMzCAwc2541i_uOVjJVOgN8gfJxSC_98C6SrK8i03Q6nC4hZ-5NudPqCHc4Ft4_4Zrr5H5IO-7JLL5kWrwRk98pJKHgVoag=w1920-rw",
    "https://lh3.googleusercontent.com/79pF1qvkAMR3L4Jm1kZdGb3AVvX2_zqj1nSyAnBlQDFi-KNi4F7FQAE-Gk14xb1OyKR0tMgLPmFDQ65n-3d2YKvtlcdnnrB3=w1920-rw",
    "https://lh3.googleusercontent.com/97RCj73gv97txuAg7t5cSor_Fe1__KCT44INjmtKhxgb1ERLp2WSdXm-9mOfmmUM23CVLRj8BjpVW-E-27XLjUVLiDA3NYU=w1920-rw",
    "https://lh3.googleusercontent.com/iZzrp_LqTVywcRoAVwQ0DpSKYt-HpqO-yicEFdjJMNsIjTUl89M0ORmRZijc3V9NcEiaea5BdpDcycfZ-A0jTQ-0G3ttaoMs=w1920-rw",
    "https://lh3.googleusercontent.com/YSEh7mEEW8a_KbVD42Mut-z-NVGg_x9d8YBLcI8ZHZxX0PPVLz30TqanefsaJITaHRRimZ8W75k2SD6WXoqEogPcpqj4EePL=w1920-rw",
    "https://lh3.googleusercontent.com/l-97kfw2WWEm-jtK28TpqtA4T0jBKWm8eGn-FSJ4gI-pz83AXBScpf2VTtcZ4F2vn-hBSt45eDJmOziqesf08ru3FOHGJr0s=w1920-rw",
    "https://lh3.googleusercontent.com/7fLNK64SX-6-xlW1aHfS0kbJOs8XxPpVPvDJIhL_3PS34Vo9VXTZTzaFRRtdoY38r2_XYbjonorwEmSUQgYkZXnSuVqSTvmB=w1920-rw",
    "https://lh3.googleusercontent.com/NEyGqAS4HkBmVGWbdLxRCJ7v4n7Xz-Xcfs6ffoxCNZMHBg0txwJk7L0FVyBvjZ9mwdFsV915-uAWlcX_JPHD1yJSq2EYfeV6=w1920-rw"
  ];
  const [activeTab, setActiveTab] = useState("1"); // State to keep track of active tab

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const itemsPerPage = 10; // Số sản phẩm trên mỗi trang

  // Tính tổng số trang dựa trên số lượng sản phẩm và số sản phẩm trên mỗi trang
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // State để lưu trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm xử lý sự kiện khi người dùng chọn trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Tính index bắt đầu và index kết thúc cho sản phẩm trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // logic scroll button phone
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 230; // Điều chỉnh khoảng cách cuộn tùy ý
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 230; // Điều chỉnh khoảng cách cuộn tùy ý
    }
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

  return (
    <Layout>
      <div className="content">
        <Carousel autoplay>
          {sliderImages.map((image, index) => (
            <div className='banner' key={index}>
              <img

                src={image}
                alt={`Slide ${index}`}

                style={{ width: "100%", height: "auto", objectFitfit: 'cover' }}

              />
            </div>
          ))}
        </Carousel>
        <div className="slider-overlay">
          <div className="slider-container">
            <div className="left-block">
              {/* <div className="category-list">
                {categories.map((category, index) => (
                  <li key={index} className="category-item">
                    {category}
                    <ul className="sub-category-list">
                      {subCategories[category]?.map((subCategory, subIndex) => (
                        <li key={subIndex}>{subCategory}</li>
                      ))}
                    </ul>
                  </li>
                ))}
                
              </div>  */}
              <img
                className="left-image"
                src="https://lh3.googleusercontent.com/lLGsyYaAldy7EMkG5xrzuIwpryl3pd7xVFspeXUn_ZKU7QNXVzTnmaWHuVXXUf3cond-gv6X2maTfxZCgph9-h-X6wmjXbx0"
                alt="Hình ảnh"
              />
            </div>
            <div className="right-block">
              <img
                className="right-image"
                src="https://lh3.googleusercontent.com/NMcRaUaWbe7V2eEwslmKNSvamonOIhbh5gDalyPC0GgizN2Mku2ITGyIcOksnDY0_O2_cZZb_AEZbcn4o3sUzclliTC_l_c=w300-rw"
                alt="Hình ảnh"
              />
              <img
                className="right-image"
                src="https://lh3.googleusercontent.com/_3-aKT2dKUecRCiOhoM7ztPmh0pasrYgz3ut3_jOKv4YvvW5TFdQWhfjTXEnYGyCLLoi_wHu9ppwxT58cAmgG8wnWV74b84myg=w300-rw"
                alt="Hình ảnh"
              />
            </div>
            {/* -------------------------- */}
            <div className="bottom-block">
              <img
                className="bottom-image"
                src="https://lh3.googleusercontent.com/kISWON9YK-BP8qB-aGzv9QxKH-RkQ1-jCCcS1UKUDJ7IWQ99u3uOTR6jcwAld5iACEIutxtPl0r7jmeOa1vpLjBA5z9CwPfq=w308-rw"
                alt="Hình ảnh"
              />
              <img
                className="bottom-image"
                src="https://lh3.googleusercontent.com/oDN30aM8_2ONdSWg2JhRtDds2Eq9uayf8XQ_f62V5H_iQcJ5KLk1XgWXpYRlOEalt6DXJRWNMeqhhAX-wtASTmoUZaF7nmTx=w308-rw"
                alt="Hình ảnh"
              />
              <img
                className="bottom-image"
                src="https://lh3.googleusercontent.com/A8lyRYwK0l77_1lJ0eePDAXPnQlFD2OzxkJzeASnBd5nLydK35I7nUA7GY5JQ7D8TO5ZazDDL6jnHzOPMoob-jcbnk5n2PjF=w308-rw"
                alt="Hình ảnh"
              />
              <img
                className="bottom-image"
                src="https://lh3.googleusercontent.com/Szap3Ebx1l76oScrgcATfqDfw1N_XZVazepEa2htAovKkb2Y4Z5gzD9WmdMYM4u_gWLhx1E-CPeoKB2zdS0UoTMrEmJ_Bq8=w308-rw"
                alt="Hình ảnh"
              />
            </div>
          </div>
        </div>
      </div>


      {/* ---------------menu-------------------- */}
      <nav className="menu-nav" >
        <div>

       
        <ul className="menu-nav-ul">
          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i className="fa fa-mobile-phone" aria-hidden="true"></i>
              <span className="name-menu">Điện thoại</span>
            </a>
            <div className="sub-container" style={{ position: 'absolute', left: '0', top: "55px", zIndex: "199", paddingTop: '15px', display: 'none', opacity: '0', visibility: 'hidden', transition: 'opacity 200ms,visibility 200ms' }}>
              abc
            </div>
          </li>

          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i className="fa fa-laptop" aria-hidden="true"></i>
              <span className="name-menu">Lap Top</span>
            </a>
          </li>
          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i className="fa fa-icons" ></i>
              <span className="name-menu">Phụ kiện</span>
            </a>
          </li>
          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i className="fa fa-keyboard" aria-hidden="true"></i>
              <span className="name-menu">Keyboard</span>
            </a>
          </li>
          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i class="fa fa-rotate" aria-hidden="true"></i>
              <span className="name-menu">Máy cũ</span>
            </a>
          </li>

          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i class="fa fa-screwdriver-wrench" aria-hidden="true"></i>
              <span className="name-menu">Sửa chữa</span>
            </a>
          </li>
          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i class="fa fa-bolt-lightning" aria-hidden="true"></i>
              <span className="name-menu">Ưu đãi</span>
            </a>
          </li>
          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i class="fa fa-newspaper" aria-hidden="true"></i>
              <span className="name-menu">Tin tức</span>
            </a>
          </li>
          <li className="menu-nav-ul-li">
            <a className="li-a">
              <i class="fa fa-headset" aria-hidden="true"></i>
              <span className="name-menu">Dịch vụ</span>
            </a>
          </li>

        </ul>
        </div>
      </nav>

      {/* -------tabsPane---------- */}
      <div
        className="tabsPane"
        style={{
          width: "80%",
          margin: "0 auto",
          backgroundImage:
            "url('https://lh3.googleusercontent.com/kNQJhjNgt5WnorADIKUr1lQIkwlxmWnUfOARFP5TfYXldzRRkfFw3hbzbXEBZo-20klJuDRkUZkDWbypz2UmFj0LesbRckx-=rw-w1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // borderRadius: "20px",
          marginTop: "20px",
        }}
      >
        <Tabs
          centered={true} /* Để Tabs căn giữa theo chiều ngang */
          style={{ fontWeight: "bold" }}
          tabBarStyle={{ background: "transparent" }}
          activeKey={activeTab}
          onChange={handleTabChange}
        >
          <TabPane tab="Tuần lễ giảm giá" key="1">
            <div className="scroll-control-phone" ref={containerRef}>
              {topLaptop &&
                topLaptop.length > 0 &&
                topLaptop.slice(startIndex, endIndex).map((item, index) => (
                  <div className="sanpham-card">
                    <img src={item.avatar} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '200px', width: '205px', backgroundColor: 'pink' }}></img>
                    <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
                      <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
                        APPLE
                      </div>
                    </div>
                    <div style={{ width: '165px', height: 'auto', color: '#434657', display: '-webkit-box', fontSize: '12px', lineHeight: '16px', textAlign: '-webkit-left' }}>
                      <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto', }}>
                        {item.shortDescription}
                      </h3>
                    </div>

                    <div style={{ alignItems: 'start', color: '#333333', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: '20px', width: '165px', height: '40px', }}>
                      <div style={{ color: '#1435c3', display: '-webkit-box', fontSize: '15px', fontWeight: '700', lineHeight: '24px', width: '90px', height: '24px' }}>
                        {item.price}₫
                      </div>

                    </div>
                  </div>
                ))}

            </div>
          </TabPane>
          <TabPane tab="Sản phẩm bán chạy" key="2">
          <div className="scroll-control-phone" ref={containerRef}>
          {topLaptop &&
                topLaptop.length > 0 &&
                topLaptop.slice(startIndex, endIndex).map((item, index) => (
                  <div className="sanpham-card">
                    <img src={item.thumbnail} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '200px', width: '205px', backgroundColor: 'pink' }}></img>
                    <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
                      <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
                        APPLE
                      </div>
                    </div>
                    <div style={{ width: '165px', height: 'auto', color: '#434657', display: '-webkit-box', fontSize: '12px', lineHeight: '16px', textAlign: '-webkit-left' }}>
                      <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto', }}>
                        {item.shortDescription}
                      </h3>
                    </div>

                    <div style={{ alignItems: 'start', color: '#333333', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: '20px', width: '165px', height: '40px', }}>
                      <div style={{ color: '#1435c3', display: '-webkit-box', fontSize: '15px', fontWeight: '700', lineHeight: '24px', width: '90px', height: '24px' }}>
                        {item.price}₫
                      </div>

                    </div>
                  </div>
                ))}
            </div>
          </TabPane>
          <TabPane tab="Flash Sales" key="3">
            Content of Tab 3
          </TabPane>
        </Tabs>
      </div>




      {/*-------- Danh mục nổi bật -----------*/}
      {/* <div className='danhmucmobile' style={{
        borderRadius: '20px',
        width: '100%',
        margin: '0 auto',
        marginTop: '20px',
        backgroundColor: 'white',
        padding: '10px',

      }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '20px', }}>
            Danh mục điện thoại
          </div>
        </div>
        <div style={{ paddingTop: '10px', overflowX: 'auto', whiteSpace: 'nowrap', }}>
          <div>
            <div>
              {danhmuc1.map((danhmuc1, index) => (
                <div size='md' key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
                  <div className="category-image-container">
                    <img src={danhmuc1.image} alt={danhmuc1.name} className="category-image-mdb" style={{ width: '90px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
      {/* 
      <div className='danhmucnoibat' style={{
        borderRadius: '20px', width: '80%',
        margin: '0 auto', marginTop: '20px',
        backgroundColor: 'white', padding: '10px',
        overflowX: 'auto', // Cho phép cuộn ngang
        whiteSpace: 'nowrap'
      }}>
        <div>
          <div style={{
            fontWeight: 'bold', fontSize: '20px'
            , display: '-webkit-box'
          }}>Danh mục điện thoại</div>
        </div>
        <div style={{ paddingTop: '10px' }}>
          <MDBContainer>
            <MDBRow>
              {danhmuc1.map((danhmuc1, index) => (
                <MDBCol size='md' key={index}>
                  <div className="category-image-container">
                    <img src={danhmuc1.image} alt={danhmuc1.name} className="category-image-mdb" style={{ width: '90px' }} />
                  </div>
                </MDBCol>
              ))}
            </MDBRow>
          </MDBContainer>
        </div>
      </div >
      
      <div className='danhmucnoibat' style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundColor: 'white', padding: '10px' }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '20px', display: '-webkit-box' }}>Danh mục LapTop</div>
        </div>
        <div style={{ paddingTop: '10px' }}>
          <MDBContainer>
            <MDBRow>
              {danhmuc2.map((danhmuc2, index) => (
                <MDBCol size='md' key={index}>
                  <div className="category-image-container">
                    <img src={danhmuc2.image} alt={danhmuc2.name} className="category-image-mdb" style={{ width: '90px' }} />
                  
                  </div>
                </MDBCol>
              ))}
            </MDBRow>
          </MDBContainer>
        </div>
      </div> */}


      {/* ------------------box sản phẩm mới ra mắt ------------------ */}
      {topLaptop && topLaptop.length > 0 ? (
        <div className='phone-group' >
          <div className="title-group">

            <div className="phone-title">Sản phẩm mới ra mắt</div>
            <div className="views-all">
              <a href="/tat-ca-san-pham" style={{color:'white'}}>Xem tất cả</a>
              <i class="fa fa-chevron-right"></i>
            </div>

          </div>
          <div className="scroll-group-phone">
            <div className="scroll-control-phone" ref={containerRef}>
              {topLaptop &&
                topLaptop.length > 0 &&
                topLaptop.slice(startIndex, endIndex).map((item, index) => (
                  <div className="sanpham-card">
                    <img src={item.avatar} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '200px', width: '205px', backgroundColor: 'pink' }}></img>
                    <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
                      <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
                        APPLE
                      </div>
                    </div>
                    <div style={{ width: '165px', height: 'auto', color: '#434657', display: '-webkit-box', fontSize: '12px', lineHeight: '16px', textAlign: '-webkit-left' }}>
                      <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto', }}>
                        {item.name}
                      </h3>
                    </div>

                    <div style={{ alignItems: 'start', color: '#333333', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: '20px', width: '165px', height: '40px', }}>
                      <div style={{ color: '#1435c3', display: '-webkit-box', fontSize: '15px', fontWeight: '700', lineHeight: '24px', width: '90px', height: '24px' }}>
                        {item.price}₫
                      </div>

                    </div>
                  </div>
                ))}

            </div>
            {/* button */}
            {/* <button
            className="scroll-button"
            id="scroll-left-button"
            onClick={scrollLeft}
          >
            <CaretLeftOutlined />
          </button>
          <button
            className="scroll-button"
            id="scroll-right-button"
            onClick={scrollRight}
          >
            <CaretRightOutlined />
          </button> */}
          </div>
        </div>
      ) : null}

      {/* ------------------box sản phẩm laptop bán chạy ------------------ */}
      {topLaptop && topLaptop.length > 0 ? (
        <div className="phone-group">
          <div className="title-group">
            <div className="phone-title">Danh mục nổi bật</div>
            <div className="views-all">Xem tất cả <i class="fa fa-chevron-right"></i> </div>
          </div>
          <div className="scroll-group-phone">

            {/* content */}
            <div className="scroll-control-phone" ref={containerRef}>

              {topLaptop &&
                topLaptop.length > 0 &&
                topLaptop.slice(startIndex, endIndex).map((item, index) => (
                  <div className="sanpham-card">
                    <img onClick={() => handleViewDetailProduct(item)} src={item.thumbnail} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '165px', width: '165px', backgroundColor: 'pink' }}></img>
                    <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
                      <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
                        {item.brand}
                      </div>
                    </div>
                    <div style={{ width: '165px', height: 'auto', color: '#434657', display: '-webkit-box', fontSize: '12px', lineHeight: '16px', textAlign: '-webkit-left' }}>
                      <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto' }}>
                        {item.shortDescription}
                      </h3>
                    </div>

                    <div style={{ alignItems: 'start', color: '#333333', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: '20px', width: '165px', height: '40px', }}>
                      <div style={{ color: '#1435c3', display: '-webkit-box', fontSize: '15px', fontWeight: '700', lineHeight: '24px', width: '90px', height: '24px' }}>
                        {item.price}₫
                      </div>

                    </div>
                  </div>
                ))}

            </div>

            <button
              className="scroll-button"
              id="scroll-left-button"
              onClick={scrollLeft}
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button
              className="scroll-button"
              id="scroll-right-button"
              onClick={scrollRight}
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
          </div>
        </div>
      ) : null}

      {/* --------------------------------------- */}



      {/* ------------------box sản phẩm ------------------ */}
      {products && products.length > 0 ? (
        <div
          className="product-container"
          style={{
            width: "80%",
            margin: "0 auto",
            marginTop: "20px",
            backgroundSize: "cover",
            backgroundColor: "#ededed",
          }}
        >
          <div className="title-group">
            <div className="products-title">Sản phẩm  </div>
            <div className="views-all">
            <a href="/tat-ca-san-pham" style={{color:'white'}}>Xem tất cả</a>
               <i class="fa fa-chevron-right"></i> 
               </div>
          </div>
          <div className="scroll-control-product">

            {products &&
              products.length > 0 &&
              products.slice(startIndex, endIndex).map((item, index) => (
                <div className="sanpham-card">
                  <img onClick={() => handleViewDetailProduct(item)} src={item.thumbnail} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '165px', width: '165px', backgroundColor: 'pink' }}></img>
                  <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
                    <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
                      {item.brand}
                    </div>
                  </div>
                  <div style={{ width: '165px', height: 'auto', color: '#434657', display: '-webkit-box', fontSize: '12px', lineHeight: '16px', textAlign: '-webkit-left' }}>
                    <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto' }}>
                      {item.shortDescription}
                    </h3>
                  </div>

                  <div style={{ alignItems: 'start', color: '#333333', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: '20px', width: '165px', height: '40px', }}>
                    <div style={{ color: '#1435c3', display: '-webkit-box', fontSize: '15px', fontWeight: '700', lineHeight: '24px', width: '90px', height: '24px' }}>
                      {item.price}₫
                    </div>
          
                  </div>
                </div>
              ))}

          </div>
          {/* Phân trang */}
          <div className="pagination-container" style={{ textAlign: "center", marginTop: "10px" }}>
            <Pagination
              current={currentPage}
              total={products.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      ) : null}

      {/* ------------------Sản phẩm đã xem -----------------------*/}
      {historysp && historysp.length > 0 ? (
        <div
          className="product-container"
          style={{
            borderRadius: "5px",
            position: 'relative',
            width: "80%",
            margin: "0 auto",
            marginTop: "20px",
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
                borderBottom: '1px solid rgb(228, 229, 240)'
              }}
            >
              Sản phẩm vừa xem
            </div>
          </div>
          <div className="scroll-group-phone">
            <div className="scroll-control-phone" ref={ctnRef}>
              {historysp &&
                historysp.length > 0 &&
                historysp.slice(startIndex, endIndex).map((item, index) => (
                  <div className="sanpham-card" style={{ border: '1px solid rgb(228, 229, 240)', borderRadius: '5px', }}>
                    <img onClick={() => handleViewDetailproducts(item)} src={item.avatar} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '200px', width: '205px', backgroundColor: 'pink' }}></img>
                    <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
                      <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
                        {item.brand}
                      </div>
                    </div>
                    <div style={{ width: '165px', height: 'auto', color: '#434657', display: '-webkit-box', fontSize: '12px', lineHeight: '16px', textAlign: '-webkit-left' }}>
                      <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto', }}>
                        {item.shortDescription}
                      </h3>
                    </div>

                    <div style={{ alignItems: 'start', color: '#333333', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: '20px', width: '165px', height: '40px', }}>
                      <div style={{ color: '#1435c3', display: '-webkit-box', fontSize: '15px', fontWeight: '700', lineHeight: '24px', width: '90px', height: '24px' }}>
                        {item.price}₫
                      </div>

                    </div>
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
      ) : null}
    </Layout>
  );
};

export default Home;