import React, { useState, useEffect } from "react";
import {
  Layout,
  Badge,
  Avatar,
  Affix,
  Button,
  Popover,
  List,
  Dropdown,
  Divider,
  Tooltip,
} from "antd";
import {
  SolutionOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TagOutlined,
  EnvironmentOutlined,
  CommentOutlined,
  PhoneOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Nav/Nav.scss";
import Hinh from "../../../src/assets/ĐINHMINH.VN.png";
// import { useCart } from "../Cart/CartContext";

const { Header } = Layout;

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [arrayNotification, setArrayNotification] = useState([
    {
      title: "Thông báo số 1",
      content:
        "Không có gì để xem đâu, chỉ là đang kiểm tra giao diện thông báo thôi...hihi",
      status: true,
    },
    {
      title: "Thông báo số 2",
      content:
        "Không có gì để xem đâu, chỉ là đang kiểm tra giao diện thông báo thôi...hihi",
      status: false,
    },
    {
      title: "Thông báo số 3",
      content:
        "Không có gì để xem đâu, chỉ là đang kiểm tra giao diện thông báo thôi...hihi",
      status: false,
    },
  ]);

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
    localStorage.removeItem("idUser");
    localStorage.removeItem("user");
  };
  // tới profile
  const profile = () => {
    navigate("/profile");
  };

  // tới profile
  const adminPage = () => {
    navigate("/admin");
  };

  const menuAccount = [
    {
      key: "1",
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
    {
      key: "2",
      label: user && user.permission === "admin" && (
        <Button
          onClick={adminPage}
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            background: "none",
          }}
        >
          Quản lí hệ thống
        </Button>
      ),
    },
    {
      key: "3",
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
          {localStorage.removeItem("user")}
          <NavLink to="/login">Đăng nhập</NavLink>
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

  const handleReadAll = () => {
    const updatedNotifications = arrayNotification.map((notification) => {
      if (notification.status === true) {
        // Thay đổi giá trị status từ true sang false
        return { ...notification, status: false };
      }
      // Giữ nguyên thông báo nếu status không phải là true
      return notification;
    });
    
    // Sau đó, bạn có thể cập nhật state với mảng thông báo mới
    setArrayNotification(updatedNotifications);
    
  };

  return (
    <Layout>
      <div className="danhmuc">
        <img
          style={{ width: "100%", height: "56px", objectFit: "cover" }}
          src="https://lh3.googleusercontent.com/_1IIdVmUpPTu90FMAIR66GKd5JxnBwUFTW526HgA1dRp3bo7pwuFJwuylI6dEDxOEiW3W72Eiuzs1LuRQ8NtBW3GSkxKSw=w1920-rw"
        ></img>
      </div>

      <div className="logoweb">
        <img style={{ objectFit: "cover" }} src={Hinh}></img>
      </div>
      <div className="menu-container">
        <div className="menu1">
          <div className="css-1e7ahm9">
            <a
              href="/sale"
              style={{
                marginRight: "20px",
                color: "#fff", // Chữ màu trắng
                textDecoration: "none",
              }}
            >
              <TagOutlined style={{ marginRight: "8px", color: "#fff" }} />{" "}
              Khuyến mãi
            </a>
            <a
              href="/showroom"
              style={{
                marginRight: "20px",
                color: "#fff", // Chữ màu trắng
                textDecoration: "none",
              }}
            >
              <EnvironmentOutlined
                style={{ marginRight: "8px", color: "#fff" }}
              />{" "}
              Hệ thống showroom
            </a>
            <a
              href="/support"
              style={{
                marginRight: "20px",
                color: "#fff", // Chữ màu trắng
                textDecoration: "none",
              }}
            >
              <CommentOutlined style={{ marginRight: "8px", color: "#fff" }} />{" "}
              Tư vẫn doanh nghiệp
            </a>
            <Dropdown menu={{ items: menuContact }} placement="bottomRight">
              <a
                href="/host"
                style={{
                  marginRight: "20px",
                  color: "#fff", // Chữ màu trắng
                  textDecoration: "none",
                }}
              >
                <PhoneOutlined style={{ marginRight: "8px", color: "#fff" }} />{" "}
                Liên hệ
              </a>
            </Dropdown>
            <a
              href="/tin-tuc"
              style={{
                marginRight: "20px",
                color: "#fff", // Chữ màu trắng
                textDecoration: "none",
              }}
            >
              <CommentOutlined style={{ marginRight: "8px", color: "#fff" }} />{" "}
              Tin tức
            </a>
          </div>
        </div>
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
                        maxWidth: "100%",
                        objectFit: "cover",
                        width: "100%",
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
                      <Avatar
                        src={user.picture}
                        style={{ cursor: "pointer" }}
                      />
                      <span
                        style={{
                          fontWeight: "bold",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                      >
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
                        cursor: "pointer",
                      }}
                    />
                  )}
                </Dropdown>

                {/* notification */}
                <Popover
                  content={
                    <div style={{ width: "350px" }}>
                      {/* title */}
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4>Thông báo</h4>
                        <Tooltip title={"Đánh dấu tất cả đã đọc"}>
                          <CheckOutlined
                            onClick={handleReadAll}
                            style={{ cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Divider style={{ margin: "0" }} />
                      {/* list */}
                      <div
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          overflowY: "auto",
                          scrollbarWidth: "none",
                        }}
                      >
                        <List
                          itemLayout="horizontal"
                          dataSource={arrayNotification}
                          renderItem={(item, index) => (
                            <List.Item
                              style={
                                item.status === true
                                  ? {
                                      backgroundColor: "#EAEAEA",
                                      borderRadius: "5px",
                                    }
                                  : {}
                              }
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                                  />
                                }
                                title={
                                  <a href="https://ant.design">{item.title}</a>
                                }
                                description={item.content}
                              />
                            </List.Item>
                          )}
                        />
                      </div>

                      {/* views all notification */}
                      <Divider style={{ margin: "0" }} />
                      <div
                        style={{
                          padding: "10px 0 0 0",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <p style={{ cursor: "pointer" }}>
                          Xem tất cả thông báo
                        </p>
                      </div>
                    </div>
                  }
                >
                  <Badge
                    className="thongbao"
                    count={arrayNotification ? arrayNotification.length : 0}
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
                        cursor: "pointer",
                      }}
                    />
                  </Badge>
                </Popover>

                {/* cart */}
                <Popover
                  content={
                    <div style={{ width: "350px" }}>
                      <div
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          overflowY: "auto",
                          scrollbarWidth: "none",
                        }}
                      >
                        <List
                          itemLayout="horizontal"
                          dataSource={cart}
                          renderItem={(selectedItems) => (
                            <List.Item
                              actions={[
                                <Button
                                  type="danger"
                                  icon={<DeleteOutlined />}
                                  onClick={() =>
                                    removeFromCart(selectedItems.id)
                                  }
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
                      </div>
                      <Divider />
               

                      <Button style={{ width: "100%", borderRadius: "3px" }}>
                        <NavLink to="/cart">
                          <p>Xem giỏ hàng</p>
                        </NavLink>

                      </Button>
                    </div>
                  }
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
                        cursor: "pointer",
                      }}
                    />
                  </Badge>
                </Popover>

                {/* tra cuu */}
                <Badge
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
                </Badge>
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
