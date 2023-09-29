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
import './AllProduct.css'
import { useNavigate } from "react-router-dom";
function valuetext(value) {
  return `${value}°C`;
}
function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState([0, 35000000]);
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortType, setSortType] = useState("none");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/product/products`)
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsFiltering(true);
    // Lấy giá trị min và max từ newValue
    const [minValue, maxValue] = newValue;

    // Sử dụng giá trị min và max để cập nhật giá trị của input
    const minInput = document.getElementById('minInput'); // Thay 'minInput' bằng id thật của input min
    const maxInput = document.getElementById('maxInput'); // Thay 'maxInput' bằng id thật của input max

    if (minInput && maxInput) {
      minInput.value = formatCurrency(minValue);
      maxInput.value = formatCurrency(maxValue);
    }
    // Lọc sản phẩm dựa trên khoảng giá
    const filteredByPrice = products.filter((product) => {
      const price = product.price; // Giả sử price là giá của sản phẩm
      return price >= minValue && price <= maxValue;
    });
    // Lọc theo thương hiệu (nếu có)
    const filteredByBrand = selectedBrand !== 'ALL'
      ? filteredByPrice.filter((product) => product.brand === selectedBrand)
      : filteredByPrice;

    setFilteredProducts(filteredByBrand);
  };

  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    // Lọc sản phẩm dựa trên thương hiệu đã chọn
    const filteredByBrand = event.target.value !== 'ALL'
      ? products.filter((product) => product.brand === event.target.value)
      : products;

    // Lọc lại theo khoảng giá (nếu đang lọc theo giá)
    const [minValue, maxValue] = value;
    const filteredByPrice = filteredByBrand.filter((product) => {
      const price = product.price; // Giả sử price là giá của sản phẩm
      return price >= minValue && price <= maxValue;
    });

    setFilteredProducts(filteredByPrice);
  };



  const handleSortChange = (type) => {
    // Cập nhật loại sắp xếp trong state
    setSortType(type);

    // Sắp xếp danh sách sản phẩm
    const sortedProducts = [...(isFiltering ? filteredProducts : products)];

    switch (type) {
      case 'priceLowToHigh':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // Nếu không chọn loại sắp xếp, giữ nguyên danh sách
        break;
    }

    // Cập nhật danh sách sản phẩm đã sắp xếp
    setFilteredProducts(sortedProducts);
  };



  // State để lưu trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm xử lý sự kiện khi người dùng chọn trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsFiltering(false); // Đặt isFiltering thành false khi bạn chuyển trang
  };
  const itemsPerPage = 10; // Số sản phẩm trên mỗi trang
  // Tính index bắt đầu và index kết thúc cho sản phẩm trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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
      (product) => product.shortDescription === historyproduct.shortDescription
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

  return (
    <div className='box-1usfas1'>
      <div className='css-1usfas1'>
        <div className='box-filter'>
          <div className='box-filter-a'>
            <div className="css-1psc7jy snipcss-AZgo3">
              <div type="subtitle" className="css-1realo9">
                Khoảng giá
              </div>
              <input id="minInput" />
              <input id="maxInput" />
              <Box sx={{ width: 'auto', padding: '5px' }}>
                <Slider
                  max={35000000}
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
                  <FormControlLabel value="ACER" control={<Radio />} label="ACER" />
                  <FormControlLabel value="MSI" control={<Radio />} label="MSI" />
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
              <button className="sort-button" onClick={handleSortChange}>Sản phẩm mới nhất</button>
            </div>
          </div>
          <div className='all-products'>
            <div className="all-control-products">
              {(isFiltering ? filteredProducts : products).slice(startIndex, endIndex).map((item, index) => (

                <div className="all-card-product">
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
            <div className="pagination-container" style={{ textAlign: "center", margin: '0 auto', marginTop: "10px" }}>
              <Pagination
                current={currentPage}
                total={products.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
export default AllProduct;