import React, { useState, useEffect } from "react";
import { Table, Button, Layout, Space, Col, Row, Card, Checkbox } from "antd";
import { format } from "date-fns";
import axios from "axios";
import { useCart } from "../Cart/CartContext";
import "./Cart.css";
import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCheckbox,
} from "mdb-react-ui-kit";
const { Header, Footer, Sider, Content } = Layout;
function Cart() {
  // Lấy giỏ hàng hiện tại từ session
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const [selectedItems, setSelectedItems] = useState([]);
  const [sortedCart, setSortedCart] = useState([]); // Thêm state để lưu dữ liệu đã được sắp xếp

  // useEffect(() => {
  //   // Sắp xếp dữ liệu sản phẩm theo thời gian mới nhất đầu tiên
  //   const sortedProducts = [...cart].sort((a, b) => {
  //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   });
  //   setSortedCart(sortedProducts);
  // }, [cart]);

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, record) => <Checkbox />,
      width: 50,
    },
    {
      title: "",
      dataIndex: "thumbnail",
      key: "thumbnail",

      render: (_, record) => (
        <img
          src={record.thumbnail}
          alt="thumbnail"
          style={{ width: "200px", height: "50px" }}
        />
      ),
      width: 50,
    },
    { title: "Sản Phẩm", dataIndex: "name", key: "name" },
    { title: "Đơn giá", dataIndex: "price", key: "price" },
    { title: "Thành tiền", dataIndex: "price", key: "price" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);
  return (
    <div>
      <div className="style-2">
        <div className="fle-x">
          <div className="mo-ta">
            <div className="title-mo">Mô tả sản phâm</div>

            <div className="khoi-tiet-cha">
              
              <MDBTable borderless>
                <MDBTableHead light>
                  <tr>
                    <th scope="col">{/* <MDBCheckbox></MDBCheckbox> */}</th>
                    <th scope="col">Hình</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Thanh tiền</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  <tr>
                    <th scope="col">
                      <MDBCheckbox></MDBCheckbox>
                    </th>
                    <td >Hinh</td>
                    <td>Tên</td>
                    <td>số lượng</td>
                    <td>Thanh tiền</td>
                  </tr>
                </MDBTableBody>
              </MDBTable>
              
            </div>
          </div>

          <div className="chi-tiet">
            <div className="title-tiet">Thông tin chi tiết</div>
            {/* <div className="khoi-tiet-cha">

                      <MDBTable className="table-tiet" borderless>
                      <MDBTableBody>
                      <tr>
                          <td colSpan={1}>Thương hiệu</td>
                          <td colSpan={3}></td>
                        </tr>
                        <tr>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={1}>Bảo hành</td>
                          <td style={{backgroundColor:'#f6f6f6'}}  className="back-gr-tiet" colSpan={3}></td>
                        </tr>
                        <tr>
                          <td className="style-tin-chung" colSpan={1}>Thông tin chung</td>
                        </tr>
                        <tr>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={1}>Series laptop</td>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={3}></td>
                        </tr>
                        <tr>
                          <td colSpan={1}>Màu sắc</td>
                          <td colSpan={3}>
                        </td>
                        </tr>
                        <tr>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={1}>Nhu cầu</td>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={3}></td>
                        </tr>
                        <tr>
                          <td className="style-tin-chung" colSpan={1}>Cấu hình chi tiết</td>
                        </tr>
                        <tr>
                          <td colSpan={1}>Thế hệ CPU</td>
                          <td colSpan={3}></td>
                        </tr>
                        <tr>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={1}>CPU</td>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={3}></td>
                        </tr>
                        <tr>
                          <td colSpan={1}>Chíp đồ họa</td>
                          <td colSpan={3}></td>
                        </tr>
                        <tr>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={1}>Ram</td>
                          <td style={{backgroundColor:'#f6f6f6'}} colSpan={3}></td>
                        </tr>
                      </MDBTableBody>
                      </MDBTable>
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
{
  /* <div className="app-container">  
<Space className="responsive-container">
  <h2 style={{ textAlign: 'left' }}>Giỏ hàng</h2>
  <div className="responsive-row">
    <div className="responsive-col1">
      <Table columns={columns} dataSource={sortedCart} />
    </div>
    <div className="responsive-col2">
      <Card
        className="responsive-card"
        title="Thanh toán"
        bordered={false}
      >
        <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
          Tổng tiền tính tạm:
          <span style={{ color: 'green', fontWeight: 'bold' }}> 100000 vnd</span>
        </p>
        <Button type="primary" style={{ width: '100%', marginTop: '10px' }}>Tiếp tục</Button>
      </Card>
    </div>
  </div>
</Space>
</div> */
}
