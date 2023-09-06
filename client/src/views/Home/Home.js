import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Layout, Affix, Carousel, Tabs, Card, Button, Pagination} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import { message } from 'antd'; 
import './Home.scss'
import { useCart } from '../Cart/CartContext';
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
    const [topLaptop, setTopLaptop] = useState([]);
    const navigate = useNavigate()

    //top 5 laptop bán chạy
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/laptopbanchay`)
            .then(res => {
                setTopLaptop(res.data);
            })
            .catch(error => console.log(error));
    }, []);

    const handleViewDetailuser = (user) => {
        // Lấy danh sách các sản phẩm đã xem từ session storage
        const historysp = JSON.parse(sessionStorage.getItem('products')) || [];
        // Tạo đối tượng sản phẩm mới
        const historyproduct = {
            name: user.name,
            Price: user.Price,
            avatar: user.avatar,
            id: user.id,
        };
        // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
        const isViewed = historysp.some(product => product.name === historyproduct.name);
        // Nếu sản phẩm mới chưa được xem
        if (!isViewed) {
            // Thêm đối tượng sản phẩm mới vào cuối danh sách
            historysp.push(historyproduct);
            // Lưu trữ danh sách các sản phẩm đã xem vào session storage
            sessionStorage.setItem('products', JSON.stringify(historysp));
        }

        console.log('click oke')
        navigate(`/detail/${user.id}`);

    }

    const handleViewDetailproducts = (user) => {
        console.log('click oke')
        navigate(`/detail/${user.id}`);
    }

    const [historysp, sethistorysp] = useState([]);

    useEffect(() => {
        // Lấy giá trị từ session storage
        const storedProducts = JSON.parse(sessionStorage.getItem('products')) || [];
        // Cập nhật state
        sethistorysp(storedProducts);
    }, []);

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


    // them giỏ hàng
    const { addToCart } = useCart();
    const handleAddToCart = (item) => {
        // addToCart(item);
        message.success('Sản phẩm đã được thêm vào giỏ hàng');

        // Lấy giỏ hàng hiện tại từ session
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

        // Thêm sản phẩm vào giỏ hàng
        cart.push(item);

        // Lưu giỏ hàng đã cập nhật vào session
        sessionStorage.setItem('cart', JSON.stringify(cart));
        console.log(">>>",cart)
    };

     //---------------------------
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
        { name: 'Apple', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2022/09/07/logoooooooooooooooo.png' },
        { name: 'SamSung', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2020/11/30/samsung-logo-transparent.png' },
        { name: 'PC', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2023/07/18/xiaomi-logo.png' },
        { name: 'Card Màn Hình', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2020/09/14/brand%20(3).png' },
        { name: 'CPU', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2020/09/14/brand%20(6).png' },
        { name: 'Ram', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2023/06/12/rog.png' },
        { name: 'Ổ cứng', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2020/09/14/brand%20(4).png' },
        { name: 'Màn Hình', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2020/11/30/vivo-logo.png' },
        { name: 'Chuột Máy tính', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2023/06/02/tecno.png' },
    ];
    const danhmuc2 = [
        { name: 'Bàn Phím', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2022/09/07/logoooooooooooooooo.png' },
        { name: 'IPhone', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2021/11/11/asu-logo.png' },
        { name: 'Ipad', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2023/06/08/dell-logo.png' },
        { name: 'Loa', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2021/11/18/oooo.png' },
        { name: 'Phụ kiện chung', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2022/05/30/logo-acer-inkythuatso-2-01-27-15-50-00.jpg' },
        { name: 'Điện thoại', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2022/01/15/anh-chup-man-hinh-2022-01-15-luc-08-49-50.png' },
        { name: 'Máy tính bảng', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2021/11/11/microsoft-logo-inkythuatso-01-29-10-05-20.jpg' },
        { name: 'Máy in', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2023/06/08/lenovo-logo-png-1_638218133437530990.png' },
        { name: 'TV', image: 'https://cdn.hoanghamobile.com/i/cat/Uploads/2023/06/08/2560px-lg-logo-2015-svg.png' },
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
                    <TabPane tab="Tuần lễ giảm giá" key="1" >
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
                    <TabPane tab="Ưu đãi ngon vl" key="2">
                        Content of Tab 2
                    </TabPane>
                    <TabPane tab="Flash Sales" key="3">
                        Content of Tab 3
                    </TabPane>
                </Tabs>
            </div>

            {/*-------- Danh mục nổi bật -----------*/}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundColor: 'white', padding: '10px' }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '20px', display: '-webkit-box' }}>Danh mục điện thoại</div>
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
            </div>
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundColor: 'white', padding: '10px' }}>
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
                                        {/* <p className="category-name">{danhmuc2.name}</p> */}
                                    </div>
                                </MDBCol>
                            ))}
                        </MDBRow>
                    </MDBContainer>
                </div>
            </div>

            {/* ------------------box sản phẩm Laptop ------------------ */}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundSize: 'cover', backgroundImage: 'url(https://lh3.googleusercontent.com/pSzqZlVLMrhpyoU2QoTUVctJZc8uuuLNG97D8rZTQ0Ds29acQoNVkeG93TEklTJSMQyDjnpDhs0p8eCI1WRpAefb8iNlJ8Os=w1232)' }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '25px', display: '-webkit-box', padding: ' 20px 0px 10px 20px', color: 'white' }}>Top 5 Laptop bán chạy</div>
                </div>
                <div style={{ width: '98%', margin: '0 auto' }}>
                    <div
                        className="horizontal-scroll-view"
                        style={{ display: 'flex', overflowX: 'scroll', padding: '10px', whiteSpace: 'nowrap', }} >
                        {topLaptop && topLaptop.length > 0 &&
                            topLaptop.map((item, index) => (
                                <Card
                                    key={item.id}
                                    hoverable
                                    className="product-card"
                                    style={{ width: '20%', boxSizing: 'border-box', marginRight: '10px', display: 'inline-block', }}>
                                    <img src={item.avatar} style={{ width: '200px' }}></img>
                                    <a className="name-card">{item.name}</a>
                                    <p style={{ color: 'rgb(20, 53, 195)', fontWeight: 'bold' }}>{item.price} ₫</p>
                                    <Button onClick={() => handleViewDetailuser(item)} type="primary" icon={<ShoppingCartOutlined />}>Buy
                                        {/* Biểu tượng mua hàng */}
                                    </Button>
                                </Card>


                            ))}
                    </div>
                </div>
            </div>

            {/* ------------------box sản phẩm Điện thoại ------------------ */}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundSize: 'cover', backgroundImage: 'url(https://lh3.googleusercontent.com/7Ir75Yug6lSI2YU2c2EqwwWpy6bMGX4RgX_MSQInk3aiBZThzQ_BRy-lADiOKFEOUh8eIFOeSjZzWANGmfV7zPyu23nOAcYt=w1232)' }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '25px', display: '-webkit-box', padding: ' 20px 0px 0px 20px', color: 'white' }}>Top 5 Điện Thoại bán chạy</div>
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

            {/* ------------------box sản phẩm ------------------ */}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundSize: 'cover', backgroundColor: "white" }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '25px', display: '-webkit-box', padding: '20px', color: 'black' }}>Sản phẩm</div>
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
                                        <p style={{ color: 'rgb(20, 53, 195)', fontWeight: 'bold' }}>{item.Price} ₫</p>
                                        <Button type="primary" icon={<ShoppingCartOutlined />} style={{ marginLeft: 'auto' }} onClick={() => handleAddToCart(item)}>
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


            {/* ------------------Sản phẩm đã xem -----------------------*/}
            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundSize: 'cover', backgroundColor: "white" }}>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '25px', display: '-webkit-box', padding: '20px', color: 'black' }}>Sản phẩm đã xem</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {historysp && historysp.length > 0 &&
                        historysp.slice(startIndex, endIndex).map((item, index) => (
                            <Card
                                key={item.id}
                                hoverable
                                className="card-sp"
                            >
                                <img src={item.avatar} style={{ width: '170px', height: '170px', objectFit: 'cover' }} alt={item.name} onClick={() => handleViewDetailproducts(item)} />
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <a className="name-card">{item.name}</a>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ color: 'rgb(20, 53, 195)', fontWeight: 'bold' }}>{item.Price} ₫</p>
                                        <Button type="primary" icon={<ShoppingCartOutlined />} style={{ marginLeft: 'auto' }} onClick={() => handleAddToCart(item)}>
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
