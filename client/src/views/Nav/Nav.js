import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Input,
  Badge,
  Avatar,
  Affix,
  Button,
  Popover,
  List,
  Dropdown,
  Typography,
} from "antd";
import {
  DownOutlined,
  SmileOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  TagOutlined,
  EnvironmentOutlined,
  CommentOutlined,
  PhoneOutlined,
  DeleteOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Nav/Nav.scss";
import Hinh from "../../../src/assets/DINHMINH.VN.gif";
import { useCart } from "../Cart/CartContext";

const { Header } = Layout;

const App = (userDetails) => {
  const user = userDetails.user;

  // Hàm sử lí hiển thị name
  function formatUserName(name) {
    // Kiểm tra xem tên có khoảng trắng hay không.
    name = name.trim();
    const spaceIndex = name.indexOf(" ");
    if (spaceIndex !== -1) {
      // Có khoảng trắng
      // Lấy 2 từ đầu tiên bằng cách cắt chuỗi theo khoảng trắng.
      const firstSpace = name.indexOf(" ");
      const editName = name.substring(0, firstSpace) + " " + name.split(" ")[1];
      // Nếu name dài hơn 15 kí tự, lấy 15 kí tự đầu tiên của editName + ...
      // Nếu name ngắn hơn 15 kí tự, giữ nguyên editName
      return name.length > 15 ? editName.substring(0, 15) + "..." : editName;
    } else {
      // Không có khoảng trắng
      // Nếu name dài hơn 15 kí tự, lấy 15 ký tự đầu tiên + ...
      // Nếu name ngắn hơn 15 kí tự, giữ nguyên name
      return name.length > 15 ? name.substring(0, 15) + "..." : name;
    }
  }

  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(sessionStorage.getItem("cart")) || []
  );

  const handleMenuOpenChange = (openKeys) => {
    setMenuOpenKeys(openKeys);
  };
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // const [cartList, setCartList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart); // Cập nhật state giỏ hàng
  };
  // phone
  const [phone, setPhone] = useState("");
  const handleConfirm = async () => {
    // Lưu giá trị phone vào session
    window.sessionStorage.setItem("phone", phone);
    navigate(`/orderHistory/${phone}`);
  };
  //------giỏ hàng---------------

  async function getData() {
    await fetch(`${process.env.REACT_APP_API_URL}/product/productslaptop`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    // Tải dữ liệu từ API khi component được render
    getData();
    
  }, []);

  useEffect(() => {
    // Lọc sản phẩm dựa trên từ khóa tìm kiếm
    const filtered = products.filter((product) =>
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Xử lý tìm kiếm khi người dùng nhấn nút "Tìm"
  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery.toLowerCase())}`);
  };

  // call API logout
  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };
  // tới profile
  const profile = () => {
    navigate("/profile");
  };
  //
  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Chăm sóc khách hàng: 18006569
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          Tư vấn khách hàng: 18006569
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
  ];

  const menuAccount = [
    {
      key: "1",
      label: user ? (
        <Button
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            background: "none",
          }}
          onClick={logout}
        >
          Đăng xuất
        </Button>
      ) : (
        <Button
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            background: "none",
          }}
        >
          <NavLink to="/login">Đăng nhập</NavLink>
        </Button>
      ),
    },
    {
      key: "2",
      label: user && (
        <Button
          onClick={profile}
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            background: "none",
          }}
        >
          Tài khoản
        </Button>
      ),
    },
  ];

  const menuContact = [
    {
      key: "1",
      label: <Button>Chăm sóc khách hàng: 18006569</Button>,
    },
    {
      key: "2",
      label: <Button>Tư vấn khách hàng: 18006569</Button>,
    },
  ];

  return (
    <Layout>
      <div className="danhmuc">
        <a
          href="/sale"
          style={{
            marginRight: "20px",
            color: "#333",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TagOutlined style={{ marginRight: "8px" }} />
          Khuyến mãi
        </a>
        <a
          href="/showroom"
          style={{
            marginRight: "20px",
            color: "#333",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <EnvironmentOutlined style={{ marginRight: "8px" }} /> Hệ thống
          showroom
        </a>
        <a
          href="/support"
          style={{
            marginRight: "20px",
            color: "#333",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CommentOutlined style={{ marginRight: "8px" }} /> Tư vẫn doanh nghiệp
        </a>

        <Dropdown menu={{ items: menuContact }} placement="bottomRight">
          <a
            href="/host"
            style={{
              marginRight: "20px",
              color: "#333",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PhoneOutlined style={{ marginRight: "8px" }} /> Liên hệ
          </a>
        </Dropdown>
        <a
          href="/tin-tuc"
          style={{
            marginRight: "20px",
            color: "#333",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CommentOutlined style={{ marginRight: "8px" }} /> Tin tức
        </a>
      </div>

      <Affix offsetTop={0}>
        <div>
          {/* <div className="hd-logo">
            <div className="logo-mobile">
              <span className="logo-span">
                {" "}
                <NavLink to="/">
                  <img src={Hinh} style={{ width: "100%" }} alt="Logo"></img>
                </NavLink>
              </span>
            </div>
            <div className="user-mobile">
              <Dropdown menu={menu}>
                {user ? (
                  <Avatar src={user.picture} />
                ) : (
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#ae69dd" }}
                  />
                )}
              </Dropdown>
            </div>
          </div> */}

          <Header
            className="header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#ffffff",
            }}
          >
            <div className="navgation">
              <div
                className="logo"
                style={{
                  width: "200px",
                  marginRight: "16px",
                  color: "#ffffff",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    display: "block",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <NavLink to="/">
                    <img
                      src={Hinh}
                      style={{
                        maxWidth: "100%", // Giới hạn chiều rộng tối đa của ảnh
                        height: "50px", // Tự động tính tỷ lệ chiều cao dựa trên tỷ lệ chiều rộng
                        objectFit: "cover", // Cắt và thay đổi tỷ lệ hình ảnh để vừa với phần tử cha
                        width: "100%", // Đảm bảo ảnh chiếm toàn bộ chiều rộng của phần tử cha
                      }}
                      alt="Logo"
                    />
                  </NavLink>
                </span>
              </div>

              {/* <div
            className="search-container"
            style={{
              flex: "auto",
              display: "flex",
              justifyContent: "center",
              maxWidth: "60%",
            }}
          >
            <Input.Search
              placeholder="Tìm kiếm"
              className="custom-input-search"
              onSearch={handleSearch}
            />
          </div> */}

              {/* <div className="hamburger-menu">
            <input id="menu__toggle" type="checkbox" />
            <label className="menu__btn" htmlFor="menu__toggle">
              <span />
              <span />
              <span />
            </label>
            <ul className="menu__box">
              <li>
                <a className="menu__item" href="/">
                  Trang chủ
                </a>
              </li>
              <li>
                <a className="menu__item" href="#">
                  about
                </a>
              </li>
              <li>
                <a className="menu__item" href="#">
                  team
                </a>
              </li>
              <li>
                <a className="menu__item" href="#">
                  contact
                </a>
              </li>
              <li>
                <a className="menu__item" href="#">
                  twitter
                </a>
              </li>
            </ul>
          </div> */}

              {/* <div className="timkiem">
            <Input
              placeholder="Tìm kiếm"
              className="custom-timkiem"
              value={searchQuery}
              onChange={handleInputChange}
              onPressEnter={handleSearch}
              suffix={
                <Button
                  type="pr"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                />
              }
            />
          </div>
          <div className="group">
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="m21.53 20.47l-3.66-3.66c19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zm3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
              </g>
            </svg>
            <input placeholder="search" type="search" className="input" />
          </div> */}

              {/* <div className="search-container">
              <Input.Search
                placeholder="Tìm kiếm"
                className="custom-input-search"
                value={searchQuery}
                onChange={handleInputChange}
                onSearch={handleSearch}
              />

            </div> */}
              <div
                style={{ padding: "8px", minWidth: 0, flex: "1 1 auto" }}
                className="teko-col css-388q1u"
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
                      />
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

              <div
                className="right-icons"
                style={{ display: "flex", alignItems: "center", gap: "1px" }}
              >
                <Dropdown menu={{ items: menuAccount }} className="avt-user">
                  {user ? (
                    <div
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Avatar src={user.picture} />
                      <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                        {formatUserName(user.name)}
                      </span>
                    </div>
                  ) : (
                    <Avatar
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: "#ae69dd",
                        margin: "10px",
                        fontSize: "24px",
                      }}
                    />
                  )}
                </Dropdown>
                <Badge
                  className="thongbao"
                  count={5}
                  style={{
                    marginTop: "10px",
                    marginRight: "10px",
                    backgroundColor: "#f50",
                    color: "#fff",
                  }}
                >
                  <BellOutlined
                    style={{
                      fontSize: "30px",
                      color: "#ae69dd",
                      margin: "10px",
                    }}
                  />
                </Badge>
                <Popover
                  content={
                    <div
                      style={{
                        width: "300px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                      }}
                    >
                      <Button
                        type="primary"
                        style={{ width: "100%", marginTop: "10px" }}
                      >
                        <NavLink to="/cart">Xem giỏ hàng</NavLink>
                      </Button>
                      <List
                        itemLayout="horizontal"
                        dataSource={cart}
                        renderItem={(selectedItems) => (
                          <List.Item
                            actions={[
                              <Button
                                type="danger"
                                icon={<DeleteOutlined />}
                                onClick={() => removeFromCart(selectedItems.id)}
                              ></Button>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={
                                    process.env.REACT_APP_API_URL +
                                    selectedItems.thumbnail
                                  }
                                />
                              }
                              title={
                                selectedItems.shortDescription.length > 20
                                  ? selectedItems.shortDescription.substring(
                                      0,
                                      20
                                    ) + "..."
                                  : selectedItems.shortDescription
                              }
                              description={
                                <>
                                  <div>Giá: {selectedItems.price} ₫</div>
                                  <div>
                                    Số lượng: {selectedItems.quantity}
                                  </div>{" "}
                                  {/* Hiển thị số lượng */}
                                </>
                              }
                            />
                          </List.Item>
                        )}
                      />
                      <Button
                        type="primary"
                        style={{ width: "100%", marginTop: "10px" }}
                      >
                        <NavLink to="/cart">Xem giỏ hàng</NavLink>
                      </Button>
                    </div>
                  }
                  title="Giỏ hàng"
                  trigger="hover"
                >
                  <Badge
                    count={cart.length}
                    style={{ marginRight: "10px", marginTop: "10px" }}
                  >
                    <ShoppingCartOutlined
                      style={{
                        fontSize: "30px",
                        color: "#ae69dd",
                        margin: "10px",
                      }}
                    />
                  </Badge>
                </Popover>
                {/* <Badge
                  className="tracuu"
                  style={{
                    marginTop: "10px",
                    marginRight: "10px",
                    backgroundColor: "#f50",
                    color: "#fff",
                  }}
                >
                  <NavLink to="/checkSP">
                    <SolutionOutlined
                      style={{
                        fontSize: "24px",
                        color: "#ae69dd",
                        margin: "10px",
                      }}
                    />
                  </NavLink>
                </Badge> */}
              </div>

              {/* <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        openKeys={menuOpenKeys}
                        onOpenChange={handleMenuOpenChange}
                        style={{ width: '120px', }}
                    >
                        <Menu.SubMenu
                            key="sub1"
                            icon={<DownOutlined />}
                            title={<span>Danh mục</span>}
                            popupClassName="white-menu"
                            style={{ background: "black" }}
                        >
                            <Menu.Item key="1">Danh mục 1</Menu.Item>
                            <Menu.Item key="2">Danh mục 2</Menu.Item>
                            <Menu.Item key="3">Danh mục 3</Menu.Item>
                            <Menu.Item key="4">Danh mục 4</Menu.Item>
                        </Menu.SubMenu>
                    </Menu> */}
            </div>
          </Header>
        </div>
      </Affix>
    </Layout>
  );
};

export default App;