import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  notification,
} from "antd";
import Slider from "@mui/material/Slider";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import { Pagination } from "antd";
import { Box, } from '@mui/material';
import './AllProduct.css'
import { useNavigate } from "react-router-dom";

const { Option } = Select;
function valuetext(value) {
  return `${value}°C`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

const AllNewProductPhone = () => {
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
  const [selectedRom, setSelectedRom] = useState('ALL');
  const [selectedChip, setSelectedChip] = useState('ALL');
  const [selectedSeries, setSelectedSeries] = useState('ALL');
  const [selectedRam, setSelectedRam] = useState('ALL');
  const [selectedPin, setSelectedPin] = useState('ALL');
  const [selectedRear_camera, setSelectedRear_camera] = useState('ALL');
  const [selectedFront_camera, setSelectedFront_camera] = useState('ALL');
  const [selectedScreen, setSelectedScreen] = useState('ALL');

  const [displayedProducts, setDisplayedProducts] = useState(products);
  const brands = [...new Set(products.map(product => product.brand))];
  const configurations = products.map(product => JSON.parse(product.configuration));
  const uniqueRom = [...new Set(configurations.map(config => config.rom))];
  const uniqueChip = [...new Set(configurations.map(config => config.chip))];
  const uniqueSeries = [...new Set(configurations.map(config => config.series))];
  const uniqueRam = [...new Set(configurations.map(config => config.ram))];
  const uniquePin = [...new Set(configurations.map(config => config.pin))];
  const uniqueRear_camera = [...new Set(configurations.map(config => config.rear_camera))];
  const uniqueFront_camera = [...new Set(configurations.map(config => config.front_camera))];
  const uniqueScreen = [...new Set(configurations.map(config => config.screen))];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/product/newphone`)
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

  useEffect(() => {
    filterProducts();
  }, [selectedBrand, selectedRom, minSliderValue, maxSliderValue, selectedChip, selectedSeries, selectedRam, selectedPin, selectedRear_camera,
    selectedFront_camera, selectedScreen
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsFiltering(true);
    setMinSliderValue(newValue[0]);
    setMaxSliderValue(newValue[1]);
    filterProducts();
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    filterProducts(value);
  };


  const handleRomChange = (value) => {
    setSelectedRom(value);
    filterProducts(value);
  };



  const handleChipChange = (value) => {
    setSelectedChip(value);
    filterProducts(value);
  };

  const handleSeriesChange = (value) => {
    setSelectedSeries(value);
    filterProducts(value);
  };

  const handleRamChange = (value) => {
    setSelectedRam(value);
    filterProducts(value);
  };
  const handlePinChange = (value) => {
    setSelectedPin(value);
    filterProducts(value);
  };
  const handleRear_cameraChange = (value) => {
    setSelectedRear_camera(value);
    filterProducts(value);
  };
  const handleFront_cameraChange = (value) => {
    setSelectedFront_camera(value);
    filterProducts(value);
  };
  const handleScreenChange = (value) => {
    setSelectedScreen(value);
    filterProducts(value);
  };


  const filterProducts = () => {
    let filteredProducts = products;

    // Lọc theo giá
    filteredProducts = filteredProducts.filter((product) => {
      const price = product.price;
      return price >= minSliderValue && price <= maxSliderValue;
    });

    // Lọc theo thương hiệu
    if (selectedBrand !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => product.brand === selectedBrand);
    }

    // Lọc theo ROM
    if (selectedRom !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.rom === selectedRom;
      });
    }


    // Lọc theo chip
    if (selectedChip !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.chip === selectedChip;
      });

    }
    // Lọc theo series
    if (selectedSeries !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.series === selectedSeries;
      });
    }

    // Lọc theo ram
    if (selectedRam !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.ram === selectedRam;
      });
    }

    // Lọc theo pin
    if (selectedPin !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.pin === selectedPin;
      });
    }

    // Lọc theo  rear_camera
    if (selectedRear_camera !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.rear_camera === selectedRear_camera;
      });
    }

    // Lọc theo  front_camera
    if (selectedFront_camera !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.front_camera === selectedFront_camera;
      });
    }

    // Lọc theo  screen
    if (selectedScreen !== 'ALL') {
      filteredProducts = filteredProducts.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.screen === selectedScreen;
      });
    }




    setFilteredProducts(filteredProducts);
    setDisplayedProducts(filteredProducts);
  };




  const handleSortChange = (type) => {
    setSortType(type);

    // Tạo một bản sao của trạng thái displayedProducts để tránh biến đổi trạng thái gốc
    const sortedProducts = [...displayedProducts];

    switch (type) {
      case 'priceLowToHigh':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newestProducts':
        sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        // Nếu loại là 'none' hoặc không hợp lệ, đặt lại sắp xếp về thứ tự ban đầu
        setDisplayedProducts(filteredProducts);
        return;
    }

    // Cập nhật trạng thái displayedProducts với các sản phẩm đã sắp xếp
    setDisplayedProducts(sortedProducts);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsFiltering(false);
  };

  const itemsPerPage = 50;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleViewDetailProduct = (product) => {
    if (!product.id) {
      console.error('Product ID is undefined!');
      return;
    }

    const historysp = JSON.parse(sessionStorage.getItem("products")) || [];
    const historyproduct = {
      shortDescription: products.shortDescription,
      price: products.price,
      discount: products.discount,
      thumbnail: products.thumbnail,
      brand: products.brand,
      id: products.id,
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
              <Form.Item label="Thương hiệu" name="brand" >
                <Select
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  style={{ marginTop: '10px' }} // Áp dụng kiểu dáng trực tiếp
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {brands &&
                    brands.map((brand) => (
                      <Select.Option key={brand} value={brand}>
                        <span style={{ fontSize: '13px' }}>{brand}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>

              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <Form.Item label="Series" name="series">
                <Select
                  value={selectedSeries}
                  onChange={handleSeriesChange}
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {uniqueSeries &&
                    uniqueSeries.map((series) => (
                      <Select.Option key={series} value={series}>
                        <span style={{ fontSize: '13px' }}>{series}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              
              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <Form.Item label="Rom" name="rom" >
                <Select
                  value={selectedRom}
                  onChange={handleRomChange}
                  style={{ marginTop: '10px' }}
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {uniqueRom &&
                    uniqueRom.map((rom) => (
                      <Select.Option key={rom} value={rom}>
                        <span style={{ fontSize: '13px' }}>{rom}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>

              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <Form.Item label="Ram" name="ram" >
                <Select
                  value={selectedRam}
                  onChange={handleRamChange}
                  style={{ marginTop: '10px' }}
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {uniqueRam &&
                    uniqueRam.map((ram) => (
                      <Select.Option key={ram} value={ram}>
                        <span style={{ fontSize: '13px' }}>{ram}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>


              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <Form.Item label="Chip" name="chip">
                <Select
                  value={selectedChip}
                  onChange={handleChipChange}
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {uniqueChip &&
                    uniqueChip.map((chip) => (
                      <Select.Option key={chip} value={chip}>
                        <span style={{ fontSize: '13px' }}>{chip}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>

             

              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <Form.Item label="Pin" name="pin">
                <Select
                  value={selectedPin}
                  onChange={handlePinChange}
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {uniquePin &&
                    uniquePin.map((pin) => (
                      <Select.Option key={pin} value={pin}>
                        <span style={{ fontSize: '13px' }}>{pin}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>

              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <Form.Item label="Camera trước" name="front_camera">
                <Select
                  value={selectedFront_camera}
                  onChange={handleFront_cameraChange}
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {uniqueFront_camera &&
                    uniqueFront_camera.map((front_camera) => (
                      <Select.Option key={front_camera} value={front_camera}>
                        <span style={{ fontSize: '13px' }}>{front_camera}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>

              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <Form.Item label="Camera sau" name="rear_camera">
                <Select
                  value={selectedRear_camera}
                  onChange={handleRear_cameraChange}
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {uniqueRear_camera &&
                    uniqueRear_camera.map((rear_camera) => (
                      <Select.Option key={rear_camera} value={rear_camera}>
                        <span style={{ fontSize: '13px' }}>{rear_camera}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>

              <div className="css-f1fyi0">
                <div width="100%" color="border" className="css-yae08c"></div>
              </div>
              <Form.Item label="Màn hình" name="screen">
                <Select
                  value={selectedScreen}
                  onChange={handleScreenChange}
                >
                  <Select.Option value="ALL">
                    <span style={{ fontSize: '13px' }}>ALL</span>
                  </Select.Option>

                  {uniqueScreen &&
                    uniqueScreen.map((screen) => (
                      <Select.Option key={screen} value={screen}>
                        <span style={{ fontSize: '13px' }}>{screen}</span>
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>

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
              <button className="sort-button" onClick={() => handleSortChange('newestProducts')}>Sản phẩm mới nhất</button>
            </div>
          </div>
          <div className='all-products'>
            <div className='y2krk0'>
              {displayedProducts.map((item, index) => (
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
                            style={{ display: "inline" }}
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
                                  {formatCurrency(item.price)}
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
  )
}

export default AllNewProductPhone;
