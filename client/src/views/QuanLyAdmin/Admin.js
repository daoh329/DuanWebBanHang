import React, { useState, useEffect } from "react";
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
  PieChartOutlined,
} from "@ant-design/icons";
import { Routes, Route, Link } from "react-router-dom";
import "./Admin.css";
import Dashboard from "./Pages/Dashboard";
import DashboardRevenue from "./Pages/DashboardRevenue";
import TypeProduct from "./Pages/NewProduct/Type/TypeProduct";
import TypeList from "./Pages/list/Type/TypeList";
import NewCoupon from "./Pages/NewCoupon";
import Products from "./Pages/QLSanPham/Products";
import PhieuGiamGia from "./Pages/QLPhieuGiamGia/PhieuGiamGia";
import NewDiscount from './Pages/NewDiscount';
// import QuanLyAdmin from "./QuanLyAdmin";
import OrderList from "./QLdonhang";
import QLshipping from "./QLshipping";
import QLdelivered from "./QLdelivered";
import QLAlldonhang from "./QLAlldonhang";
import QLdeliveryfailed from "./QLdeliveryfailed";
import TabsQLdonhang from "./Pages/TabsQLdonhang";

import QLAlldelivered from "./QLAlldelivered";
import AccountList from "./Pages/AccountManagement/List";
import { max } from "lodash";
import Brandstatistics from "./Pages/Brandstatistics";
function Admin() {
  const [currentPath, setCurrentPath] = useState("dashboard"); // Mặc định hiển thị trang Dashboard

  const onClick = (e) => {
    setCurrentPath(e.key);
  };

  const menuData = [
    {
      key: "grp",
      icon: <UserOutlined />,
      label: "ĐƯỜNG DẪN NHANH",
      children: [
        {
          key: "1",
          icon: <PieChartOutlined />,
          label: (
            <Link to="dashboard">Thống kê SL từng sản phẩm đã giao</Link>
          ),
        },
        {
          key: "2",
          icon:<PieChartOutlined />,
          label: <Link to="dashboardrevenue">Thống kê doanh thu</Link>,
        },
        {
          key: "20",
          icon: <PieChartOutlined />,
          label: <Link to="brandstatistics">Thống kê nhãn hàng</Link>,
        },
        {
          key: "3",
          icon: <AppstoreAddOutlined />,
          label: <Link to="newproduct">Tạo sản phẩm mới</Link>,
        },
        {
          key: "4",
          icon: <GiftOutlined />,
          label: <Link to="NewDiscount">Tạo phiếu giảm giá</Link>
        },
      ],
    },
    {
      key: "g1",
      icon: <ProfileOutlined />,
      label: "Mục lục",
      children: [
        {
          key: "5",
          icon: <ShoppingOutlined />,
          label: <Link to="products">Tất cả sản phẩm</Link>,
        },
        {
          key: "6",
          icon: <OrderedListOutlined />,
          label: <Link to="ListCate">Thuộc tính</Link>,
        },
        {
          key: "7",
          icon: <GiftOutlined />,
          label: <Link to="PhieuGiamGia">Tất cả phiếu giảm giá</Link>
        },
        // {
        //   key: "8",
        //   icon: <DatabaseOutlined />,
        //   label: "Thuộc tính",
        // },
      ],
    },
    {
      key: "sub4",
      icon: <DollarCircleOutlined />,
      label: "Trạng thái đơn hàng",
      children: [
        {
          key: "9",
          icon: <ShoppingCartOutlined />,
          label: <Link to="/dondathang">Đơn đặt hàng</Link>,
        },
        {
          key: "10",
          icon: <ShoppingCartOutlined />,
          label: <Link to="/vanchuyen">Xác nhận vận chuyển</Link>,
        },
        {
          key: "11",
          icon: <ShoppingCartOutlined />,
          label: <Link to="/xacnhangiaohang">Xác nhận đơn hàng</Link>,
        },
      ],
    },

    {
      key: "sub9",
      icon: <DollarCircleOutlined />,
      label: "Quản lý đơn hàng",
      children: [
        {
          key: "12",
          icon: <ShoppingCartOutlined />,
          label: <Link to="/quanlydonhang">Tất cả đơn hàng</Link>,
        },

        {
          key: "18",
          icon: <ShoppingCartOutlined />,
          label: <Link to="/quanlydagiao">Đơn hàng đã giao</Link>,
        },

        {
          key: "13",
          icon: <ShoppingCartOutlined />,
          label: (
            <Link to="/quanlygiaohuy">Đã hủy hoặc giao không thành công</Link>
          ),
        },
      ],
    },
    {
      key: "account_management",
      icon: <UserOutlined />,
      label: <Link to="account_list">Quản lí tài khoản</Link>,
    },
    {
      key: "sub5",
      icon: <GiftOutlined />,
      label: "Khuyến mãi",
      children: [
        {
          key: "14",
          label: "Phiếu giảm giá",
          icon: <TagsOutlined />,
        },
      ],
    },
    // {
    //   key: "sub6",
    //   icon: <ReadOutlined />,
    //   label: "CMS",
    //   children: [
    //     {
    //       key: "15",
    //       label: "Trang",
    //       icon: <FileProtectOutlined />,
    //     },
    //   ],
    // },
    // {
    //   key: "sub2",
    //   icon: <SettingOutlined />,
    //   label: "Setting",
    //   children: [
    //     {
    //       key: "16",
    //       label: "Option 1",
    //     },
    //     {
    //       key: "17",
    //       label: "Option 2",
    //     },
    //   ],
    // },

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

  useEffect(() => { }, []);

  return (
    <div
      style={{
        display: "flex",
        padding: "10px",
        height: "max-content",
        minHeight: "100vh",
        backgroundColor: "#D5D8DC"
      }}
    >
      <div className="custom-scrollbar" style={{
        position: 'fixed',
        maxHeight: '88vh',
        overflowY: 'auto'
      }}>
        <Menu
          onClick={onClick}
          mode="inline"
          selectedKeys={[currentPath]}
          items={menuData}
          style={{
            flex: "1",
            height: "max-content",
            margin: "0 20px 0 0",
            width: "290px",
            borderRadius: '5px'
          }}
        />
      </div>


      <div style={{ flex: "4", marginLeft: "300px" }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboardrevenue" element={<DashboardRevenue />} />
          <Route path="brandstatistics" element={<Brandstatistics />} />
          <Route path="newproduct" element={<TypeProduct />} />
          <Route path="newcoupon" element={<NewCoupon />} />
          <Route
            path="products"
            element={<Products style={{ marginRight: "20px" }} />}
          />
          <Route path="orders" element={<OrderList />} />
          <Route path="shippingOrder" element={<QLshipping />} />
          <Route path="deliveredOrder" element={<QLdelivered />} />
          <Route path="allOrders" element={<QLAlldonhang />} />
          <Route path="alldelivered" element={<QLAlldelivered />} />
          <Route path="deliveryfailedOrder" element={<QLdeliveryfailed />} />
          <Route path="ListCate" element={<TypeList />} />
          {/* accounts */}
          <Route path="account_list" element={<AccountList />} />
          <Route path="NewDiscount" element={<NewDiscount />} />
          <Route path="PhieuGiamGia" element={<PhieuGiamGia />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
