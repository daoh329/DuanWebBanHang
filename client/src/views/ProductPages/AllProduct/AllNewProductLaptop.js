import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  notification,
} from "antd";
import Slider from "@mui/material/Slider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { Pagination } from "antd";
import { Box } from "@mui/material";
import "./AllProduct.css";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../util/FormatVnd";
import CardProduct from "../../Card/Card";
import { addToRecentlyViewedProduct } from "../../../util/servicesGlobal";

const { Option } = Select;
function valuetext(value) {
  return `${value}°C`;
}

const AllNewProductLaptop = () => {
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState(() => {
    // Lấy giá trị từ localStorage khi trang web được tải
    const savedSliderValue = JSON.parse(localStorage.getItem("sliderValue"));
    return savedSliderValue || [0, 90000000];
  });
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortType, setSortType] = useState("none");
  const [minSliderValue, setMinSliderValue] = useState(0);
  const [maxSliderValue, setMaxSliderValue] = useState(90000000);
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedRom, setSelectedRom] = useState("ALL");
  const [selectedCpu, setSelectedCpu] = useState("ALL");
  const [selectedSeries, setSelectedSeries] = useState("ALL");
  const [selectedRam, setSelectedRam] = useState("ALL");
  const [selectedPin, setSelectedPin] = useState("ALL");
  const [selectedVga, setSelectedVga] = useState("ALL");
  const [selectedFront_camera, setSelectedFront_camera] = useState("ALL");
  const [selectedScreen, setSelectedScreen] = useState("ALL");

  const [displayedProducts, setDisplayedProducts] = useState(products);

  //Loại bỏ các thương hiệu trùng lặp từ mảng product
  const brands = [...new Set(products.map((product) => product.brand))];
  const configurations = products.map((product) =>
    JSON.parse(product.configuration)
  );
  const variations = products.flatMap(product => product.variations);
  const uniqueRom = [...new Set(variations.map(variation => variation.capacity))];
  const uniqueCpu = [...new Set(configurations.map((config) => config.cpu))];
  const uniqueSeries = [
    ...new Set(configurations.map((config) => config.series)),
  ];
  const uniqueRam = [...new Set(configurations.map((config) => config.ram))];
  const uniquePin = [...new Set(configurations.map((config) => config.pin))];
  const uniqueVga = [...new Set(configurations.map((config) => config.graphicsCard))];
  const uniqueFront_camera = [
    ...new Set(configurations.map((config) => config.front_camera)),
  ];
  const uniqueScreen = [
    ...new Set(configurations.map((config) => config.screenSize)),
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/product/newlaptop`)
      .then((response) => {
        setProducts(response.data);
        // Ban đầu hiển thị tất cả sản phẩm
        setDisplayedProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  useEffect(() => {
    // Lưu giá trị Slider vào localStorage khi giá trị thay đổi
    localStorage.setItem("sliderValue", JSON.stringify(value));
  }, [value]);

  useEffect(() => {
    filterProducts();
  }, [
    selectedBrand,
    selectedRom,
    minSliderValue,
    maxSliderValue,
    selectedCpu,
    selectedSeries,
    selectedRam,
    selectedPin,
    selectedVga,
    selectedFront_camera,
    selectedScreen,
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

  const handleCpuChange = (value) => {
    setSelectedCpu(value);
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
  const handleVgaChange = (value) => {
    setSelectedVga(value);
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
    filteredProducts = filteredProducts?.filter((product) => {
      return product.variations.some((variation) => {
        const price = variation.price;
        return price >= minSliderValue && price <= maxSliderValue;
      });
    });
    

    // Lọc theo thương hiệu
    if (selectedBrand !== "ALL") {
      filteredProducts = filteredProducts?.filter(
        (product) => product.brand === selectedBrand
      );
    }

    // Lọc theo ROM
    if (selectedRom !== 'ALL') {
      filteredProducts = filteredProducts?.filter((product) => {
        return product.variations.some((variation) => {
          return variation.capacity === selectedRom;
        });
      });
    }

    // Lọc theo Cpu
    if (selectedCpu !== "ALL") {
      filteredProducts = filteredProducts?.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.cpu === selectedCpu;
      });
    }
    // Lọc theo series
    if (selectedSeries !== "ALL") {
      filteredProducts = filteredProducts?.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.series === selectedSeries;
      });
    }

    // Lọc theo ram
    if (selectedRam !== "ALL") {
      filteredProducts = filteredProducts?.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.ram === selectedRam;
      });
    }

    // Lọc theo pin
    if (selectedPin !== "ALL") {
      filteredProducts = filteredProducts?.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.pin === selectedPin;
      });
    }

    // Lọc theo  Vga
    if (selectedVga !== "ALL") {
      filteredProducts = filteredProducts?.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.graphicsCard === selectedVga;
      });
    }

    // Lọc theo  front_camera
    if (selectedFront_camera !== "ALL") {
      filteredProducts = filteredProducts?.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.front_camera === selectedFront_camera;
      });
    }

    // Lọc theo  screen
    if (selectedScreen !== "ALL") {
      filteredProducts = filteredProducts?.filter((product) => {
        const config = JSON.parse(product.configuration);
        return config.screenSize === selectedScreen;
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
      case "priceLowToHigh":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newestProducts":
        sortedProducts.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
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

  const itemsPerPage = 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleViewDetailProduct = (products) => {
    addToRecentlyViewedProduct(products);
    navigate(`/detail/${products.id}`);
  };
  const handleFormatToDataSelect = (arrData) => {
    const newData = [];
    newData.push({ label: "Tất cả", value: "ALL" });
    [...arrData].forEach((item) => {
      const obj = {
        label: item,
        value: item,
      };
      newData.push(obj);
    });
    return newData;
  };
  return (
    <div className="box-1usfas1">
      <div className="css-1usfas1">
        <div className="box-filter">
          <div className="box-filter-a">
            <div className="css-1psc7jy snipcss-AZgo3">
              <div type="subtitle" className="css-1realo9">
                Khoảng giá
              </div>
              <div>
                <div className="css-1n5trgy" direction="row">
                  <span className="css-11mfy90">
                    {formatCurrency(minSliderValue)}
                  </span>
                  <span className="css-11mfy90">
                    {formatCurrency(maxSliderValue)}
                  </span>
                </div>
              </div>
              <Box sx={{ width: "auto", padding: "5px" }}>
                <Slider
                  max={90000000}
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

              <Divider style={{ margin: "0" }} />
              <div>
                Thương hiệu <br />
                <Select
                  title="Thương hiệu"
                  value={selectedBrand}
                  defaultValue={"ALL"}
                  onChange={handleBrandChange}
                  style={{ marginTop: "5px" , width:"100%"}}
                  options={handleFormatToDataSelect(brands)}
                />
              </div>

              <Divider style={{ margin: "10px 0 10px 0" }} />
              <div>
                Cpu <br />
                <Select
                  title="Cpu"
                  value={selectedCpu}
                  defaultValue={"ALL"}
                  onChange={handleCpuChange}
                  style={{ marginTop: "5px" , width:"100%"}}
                  options={handleFormatToDataSelect(uniqueCpu)}
                />
              </div>


              <Divider style={{ margin: "10px 0 10px 0" }} />
              <div>
              Card đồ họa <br />
                <Select
                  title="Card đồ họa"
                  value={selectedVga}
                  defaultValue={"ALL"}
                  onChange={handleVgaChange}
                  style={{ marginTop: "5px" , width:"100%"}}
                  options={handleFormatToDataSelect(uniqueVga)}
                />
              </div>

          
         
              <Divider style={{ margin: "10px 0 10px 0" }} />
              <div>
              Màn hình <br />
                <Select
                  title="Screen"
                  value={selectedScreen}
                  defaultValue={"ALL"}
                  onChange={handleScreenChange}
                  style={{ marginTop: "5px" , width:"100%"}}
                  options={handleFormatToDataSelect(uniqueScreen)}
                />
              </div>

     
              <Divider style={{ margin: "10px 0 10px 0" }} />
              <div>
              Series Laptop <br />
                <Select
                  title="Series"
                  value={selectedSeries}
                  defaultValue={"ALL"}
                  onChange={handleSeriesChange}
                  style={{ marginTop: "5px" , width:"100%"}}
                  options={handleFormatToDataSelect(uniqueSeries)}
                />
              </div>

              <Divider style={{ margin: "10px 0 10px 0" }} />
              <div>
              Lưu trữ <br />
                <Select
                  title="Rom"
                  value={selectedRom}
                  defaultValue={"ALL"}
                  onChange={handleRomChange}
                  style={{ marginTop: "5px" , width:"100%"}}
                  options={handleFormatToDataSelect(uniqueRom)}
                />
              </div>

              <Divider style={{ margin: "10px 0 10px 0" }} />
              <div>
              Ram <br />
                <Select
                  title="Ram"
                  value={selectedRam}
                  defaultValue={"ALL"}
                  onChange={handleRamChange}
                  style={{ marginTop: "5px" , width:"100%"}}
                  options={handleFormatToDataSelect(uniqueRam)}
                />
              </div>


             
             
           
             
            </div>
          </div>
        </div>
        <div className="box-products">
          <div className="title-products">Tất cả sản phẩm</div>
          <div className="arrange-products">
            <div className="css-arrange">
              Xắp xếp theo
              {/* <button
                className="sort-button"
                onClick={() => handleSortChange("priceLowToHigh")}
              >
                Giá thấp đến cao
              </button>
              <button
                className="sort-button"
                onClick={() => handleSortChange("priceHighToLow")}
              >
                Giá cao đến thấp
              </button> */}
              <button
                className="sort-button"
                onClick={() => handleSortChange("newestProducts")}
              >
                Sản phẩm mới nhất
              </button>
            </div>
          </div>
          <div className="all-products">
            <div className="y2krk0">
              {displayedProducts.map((item, index) => (
                <div className="div-card">
                  <CardProduct
                    key={index}
                    item={item}
                    onClick={handleViewDetailProduct}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className="pagination-container"
            style={{ textAlign: "center", margin: "0 auto", marginTop: "10px" }}
          >
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
};

export default AllNewProductLaptop;
