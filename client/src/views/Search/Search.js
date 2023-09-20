import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Affix, Carousel, Tabs, Card, Button, Pagination,message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from '../Cart/CartContext';
import './Search.css'
const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
    // them giỏ hàng
    const { addToCart } = useCart();
    const handleAddToCart = (product) => {
        addToCart(product);
        message.success('Sản phẩm đã được thêm vào giỏ hàng');
    };
  useEffect(() => {
    // Tải dữ liệu từ API khi component được render
    fetch("https://64df1e7171c3335b25821aef.mockapi.io/users")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (query) {
      // Lọc sản phẩm dựa trên từ khóa tìm kiếm
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );

      // Loại bỏ sự trùng lặp bằng cách sử dụng Set để đảm bảo duy nhất
      const uniqueFiltered = [...new Set(filtered)];

      setFilteredProducts(uniqueFiltered);
    } else {
      setFilteredProducts([]); // Đặt lại mảng khi không có query
    }
  }, [query, products]);

  const handleViewDetailuser = (user) => {
    // Lấy danh sách các sản phẩm đã xem từ session storage
    const historysp = JSON.parse(sessionStorage.getItem("products")) || [];
    // Tạo đối tượng sản phẩm mới
    const historyproduct = {
      name: user.name,
      price: user.Price,
      imageUrl: user.avatar,
    };
    // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
    const isViewed = historysp.some(
      (product) => product.name === historyproduct.name
    );
    // Nếu sản phẩm mới chưa được xem
    if (!isViewed) {
      // Thêm đối tượng sản phẩm mới vào cuối danh sách
      historysp.push(historyproduct);
      // Lưu trữ danh sách các sản phẩm đã xem vào session storage
      sessionStorage.setItem("products", JSON.stringify(historysp));
    }

    console.log("click oke");
    navigate(`/detail/${user.id}`);
  };
  const itemsPerPage = 10; // Số sản phẩm trên mỗi trang

  // Tính tổng số trang dựa trên số lượng sản phẩm và số sản phẩm trên mỗi trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
    <div
      style={{
        display:'block',
        borderRadius: "20px",
        width: "80%",
        margin: "0 auto",
        marginTop: "20px",
        backgroundSize: "cover",
        backgroundColor: "white",
      }}
    >
      <div className="khoi-main">

      <div className="khoi-left">
        <div className="body-left">
          <div className="sub-title-left">
            Khoảng giá
          </div>
          <div className="css-ngang">
            <div className="css-ngang-1"></div>
          </div>
          <div className="css-0">

<div className="style-sub">
  <div className="sub-title-left">Nhà sản suất chipset</div>
  <svg fill="none" viewBox="0 0 24 24" class="active css-500jnn" color="textPrimary" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5 8.5L12 15.5L19 8.5" stroke="#82869E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</div>
<div className="active-left">
<div className="row-active">
  <div style={{minWidth:'50%'}}>
<span style={{display:'flex'}}><div>AMD</div></span>
</div>

  <div style={{minWidth:'50%'}}>
  <span style={{display:'flex'}}><div>NVIDIA</div></span>
  </div>
</div>


</div>



          </div>








        </div>



      </div>


<div className="khoi-right">
      <div className="khoi-1-search">
        <div className="title-search">
          <div className="sub-title">Sắp xếp theo</div>
          <div className="sort">Khuyến mãi tốt nhất</div>
          <div className="sort">Giá giảm dần</div>
          <div className="sort">Giá tăng dần</div>
          <div className="sort">Sản phẩm mới nhất</div>
          <div className="sort">Sản phẩm bán chạy nhất</div>
         
        </div>
      </div>
      <div
        style={{
          width:'100%',
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts &&
          filteredProducts.length > 0 &&
          filteredProducts.slice(startIndex, endIndex).map((product, index) => (
            <Card key={product.id} hoverable className="card-sp">
              <img
                src={product.avatar}
                style={{ width: "170px", height: "170px", objectFit: "cover" }}
                alt={product.name}
                onClick={() => handleViewDetailuser(product)}
              />
              <div
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <a className="name-card">{product.name}</a>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ color: "rgb(20, 53, 195)", fontWeight: "bold" }}>
                    {product.Price} ₫
                  </p>
                  <Button type="primary" icon={<ShoppingCartOutlined />} style={{ marginLeft: 'auto' }} onClick={() => handleAddToCart(product)}>
                                        </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>
      </div>
      </div>
      {/* Phân trang */}
      {/* <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Pagination
                        current={currentPage}
                        total={ListUsers.length}
                        pageSize={itemsPerPage}
                        onChange={handlePageChange}
                    />
                </div> */}
    </div>
  );
};

export default Search;
