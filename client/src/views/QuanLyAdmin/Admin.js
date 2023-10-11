import React, { useState } from "react";
import { Col, Row, Menu } from "antd";
import {
  TagsOutlined,
  SettingOutlined,
  ReadOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  ShoppingOutlined,
  BookOutlined,
  DollarCircleOutlined,
  ProfileOutlined,
  DatabaseOutlined,
  FileProtectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Routes, Route, Link } from "react-router-dom";
import "./Admin.css";
import Dashboard from "./Pages/Dashboard";
import TypeProduct from "./Pages/NewProduct/Type/TypeProduct";
import TypeList from "./Pages/list/Type/TypeList";
import NewCoupon from "./Pages/NewCoupon";
import Products from "./Pages/QLSanPham/Products";
// import QuanLyAdmin from "./QuanLyAdmin";
import OrderList from "./QLdonhang";
function Admin() {
  const [currentPath, setCurrentPath] = useState("dashboard"); // Mặc định hiển thị trang Dashboard

  const onClick = (e) => {
    setCurrentPath(e.key);
  };

  const menuData = [
    {
      key: "grp",
      icon: <UserOutlined />,
      label: "Admin",
      children: [
        {
          key: "1",
          icon: <HomeOutlined />,
          label: (
            <Link to="dashboard">Bảng điều khiển</Link>
          ),
        },
        {
          key: "2",
          icon: <AppstoreAddOutlined />,
          label: (
            <Link to="newproduct">Tạo sản phẩm mới</Link>
          ),
        },
        {
          key: "3",
          icon: <GiftOutlined />,
          label: (
            <Link to="newcoupon">Tạo mã giảm giá</Link>
          ),
        },
      ],
    },
    {
      key: "g1",
      icon: <ProfileOutlined />,
      label: "Mục lục",
      children: [
        {
          key: "4",
          icon: <ShoppingOutlined />,
          label: (
            <Link to="products">Tất cả sản phẩm</Link>
          ),
        },
        {
          key: "5",
          icon: <OrderedListOutlined />,
          label: (
            <Link to="ListCate">Danh mục</Link>
          ),
        },
        {
          key: "6",
          icon: <BookOutlined />,
          label: "Bộ sưu tập",
        },
        {
          key: "7",
          icon: <DatabaseOutlined />,
          label: "Thuộc tính",
        },
      ],
    },
    {
      key: "sub4",
      icon: <DollarCircleOutlined />,
      label: "Doanh thu",
      children: [
        {
          key: "8",
          icon: <ShoppingCartOutlined />,
          label: (
            <Link to="/orders">Đơn đặt hàng</Link>
           
          ),

        },
      ],
    },
    {
      key: "sub5",
      icon: <GiftOutlined />,
      label: "Khuyến mãi",
      children: [
        {
          key: "9",
          label: "Phiếu giảm giá",
          icon: <TagsOutlined />,
        },
      ],
    },
    {
      key: "sub6",
      icon: <ReadOutlined />,
      label: "CMS",
      children: [
        {
          key: "10",
          label: "Trang",
          icon: <FileProtectOutlined />,
        },
      ],
    },
    {
      key: "sub2",
      icon: <SettingOutlined />,
      label: "Setting",
      children: [
        {
          key: "11",
          label: "Option 1",
        },
        {
          key: "12",
          label: "Option 2",
        },
      ],
    },

    {
      type: "divider",
    },
  ];

  // const menuItems = menuData.map((item) => {
  //   if (item.type === "group") {
  //     return (
  //       <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
  //         {item.children.map((childItem) => (
  //           <Menu.Item key={childItem.key} icon={childItem.icon}>
  //             <Link to={childItem.route}>{childItem.label}</Link>
  //           </Menu.Item>
  //         ))}
  //       </Menu.SubMenu>
  //     );
  //   } else if (item.type === "item") {
  //     return (
  //       <Menu.Item key={item.key} icon={item.icon}>
  //         <Link to={item.route}>{item.label}</Link>
  //       </Menu.Item>
  //     );
  //   } else if (item.type === "divider") {
  //     return <Menu.Divider key={item.key} />;
  //   }
  //   return null;
  // });


  return (
    <>
      <Row>
        <Col
          className="custom-scrollbar"
          span={18}
          push={5}
          style={{ overflowY: "scroll", height: "100vh" }}
        >
          {/* {currentPath === "1" && <Dashboard />}
          {currentPath === "2" && <TypeProduct />}
          {currentPath === "3" && <NewCoupon />}
          {currentPath === "4" && <Products />}
          {currentPath === "5" && <TypeList />} */}
          {/* {currentPath === "8" && <OrderList />} */}
          
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="newproduct" element={<TypeProduct />} />
            <Route path="newcoupon" element={<NewCoupon />} />
            <Route
              path="products"
              element={<Products style={{ marginRight: "20px" }} />}
            />
            <Route path="orders" element={<OrderList />} />
            <Route path="ListCate" element={<TypeList />} />
          </Routes>
        </Col>
        <Col span={6} pull={18}>
          <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            mode="inline"
            selectedKeys={[currentPath]}
            items={menuData}
          >
          </Menu>
        </Col>
      </Row>
    </>
  );
}

export default Admin;
