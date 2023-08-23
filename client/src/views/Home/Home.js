import React from 'react';
import { useState, useEffect } from 'react';
import { Layout, Affix, Carousel, Tabs, Card, Button, } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Home.scss'
const { Header } = Layout;
const { TabPane } = Tabs;

const products = [
    {
        id: 1,
        name: 'LapTop A',
        price: 100000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',
    },
    {
        id: 2,
        name: 'LapTop B',
        price: 150000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 3,
        name: 'LapTop C',
        price: 200000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 4,
        name: 'LapTop D',
        price: 260000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 5,
        name: 'LapTop E',
        price: 50000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 6,
        name: 'LapTop F',
        price: 170000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 7,
        name: 'LapTop G',
        price: 150000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 8,
        name: 'LapTop H',
        price: 150,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 9,
        name: 'LapTop Y',
        price: 150,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 10,
        name: 'LapTop K',
        price: 150,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    // Thêm các sản phẩm khác vào đây
];
const tuanlevang = [
    {
        id: 1,
        name: 'LapTop A',
        price: 100000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',
    },
    {
        id: 2,
        name: 'LapTop B',
        price: 150000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 3,
        name: 'LapTop C',
        price: 200000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 4,
        name: 'LapTop D',
        price: 260000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },
    {
        id: 5,
        name: 'LapTop E',
        price: 50000,
        imageUrl: 'https://lh3.googleusercontent.com/PjhHXXreUCNNLITAJ3gfR2heYwi7JRjbjIwC4Rh-zDi8cUqQT0CoVQVQ0WzoOuKG487h__xpEZQ_zQDXfWvRWWrKDYFSmc0wZA=w230-rw',

    },

];
const Home = () => {
    const sliderImages = [
        'https://lh3.googleusercontent.com/Z4ALctQHIePEih7m2kbV-DyrS4NGkU3ba51_ELp9L7Y_UyJTvEWC1mLFDRss3v5UNrEO62ijjSuY4iWFum-j4oUyXgoGfz10dA=w1920-rw',
        'https://lh3.googleusercontent.com/Z4ALctQHIePEih7m2kbV-DyrS4NGkU3ba51_ELp9L7Y_UyJTvEWC1mLFDRss3v5UNrEO62ijjSuY4iWFum-j4oUyXgoGfz10dA=w1920-rw',
        'https://lh3.googleusercontent.com/Z4ALctQHIePEih7m2kbV-DyrS4NGkU3ba51_ELp9L7Y_UyJTvEWC1mLFDRss3v5UNrEO62ijjSuY4iWFum-j4oUyXgoGfz10dA=w1920-rw',
        'https://lh3.googleusercontent.com/Z4ALctQHIePEih7m2kbV-DyrS4NGkU3ba51_ELp9L7Y_UyJTvEWC1mLFDRss3v5UNrEO62ijjSuY4iWFum-j4oUyXgoGfz10dA=w1920-rw',
        'https://lh3.googleusercontent.com/Z4ALctQHIePEih7m2kbV-DyrS4NGkU3ba51_ELp9L7Y_UyJTvEWC1mLFDRss3v5UNrEO62ijjSuY4iWFum-j4oUyXgoGfz10dA=w1920-rw',
    ];
    const categories = ['Danh mục 1', 'Danh mục 2', 'Danh mục 3', 'Danh mục 4', 'Danh mục 5'];
    const subCategories = {
        'Danh mục 1': ['Danh mục con 1.1', 'Danh mục con 1.2', 'Danh mục con 1.3'],
        'Danh mục 2': ['Danh mục con 2.1', 'Danh mục con 2.2', 'Danh mục con 2.3'],
        // ... Thêm các danh mục con khác
    };
    const [activeTab, setActiveTab] = useState("1"); // State to keep track of active tab

    const handleTabChange = (key) => {
        setActiveTab(key);
    };
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
                {/* ... Nội dung khác của trang */}
            </div>
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

            <div style={{ borderRadius: '20px', width: '80%', margin: '0 auto', marginTop: '20px', backgroundImage: 'url(https://lh3.googleusercontent.com/FphgdKoJkfp17IB5xYJvah5EShCZUjDQER9SGUCZMzvzsfcDeRKvZ-coSz0kSdhRn7ZvwPBC2qMoHO3Iek_p5knTcxv2Gb-7=w1232)' }}>
                <h2 style={{color:"white",}}>LAPTOP</h2>
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
                                    <Button type="primary" icon={<ShoppingCartOutlined />}>
                                        {/* Biểu tượng mua hàng */}
                                    </Button>
                                </Card>
                            ))}
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Home;
