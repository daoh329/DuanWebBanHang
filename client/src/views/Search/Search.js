import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const [laptopProducts, setLaptopProducts] = useState([]);
  const [phoneProducts, setPhoneProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/product/productslaptop`)
      .then((response) => response.json())
      .then((data) => {
        setLaptopProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching laptop data:", error);
      });

    fetch(`${process.env.REACT_APP_API_URL}/product/productsPhone`)
      .then((response) => response.json())
      .then((data) => {
        setPhoneProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching phone data:", error);
      });
  }, []);

  useEffect(() => {
    if (query) {
      const filteredLaptopProducts = laptopProducts.filter((product) =>
        product.shortDescription.toLowerCase().includes(query.toLowerCase())
      );
      const filteredPhoneProducts = phoneProducts.filter((product) =>
        product.shortDescription.toLowerCase().includes(query.toLowerCase())
      );

      const combinedResults = [...filteredLaptopProducts, ...filteredPhoneProducts];

      setFilteredProducts(combinedResults);
    } else {
      setFilteredProducts([]);
    }
  }, [query, laptopProducts, phoneProducts])

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
  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);
  return (
    
    // <div
    //   style={{
    //     borderRadius: "20px",
    //     width: "1234px",
    //     margin: "0 auto",
    //     marginTop: "20px",
    //     backgroundSize: "cover",
    //     backgroundColor: "white",
    //   }}
    // >
    //   <div>
    //     <div
    //       style={{
    //         fontWeight: "bold",
    //         fontSize: "25px",
    //         display: "-webkit-box",
    //         padding: "20px",
    //         color: "black",
    //       }}
    //     >
    //       Kết quả tìm kiếm
    //     </div>
    //   </div>
    //   <div
    //     style={{
    //       display: "grid",
    //       gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    //       gap: "20px",
    //     }}
    //   >
    //     {filteredProducts &&
    //       filteredProducts.length > 0 &&
    //       filteredProducts.slice(startIndex, endIndex).map((item, index) => (
    //         <div className="sanpham-card" style={{ border: '1px solid rgb(228, 229, 240)', borderRadius: '5px', }}>
    //           <img onClick={() => handleViewDetailProduct(item)} src={process.env.REACT_APP_API_URL+item.thumbnail} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '165px', width: '165px', backgroundColor: 'pink' , margin:'0 auto'}}></img>
    //           <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
    //             <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
    //               {item.brand}
    //             </div>
    //           </div>
    //           <div style={{ width: '165px', height: 'auto', color: '#434657', display: '-webkit-box', fontSize: '12px', lineHeight: '16px', textAlign: '-webkit-left' }}>
    //             <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto' }}>
    //               {item.shortDescription}
    //             </h3>
    //           </div>

    //           <div style={{ alignItems: 'start', color: '#333333', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: '20px', width: '165px', height: '40px', }}>
    //             <div style={{ color: '#1435c3', display: '-webkit-box', fontSize: '15px', fontWeight: '700', lineHeight: '24px', width: '90px', height: '24px' }}>
    //               {item.price}₫
    //             </div>

    //           </div>
    //         </div>
    //       ))}
    //   </div>
    //   {/* Phân trang */}
    //   {/* <div style={{ textAlign: 'center', marginTop: '10px' }}>
    //                 <Pagination
    //                     current={currentPage}
    //                     total={ListUsers.length}
    //                     pageSize={itemsPerPage}
    //                     onChange={handlePageChange}
    //                 />
    //             </div> */}
    // </div>


    <div
    className="product-container"
    style={{
      width: "1234px",
      margin: "0 auto",
      marginTop: "20px",
      backgroundSize: "cover",
      backgroundColor: "#ededed",
    }}
  >
    <div className="title-group">
      <div className="products-title">Bạn đang tìm kiếm "{query}": ({filteredProducts.length} sản phẩm)</div>     
    </div>
    <div className="scroll-control-product">

      {filteredProducts &&
        filteredProducts.length > 0 &&
        filteredProducts.map((item, index) => (
          <div className="sanpham-card" key={index} onClick={() => handleViewDetailProduct(item)}>
            <img src={process.env.REACT_APP_API_URL + item.thumbnail} style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', height: '165px', width: '165px', backgroundColor: 'pink' }}></img>
            <div className="css-14q2k9dd">
              <div className="css-zb7zul">
                <div className="css-1bqeu8f">TIẾT KIỆM</div>
                <div className="css-1rdv2qd">191.000&nbsp;₫</div>
              </div>
            </div>
            <div style={{ color: '#333333', fontSize: '14px', lineHeight: '20px', margin: '0px 0px 4px', width: '165px', height: '21px' }}>
              <div style={{ width: '40px', height: '15px', color: '#82869e', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>
                {item.brand}
              </div>
            </div>
            <div className="css-nameproduct">
              <h3 style={{ color: '#434657', display: 'inline', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '16px', margin: '0px 0px 8px', width: '154px', height: 'auto' }}>
                {item.shortDescription}
              </h3>
            </div>

            <div style={{ alignItems: 'start', color: '#333333', display: 'flex', flexDirection: 'column', fontSize: '14px', lineHeight: '20px', width: '165px', height: '40px', }}>
              <div style={{ color: '#1435c3', display: '-webkit-box', fontSize: '15px', fontWeight: '700', lineHeight: '24px', width: '90px', height: '24px' }}>
                {formatCurrency(item.price)}
              </div>

            </div>
          </div>
        ))}

    </div>
    {/* Phân trang */}
    {/* <div className="pagination-container" style={{ textAlign: "center", marginTop: "10px" }}>
      <Pagination
        current={currentPage2}
        total={products.length}
        pageSize={itemsPerPage}
        onChange={handlePageChange2}
      />
    </div> */}
  </div>


  );
};

export default Search;