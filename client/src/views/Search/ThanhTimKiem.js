import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import VirtualList from 'rc-virtual-list';
import { Avatar, List } from 'antd';

const SearchComponent = () => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [laptopProducts, setLaptopProducts] = useState([]);
    const [phoneProducts, setPhoneProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/product/productslaptop`)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((element) => {
                    element.configuration = JSON.parse(element.configuration);
                });
                setLaptopProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching laptop data:", error);
            });

        fetch(`${process.env.REACT_APP_API_URL}/product/productsPhone`)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((element) => {
                    element.configuration = JSON.parse(element.configuration);
                });
                setPhoneProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching phone data:", error);
            });
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const allProducts = [...laptopProducts, ...phoneProducts];
            const results = allProducts.filter(product =>
                product.shortDescription.toLowerCase().replace(/\s/g, '').includes(searchQuery.toLowerCase().replace(/\s/g, ''))
            );
            setSuggestedProducts(results);
        } else {
            setSuggestedProducts([]);
        }
    }, [searchQuery, laptopProducts, phoneProducts]);



    const handleSearch = () => {
        navigate(`/search?query=${encodeURIComponent(searchQuery.toLowerCase())}`);
        setSearchHistory([...searchHistory, searchQuery]);

        setShowSuggestions(false);

    };

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
        const allProducts = [...laptopProducts, ...phoneProducts];
        const results = allProducts.filter(product => {
            const words = product.shortDescription.toLowerCase().split(' ');
            return words.some(word => word.startsWith(event.target.value.toLowerCase()));
        });
        setSuggestedProducts(results);
        setShowSuggestions(true);
    };

    const handleMouseEnter = () => {
        setShowSuggestions(true);
    };

    const handleMouseLeave = () => {
        setShowSuggestions(false);
    };

    // const [isTouchingItem, setIsTouchingItem] = useState(false);

    // const handleItemTouchStart = () => {
    //     setIsTouchingItem(true);
    // };

    // const handleItemTouchEnd = () => {
    //     setIsTouchingItem(false);
    // };

    // quaqua trang chi tiết 
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

    return (
        <div
            style={{ padding: "8px", minWidth: 0, flex: "1 1 auto" }}
            className="teko-col css-388q1u"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="css-cssveg">
                <div className="css-17xgviv">
                    <div
                        data-content-region-name="headerBar"
                        data-track-content="true"
                        data-content-name="searchBox"
                        className="css-7wh3a0"
                    >
                        <input
                            className="search-input css-7jjcju"
                            placeholder="Nhập từ khoá cần tìm"
                            role="searchbox"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}

                        />
                        {showSuggestions && searchQuery && (
                          <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white',
                            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', zIndex: 1,
                        }}>
                            <List>
                                <VirtualList
                                    data={suggestedProducts}
                                    height={Math.min(suggestedProducts.length *70, 400)}
                                    itemHeight={20}
                                    itemKey="id"
                                    style={{ padding: '50px' }}
                                >
                                    {(product) => (
                                        <List.Item key={product.id}
                                            onClick={() => handleViewDetailProduct(product)}
                                        >
                                            <List.Item.Meta
                                                avatar={<img src={
                                                    product.main_image
                                                        ? process.env.REACT_APP_API_URL + product.main_image
                                                        : process.env.REACT_APP_API_URL + product.thumbnail
                                                } alt={product.shortDescription} style={{ width: '50px', height: '50px' }} />}
                                                title={
                                                    <div style={{
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 4,
                                                        textAlign: 'left',
                                                    }}>
                                                        {product.shortDescription}
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                </VirtualList>
                            </List>
                        </div>
                        
                        )}
                    </div>
                    <div
                        data-content-region-name="headerBar"
                        data-track-content="true"
                        data-content-name="searchButton"
                        className="css-7kp13n"
                    >
                        <button
                            className="search-icon css-193nd6m"
                            aria-label="Search"
                            onClick={handleSearch}
                        >
                            <span
                                size="26"
                                color="#616161"
                                className="css-1dn5jdn"
                            ></span>
                        </button>
                    </div>
                </div>
                <div className="css-1nb0ewh"></div>
            </div>
        </div>

    );
};

export default SearchComponent;
