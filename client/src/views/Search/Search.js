import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Affix, Carousel, Tabs, Card, Button, Pagination,message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from '../Cart/CartContext';
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
        borderRadius: "20px",
        width: "80%",
        margin: "0 auto",
        marginTop: "20px",
        backgroundSize: "cover",
        backgroundColor: "white",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "25px",
            display: "-webkit-box",
            padding: "20px",
            color: "black",
          }}
        >
          Kết quả tìm kiếm
        </div>
      </div>
      <div
        style={{
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
