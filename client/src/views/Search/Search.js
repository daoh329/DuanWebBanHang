import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Affix, Carousel, Tabs, Card, Button, Pagination, message } from "antd";
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
    fetch(`${process.env.REACT_APP_API_URL}/product/products`)
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
      name: products.name,
      price: products.price,
      avatar: products.thumbnail,
      id: products.id,
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

    console.log('click')
    navigate(`/detail/${products.id}`);
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
          filteredProducts.slice(startIndex, endIndex).map((item, index) => (
            <div className="sanpham-card" style={{ border: '1px solid rgb(228, 229, 240)', borderRadius: '5px', }}>
              <img onClick={() => handleViewDetailProduct(item)} src={item.thumbnail} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '165px', width: '165px', backgroundColor: 'pink' }}></img>
              <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
                <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
                  {item.brand}
                </div>
              </div>
              <div style={{ width: '165px', height: 'auto', color: '#434657', display: '-webkit-box', fontSize: '12px', lineHeight: '16px', textAlign: '-webkit-left' }}>
                <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto' }}>
                  {item.name}
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