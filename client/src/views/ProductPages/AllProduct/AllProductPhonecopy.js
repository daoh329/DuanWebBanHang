import React, { useState, useEffect } from 'react';
import axios from "axios";
import Slider from "@mui/material/Slider";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Pagination } from "antd";
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Divider, Button } from '@mui/material';
import './AllProduct.css';
import { useNavigate } from "react-router-dom";

function valuetext(value) {
  return `${value}°C`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

const AllProductPhonecopy = () => {
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState(() => {
    // Lấy giá trị từ localStorage khi trang web được tải
    const savedSliderValue = JSON.parse(localStorage.getItem('sliderValue'));
    return savedSliderValue || [0, 40000000];
  });
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortType, setSortType] = useState("none");
  const [minSliderValue, setMinSliderValue] = useState(0);
  const [maxSliderValue, setMaxSliderValue] = useState(40000000);
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [displayedProducts, setDisplayedProducts] = useState(products);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/product/productsPhone`)
      .then((response) => {
        setProducts(response.data);
        // Ban đầu hiển thị tất cả sản phẩm
        setDisplayedProducts(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  useEffect(() => {
    // Lưu giá trị Slider vào localStorage khi giá trị thay đổi
    localStorage.setItem('sliderValue', JSON.stringify(value));
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsFiltering(true);
    setMinSliderValue(newValue[0]);
    setMaxSliderValue(newValue[1]);

    const filteredByPrice = products.filter((product) => {
      const price = product.price;
      return price >= newValue[0] && price <= newValue[1];
    });

    const filteredByBrand = selectedBrand !== 'ALL'
      ? filteredByPrice.filter((product) => product.brand === selectedBrand)
      : filteredByPrice;

    setFilteredProducts(filteredByBrand);

    // Cập nhật displayedProducts dựa trên filteredProducts hoặc products tùy thuộc vào việc áp dụng bộ lọc
    setDisplayedProducts(isFiltering ? filteredByBrand : products);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);

    const filteredByBrand = event.target.value !== 'ALL'
      ? products.filter((product) => product.brand === event.target.value)
      : products;

    const [minValue, maxValue] = value;
    const filteredByPrice = filteredByBrand.filter((product) => {
      const price = product.price;
      return price >= minValue && price <= maxValue;
    });

    setFilteredProducts(filteredByPrice);
  };

  const handleSortChange = (type) => {
    setSortType(type);

    const sortedProducts = [...filteredProducts];

    switch (type) {
      case 'priceLowToHigh':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(sortedProducts);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsFiltering(false);
  };

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleViewDetailProduct = (product) => {
    if (!product.id) {
      console.error('Product ID is undefined!');
      return;
    }

    const historysp = JSON.parse(sessionStorage.getItem("products")) || [];
    const historyproduct = {
      shortDescription: product.shortDescription,
      price: product.price,
      avatar: product.thumbnail,
      id: product.id,
    };

    const isViewed = historysp.some(
      (product) => product.shortDescription === historyproduct.shortDescription
    );

    if (!isViewed) {
      historysp.push(historyproduct);
      sessionStorage.setItem("products", JSON.stringify(historysp));
    }

    navigate(`/detail/${product.id}`);
  };

  return (
    <div className='box-1usfas1'>
      <div className='css-1usfas1'>
        <div className='box-filter'>
          <div className='box-filter-a'>
            <div className="css-1psc7jy snipcss-AZgo3">
              <div type="subtitle" className="css-1realo9">
                Khoảng giá
              </div>
              <div>
                <div class="css-1n5trgy" direction="row">
                  <span class="css-11mfy90">{formatCurrency(minSliderValue)}</span>
                  <span class="css-11mfy90">{formatCurrency(maxSliderValue)}</span>
                </div>
              </div>
              <Box sx={{ width: 'auto', padding: '5px' }}>
                <Slider
                  max={40000000}
                  min={0}
                  step={500000}
                  getAriaLabel={() => "Temperature range"}
                  value={value}
                  size="small"
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                />
              </Box>
              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label" >Thương hiệu</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  size="small"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                >
                  <FormControlLabel value="ALL" control={<Radio />} label="ALL" />
                  <FormControlLabel value="SAMSUNG" control={<Radio />} label="SAMSUNG" />
                  <FormControlLabel value="APPLE" control={<Radio />} label="APPLE" />
                  <FormControlLabel value="Dell" control={<Radio />} label="Dell" />
                </RadioGroup>
              </FormControl>
              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
            </div>
          </div>
        </div>
        <div className='box-products'>
          <div className='title-products'>
            Tất cả sản phẩm
          </div>
          <div className='arrange-products'>
            <div className="css-arrange">
              Xắp xếp theo
              <button className="sort-button" onClick={() => handleSortChange('priceLowToHigh')}>Giá thấp đến cao</button>
              <button className="sort-button" onClick={() => handleSortChange('priceHighToLow')}>Giá cao đến thấp</button>
              <button className="sort-button" onClick={() => handleSortChange('none')}>Sản phẩm mới nhất</button>
            </div>
          </div>
          <div className='all-products'>
            <div className='y2krk0'>
              {(isFiltering ? filteredProducts : products).slice(startIndex, endIndex).map((item, index) => (
                <div type="grid" className="css-13w7uog" key={item.id}>
                  <div
                    className="product-cards css-35xksx"
                    data-content-region-name="itemProductResult"
                    data-track-content="true"
                    data-content-name={item.id}
                    data-content-index={index}
                    data-content-target="productDetail"
                  >
                    <a
                      target="_self"
                      className="css-pxdb0j"
                      onClick={() => handleViewDetailProduct(item)}
                    >
                      <div className="css-4rhdrh">
                        <div className="css-1v97aik">
                          <div className="css-798fc">
                            <div height="100%" width="100%" className="css-1uzm8bv">
                              <img
                                loading="lazy"
                                hover="zoom"
                                decoding="async"
                                src={process.env.REACT_APP_API_URL + item.thumbnail}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  position: "absolute",
                                  top: 0,
                                  left: 0
                                }}
                                alt={item.shortDescription}
                              />
                            </div>
                          </div>
                          <div className="css-14q2k9d">
                            <div className="css-zb7zul">
                              <div className="css-1bqeu8f">TIẾT KIỆM</div>
                              <div className="css-1rdv2qd">191.000&nbsp;₫</div>
                            </div>
                          </div>
                        </div>
                        <div className="css-68cx5s">
                          <div
                            type="body"
                            color="textSecondary"
                            className="product-brand-name css-90n0z6"
                            style={{ textTransform: "uppercase", display: "inline" }}
                          >
                            {item.brand}
                          </div>
                        </div>
                        <div className="css-1ybkowq">
                          <div
                            type="caption"
                            className="att-product-card-title css-1uunp2d"
                            color="textPrimary"
                          >
                            <h3
                              title={item.shortDescription}
                              className="css-1xdyrhj"
                            >
                              {item.shortDescription}
                            </h3>
                          </div>
                        </div>
                        <div className="css-kgkvir">
                          <div className="css-1co26wt">
                            <div
                              type="subtitle"
                              className="att-product-detail-latest-price css-do31rh"
                              color="primary500"
                            >
                              {formatCurrency(item.price)}
                            </div>
                            <div className="css-3mjppt">
                              <div
                                type="caption"
                                className="att-product-detail-retail-price css-18z00w6"
                                color="textSecondary"
                              >
                                1.590.000&nbsp;₫
                              </div>
                              <div type="caption" color="primary500" className="css-2rwx6s">
                                -12.01%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div direction="row" className="css-w8t278">
                          <div width={24} height={24} className="css-mtfgc8">
                            <div height="100%" width="100%" className="css-8tlony">
                              <img
                                src="https://lh3.googleusercontent.com/Py0IZbRdaIo7LaHZK3eblQBu-iPyWjPepxwWmwcDPgUw6z2oKksOybAsl0Twi0t4BusEcmAsFFMTBlSD7aLV=rw"
                                loading="lazy"
                                hover=""
                                decoding="async"
                                alt="Túi chống sốc Western (Quà tặng)"
                                fetchpriority="low"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  position: "absolute",
                                  top: 0,
                                  left: 0
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pagination-container" style={{ textAlign: "center", margin: '0 auto', marginTop: "10px" }}>
            <Pagination
              current={currentPage}
              total={filteredProducts.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllProductPhonecopy;
