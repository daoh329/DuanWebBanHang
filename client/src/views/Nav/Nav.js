import React, { useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Badge,
  Avatar,
  Dropdown,
  Affix,
  Space,
} from "antd";
import {
  DownOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  TagOutlined,
  EnvironmentOutlined,
  CommentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import { NavLink } from "react-router-dom";
import { SmileOutlined } from "@ant-design/icons";
const { Header } = Layout;

const App = () => {
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);

  const handleMenuOpenChange = (openKeys) => {
    setMenuOpenKeys(openKeys);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to="/login">Đăng nhập</NavLink> {/* Link to login page */}
      </Menu.Item>
      <Menu.Item key="2">
        <NavLink to="/logout">Đăng xuất</NavLink> {/* Link to logout page */}
      </Menu.Item>
    </Menu>
  );
  const bell = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to="/tb">Xem tất cả thông báo</NavLink> {/* Link to login page */}
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Affix offsetTop={0}>
        <div
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f8fc",
            margintop: "0px",
          }}
        >
          <a
            style={{
              marginRight: "20px",
              color: "#333",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TagOutlined style={{ marginRight: "8px" }} /> Khuyến mãi
          </a>
          <a
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
            style={{
              marginRight: "20px",
              color: "#333",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CommentOutlined style={{ marginRight: "8px" }} /> Tư vẫn doanh
            nghiệp
          </a>
          <a
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
        </div>

        <Header
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "black",
          }}
        >
          <div
            className="logo"
            style={{ width: "80px", marginRight: "16px", color: "#ffffff" }}
          >
            {/* Add your logo here */}

            <span style={{ position: "relative" }}>
              {" "}
              <NavLink to="/">Logo</NavLink>
            </span>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            openKeys={menuOpenKeys}
            onOpenChange={handleMenuOpenChange}
            style={{ width: "120px" }}
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
          </Menu>
          <div
            className="search-container"
            style={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            <Input.Search
              placeholder="Tìm kiếm"
              style={{ width: "600px", color: "#ffffff" }}
            />
          </div>
          <div
            className="right-icons"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Badge
              count={5}
              style={{
                marginTop: "10px",
                marginRight: "10px",
                backgroundColor: "#f50",
                color: "#fff",
              }}
            >
              <Dropdown overlay={bell}>
                    <BellOutlined
                style={{ fontSize: "24px", color: "#ffffff", margin: "10px" }}
              />
              </Dropdown>
          
            </Badge>
            <Badge count={3} style={{ marginRight: "10px", marginTop: "10px" }}>
              <ShoppingCartOutlined
                style={{ fontSize: "24px", color: "#ffffff", margin: "10px" }}
              />
            </Badge>
            <Dropdown overlay={menu}>
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "#005c42", margin: "10px" }}
              />
            </Dropdown>
          </div>
        </Header>
      </Affix>
    </Layout>
  );
};

export default App;
