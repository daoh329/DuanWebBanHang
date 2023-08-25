import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Layout, Affix, Carousel, Tabs, Card, Button, Pagination } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import './Home.scss'
const { Header } = Layout;
const { TabPane } = Tabs;

const products = [
  {
    id: 1,
    name: "LapTop A",
    price: 100000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 2,
    name: "LapTop B",
    price: 150000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 3,
    name: "LapTop C",
    price: 200000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 4,
    name: "LapTop D",
    price: 260000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 5,
    name: "LapTop E",
    price: 50000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 6,
    name: "LapTop F",
    price: 170000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 7,
    name: "LapTop G",
    price: 150000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 8,
    name: "LapTop H",
    price: 150,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 9,
    name: "LapTop Y",
    price: 150,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 10,
    name: "LapTop K",
    price: 150,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  // Thêm các sản phẩm khác vào đây
];
const tuanlevang = [
  {
    id: 1,
    name: "LapTop A",
    price: 100000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 2,
    name: "LapTop B",
    price: 150000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 3,
    name: "LapTop C",
    price: 200000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 4,
    name: "LapTop D",
    price: 260000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
  {
    id: 5,
    name: "LapTop E",
    price: 50000,
    imageUrl:
      "https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw",
  },
];

const Home = () => {
    const [ListUsers, setListUsers] = useState([]);
    const navigate = useNavigate()

    const handleViewDetailuser = (user) => {
        console.log('click oke')
        navigate(`/detail/${user.id}`);
       
    }
    
    useEffect(() => {
        async function fetchData() {
            try {
                let res = await axios.get('https://64df1e7171c3335b25821aef.mockapi.io/users');
                console.log('API Response:', res.data);
                setListUsers(res && res.data && res.data ? res.data : []);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    const sliderImages = [
        'https://lh3.googleusercontent.com/Z4ALctQHIePEih7m2kbV-DyrS4NGkU3ba51_ELp9L7Y_UyJTvEWC1mLFDRss3v5UNrEO62ijjSuY4iWFum-j4oUyXgoGfz10dA=w1920-rw',
        'https://lh3.googleusercontent.com/l-97kfw2WWEm-jtK28TpqtA4T0jBKWm8eGn-FSJ4gI-pz83AXBScpf2VTtcZ4F2vn-hBSt45eDJmOziqesf08ru3FOHGJr0s=w1920-rw',
        'https://lh3.googleusercontent.com/RT2pbxGYxAzqH_DxnDbb-WEduEFSwcovoemFsEFES4-bBMouDjR7fofm4-Oy7J4aK20lmmEJFYOxLPbH7hxUzdOHnmRkINhp=w1920-rw',
        'https://lh3.googleusercontent.com/NEyGqAS4HkBmVGWbdLxRCJ7v4n7Xz-Xcfs6ffoxCNZMHBg0txwJk7L0FVyBvjZ9mwdFsV915-uAWlcX_JPHD1yJSq2EYfeV6=w1920-rw',
        'https://lh3.googleusercontent.com/lM7nJ80Y4-I8JCuM7Er5mjeXtXJeFrct6cs93QTw3o-04B6-n6NENLb4PpQyYPE29MTIANsUle5mdn6WmMggxfVTx5CwfRk=w1920-rw',
    ];
    const categories = ['Danh mục 1', 'Danh mục 2', 'Danh mục 3', 'Danh mục 4', 'Danh mục 5'];
    const subCategories = {
        'Danh mục 1': ['Danh mục con 1.1', 'Danh mục con 1.2', 'Danh mục con 1.3'],
        'Danh mục 2': ['Danh mục con 2.1', 'Danh mục con 2.2', 'Danh mục con 2.3'],
        // ... Thêm các danh mục con khác
    };
    const danhmuc1 = [
        { name: 'Laptop', image: 'https://lh3.googleusercontent.com/wOhcPJSPsA2l653-KPjmfodiem9y3NS6Mji6SZhkNCKsuyHK9Z3x0X-2l8gikfPI5n1DX0Fg9bBCHsOI0ACZD7n20XHN4e72=rw' },
        { name: 'Macbook', image: 'https://lh3.googleusercontent.com/-kvGX205lg2FwjlevgAws0VOVKjDJVkZLuzdUzV-tFWi0fxs7rz2rd3ZvzQ1GLBs2j67HwrTqM1KdkfekyWPz9olDW-quolzlA=rw' },
        { name: 'PC', image: 'https://lh3.googleusercontent.com/AsrwiaAHgA9NcpFVm8hBkOkG3Chv2XzObdRlzJStQ5rTTI7YSzlGo2_fl6wwpWLJKkgv_aHOEiN8UXagLUHwq3nDYzEwFBw=rw' },
        { name: 'Card Màn Hình', image: 'https://lh3.googleusercontent.com/2701fTP9z5BT0Jn40Jc6qiXij824-WxAM6wavqFHvf7tp5WLkpJwh7Kn6TsesgatH_avVdZMkVtu8qfpZ3jfkWDsIeXYKg-L=rw' },
        { name: 'CPU', image: 'https://lh3.googleusercontent.com/BWmrmeD9ZNoYqrCztPIpHCwFbKB6JtEOjC53KDuCEDSH2nVakRhjhBhiftXVl_ugvOerBhgCaBZanc2cC1ihcUU2DZw8QEfN=rw' },
        { name: 'Ram', image: 'https://lh3.googleusercontent.com/4Lt6ipknHdhytA3yBKGstu2R75Ip-RCpIng6rmnsOT6bHR_Nq0BiIEXI81-kV4otHS5epUEz8YSoIYg5DdeVCiVZ9UguiWsk=rw' },
        { name: 'Ổ cứng', image: 'https://lh3.googleusercontent.com/stw8R9S4NPD2_WXwwxRbfVpm076f53ZQbnJ1gtFucrv6nWkcERiCfg7BJ2_AQv4zY8oIlO-SipQWOK7Uc8UvXw9pnuBN6bs=rw' },
        { name: 'Màn Hình', image: 'https://lh3.googleusercontent.com/rg0MMQFfyjZzGjsmcJrpqQx7Zp8c7KDPPMX6yUtafXTn9qgSMaA9lavKd8q1vz1nfxYgnjbjfHLmFsw7IxLfkupM83NBzYY=rw' },
        { name: 'Chuột Máy tính', image: 'https://lh3.googleusercontent.com/eIAVPQdJ20jpuDYypRQSF5zcugh6q6V4_04jopbdc5gdvQUo11j6z_1K9NGV2DNSlzofo2ztZaKZuZ0ijKDUvUExrOZuZTQ=rw' },
    ];
    const danhmuc2 = [
        { name: 'Bàn Phím', image: 'https://lh3.googleusercontent.com/x-UKqLN2rYJIb365dmAUfqR8T09NwI0gzqnUJsCIJsaaFUGSsWWzQoxY6e1FjghDm8E7kR9SR0jySLL6hBfgh2msMi2vJ2mp=rw' },
        { name: 'IPhone', image: 'https://lh3.googleusercontent.com/lmY5CJ2nNtJYXqb5CgtJ0z6EmY5ZS3x06oQt6Aneh8KEdnTCYY2cdjsAQDD5gFllIj8f84DZP94AkvhnZ1pj6nysi1uwsXM=rw' },
        { name: 'Ipad', image: 'https://lh3.googleusercontent.com/icxPo1Rqyjc1XkfEpTq6NJx3p1mFclraPE3mp3uxCUDBoHXuhbq8WMGMiwE3L4czehocmdRCuSyBF9QOU4DQhz30eIjekvNm=rw' },
        { name: 'Loa', image: 'https://lh3.googleusercontent.com/S1yuYdyvEMVRPWQqTV9wVhhGLE2oa8Yc1JhT2hjDOFFLb-QeO9YFxNRIb7IV2MmeFCSa0SwE4bj0SiNvsX4MD7t4ZAiIWR15tA=rw' },
        { name: 'Phụ kiện chung', image: 'https://lh3.googleusercontent.com/c5bndXV3StqApjCkeie7NJwmm0CINqli4c-ojXm0sYgybzkrxUlvQcc0bEEkWsWA36pEUs3rAPqSrujbb8MuR78F0chH0xXS=rw' },
        { name: 'Điện thoại', image: 'https://lh3.googleusercontent.com/hKlLfslwlu8yhXnGev18Nhv2HJ8nbtj-irvFZ41n7uCGyut1eZ-ZPOYFM7pUmdC3fC5Po2BzdSk89VShSwzSnk0sgwUGV50=rw' },
        { name: 'Máy tính bảng', image: 'https://lh3.googleusercontent.com/SnA2s4Q1SidX0eSBKUtlrTV3BkCHtWwJmwu5EmrPPjSLbZBce96IYn4ZYYaUUTbe2HVn6pnJbl-2zWcQUfFBRMW_2aWNXpk5=rw' },
        { name: 'Máy in', image: 'https://lh3.googleusercontent.com/NlL5KvzewP3NBuHU_LswDZWgDKo6GACf_eQE4pqAbhafnxUO9RycDE6lYS0O8tMibJhhsSh5Hm7lU-M0l1tVuTGHlnAKTHG0=rw' },
        { name: 'TV', image: 'https://lh3.googleusercontent.com/nQEoUshCFBITCkHdHmHVx3-Hjhn_Y6Tjvh7jDfEVDQ-tind2G44ebk3shJI9GrQzGW29BK2B-qPXEB2AZeWq8DfA8LR0IlY=rw' },
    ];
    const [activeTab, setActiveTab] = useState("1"); // State to keep track of active tab

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const itemsPerPage = 10; // Số sản phẩm trên mỗi trang

    // Tính tổng số trang dựa trên số lượng sản phẩm và số sản phẩm trên mỗi trang
    const totalPages = Math.ceil(ListUsers.length / itemsPerPage);

    // State để lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // Hàm xử lý sự kiện khi người dùng chọn trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Tính index bắt đầu và index kết thúc cho sản phẩm trên trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return (

        <Layout>
            <div className="content">
                <Carousel autoplay>
                    {sliderImages.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={`Slide ${index}`} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    ))}
                </Carousel>
                <div className="slider-overlay">
                    <div className="slider-container">
                        <div className="left-block">
                            <ul className="category-list">
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
                            </ul>
                        </div>
                        <div className="right-block">
                            <img className="right-image" src="https://lh3.googleusercontent.com/sGc0CJYRiTBTlK6dbJ_qsFhIMvPpZqvD3KnHrWsK2azfSp3Wz515oh2QUMfyvsvu-kcH59ILjApX-1B_G5DcceDq5bfHrIRAaA=w300-rw" alt="Hình ảnh" />
                            <img className="right-image" src="https://lh3.googleusercontent.com/sGc0CJYRiTBTlK6dbJ_qsFhIMvPpZqvD3KnHrWsK2azfSp3Wz515oh2QUMfyvsvu-kcH59ILjApX-1B_G5DcceDq5bfHrIRAaA=w300-rw" alt="Hình ảnh" />
                        </div>
                    </div>
                </div>
            </div>

            {/* -------tabsPane---------- */}
            <div className="content"
                style={{
                    width: "80%",
                    margin: "0 auto",
                    backgroundImage: "url('https://lh3.googleusercontent.com/kNQJhjNgt5WnorADIKUr1lQIkwlxmWnUfOARFP5TfYXldzRRkfFw3hbzbXEBZo-20klJuDRkUZkDWbypz2UmFj0LesbRckx-=rw-w1920')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: '20px',
                    marginTop: '10px'
                }}>
                <Tabs
                    centered={true} /* Để Tabs căn giữa theo chiều ngang */
                    style={{ fontWeight: 'bold' }}
                    tabBarStyle={{ background: 'transparent' }}
                    activeKey={activeTab}
                    onChange={handleTabChange}

                >
                    <TabPane tab="Tuần Lễ Micro" key="1" >
                        <div className="content" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', margin: "0 auto", padding: '10px' }}>
                            {tuanlevang && tuanlevang.length > 0 &&
                                tuanlevang.map((item, index) => (
                                    
                                    <Card
                                        key={item.id}
                                        hoverable
                                        style={{ width: 230, boxSizing: 'border-box', margin: "0 auto", marginTop: "10px" }}
                                        cover={<img alt={item.name} src={item.imageUrl} />}
                                    >
                                        <h3>{item.name}</h3>
                                        <p>{item.price}$</p>
                                        <Button type="primary" icon={<ShoppingCartOutlined />}>

                                        </Button>
                                    </Card>
                                ))}
                        </div>
                    </TabPane>
                    <TabPane tab="Chuột - Phím - Tai Nghe" key="2">
                        Content of Tab 2
                    </TabPane>
                    <TabPane tab="Flash Sales 102" key="3">
                        Content of Tab 3
                    </TabPane>
                </Tabs>
            </div>

            {/*-------- Danh mục nổi bật -----------*/}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundColor: 'white', padding: '10px' }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '20px', display: '-webkit-box' }}>Danh mục nổi bật</div>
                </div>
                <div style={{ paddingTop: '10px' }}>
                    <MDBContainer>
                        <MDBRow>
                            {danhmuc1.map((danhmuc1, index) => (
                                <MDBCol size='md' key={index}>
                                    <div className="category-image-container">
                                        <img src={danhmuc1.image} alt={danhmuc1.name} className="category-image-mdb" style={{ width: '50px' }} />
                                        <p className="category-name">{danhmuc1.name}</p>
                                    </div>
                                </MDBCol>
                            ))}
                        </MDBRow>
                    </MDBContainer>
                </div>
            </div>
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundColor: 'white', padding: '10px' }}>
                <div>
                    {/* <div style={{fontWeight: 'bold', fontSize:'20px', display: '-webkit-box'}}>Danh mục nổi bật</div> */}
                </div>
                <div style={{ paddingTop: '10px' }}>
                    <MDBContainer>
                        <MDBRow>
                            {danhmuc2.map((danhmuc2, index) => (
                                <MDBCol size='md' key={index}>
                                    <div className="category-image-container">
                                        <img src={danhmuc2.image} alt={danhmuc2.name} className="category-image-mdb" style={{ width: '50px' }} />
                                        <p className="category-name">{danhmuc2.name}</p>
                                    </div>
                                </MDBCol>
                            ))}
                        </MDBRow>
                    </MDBContainer>
                </div>
            </div>

            {/* ------------------box sản phẩm Laptop ------------------ */}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundSize: 'cover', backgroundImage: 'url(https://lh3.googleusercontent.com/FphgdKoJkfp17IB5xYJvah5EShCZUjDQER9SGUCZMzvzsfcDeRKvZ-coSz0kSdhRn7ZvwPBC2qMoHO3Iek_p5knTcxv2Gb-7=w1232)' }}>
                <h2 style={{ color: "white", }}>LAPTOP</h2>
                <div style={{ width: '98%', margin: '0 auto' }}>
                    <div
                        className="horizontal-scroll-view"
                        style={{ display: 'flex', overflowX: 'scroll', padding: '10px', whiteSpace: 'nowrap', }} >
                        {products && products.length > 0 &&
                            products.map((item, index) => (
                                <Card
                                    key={item.id}
                                    hoverable
                                    className="product-card"
                                    style={{ width: '60%', boxSizing: 'border-box', marginRight: '10px', display: 'inline-block', }}>
                                    <img src={item.imageUrl} style={{ width: '200px' }}></img>
                                    <h3>{item.name}</h3>
                                    <p>{item.price}$</p>
                                    <Button onClick={() => handleViewDetailuser(item)} type="primary" icon={<ShoppingCartOutlined />}>Buy
                                        {/* Biểu tượng mua hàng */}
                                    </Button>
                                </Card>

                                
                            ))}
                    </div>
                </div>
            </div>

            {/* ------------------box sản phẩm Linh kiện ------------------ */}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundSize: 'cover', backgroundImage: 'url(https://lh3.googleusercontent.com/oOKsGNxeJyYtVHbBAk6HdIirUD7P794VfnTf3cKYJvU9zNbXJSAc8AtH79dno-6KrMH9nJXNOYqamANUtAHH3jDE0HDo3sM=w1232)' }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '25px', display: '-webkit-box', padding: ' 20px 0px 0px 20px', color: 'white' }}>Linh kiện</div>
                </div>
                <div style={{ width: '98%', margin: '0 auto' }}>
                    <div
                        className="horizontal-scroll-view"
                        style={{ display: 'flex', overflowX: 'scroll', padding: '10px', whiteSpace: 'nowrap', }} >
                        {products && products.length > 0 &&
                            products.map((item, index) => (
                                <Card
                                    key={item.id}
                                    hoverable
                                    className="product-card"
                                    style={{ width: '60%', boxSizing: 'border-box', marginRight: '10px', display: 'inline-block', }}>
                                    <img src={item.imageUrl} style={{ width: '200px' }}></img>
                                    <h3>{item.name}</h3>
                                    <p>{item.price}$</p>
                                    <Button onClick={() => handleViewDetailuser(item)} type="primary" icon={<ShoppingCartOutlined />}>
                                        {/* Biểu tượng mua hàng */}
                                    </Button>
                                </Card>
                            ))}
                    </div>
                </div>
            </div>

            {/* ------------------box sản phẩm nổi bật ------------------ */}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundSize: 'cover', backgroundColor: "white" }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '25px', display: '-webkit-box', padding: '20px', color: 'black' }}>Sản phẩm nổi bật</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {ListUsers && ListUsers.length > 0 &&
                        ListUsers.slice(startIndex, endIndex).map((item, index) => (
                            <Card
                                key={item.id}
                                hoverable
                                className="card-sp" 
                                             
                            >
                                <img src={item.avatar} style={{ width: '170px', height: '170px', objectFit: 'cover' }} alt={item.name} onClick={() => handleViewDetailuser(item)} />
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <a className="name-card">{item.name}</a>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{color:'rgb(20, 53, 195)', fontWeight: 'bold'}}>{item.Price} ₫</p>
                                        <Button  type="primary" icon={<ShoppingCartOutlined />} style={{ marginLeft: 'auto' }}>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                </div>
                {/* Phân trang */}
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Pagination
                        current={currentPage}
                        total={ListUsers.length}
                        pageSize={itemsPerPage}
                        onChange={handlePageChange}
                    />
                </div>
            </div>


        </Layout>
    );
};

export default Home;
