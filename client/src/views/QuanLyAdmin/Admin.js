import React, { useState } from "react";
import { Col, Row, Menu } from 'antd';
import {
  AppstoreOutlined,
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
} from '@ant-design/icons';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './Admin.css'
import Dashboard from "./Pages/Dashboard";
import NewProduct from "./Pages/NewProduct";
import NewCoupon from "./Pages/NewCoupon";
import Products from "./Pages/Products";
import QuanLyAdmin from "./QuanLyAdmin";
import OrderList from "./QLdonhang";
function Admin() {
  const [currentPath, setCurrentPath] = useState('dashboard'); // Mặc định hiển thị trang Dashboard

  const onClick = (e) => {
    console.log('click ', e);
    setCurrentPath(e.key);
  };

  const menuData = [
    {
      key: 'grp',
      icon: null,
      label: 'Admin',
      type: 'group',
      children: [
        {
          key: '1',
          icon: <HomeOutlined />,
          label: 'Bảng điều khiển',
          type: 'item',
          route: 'dashboard', 
        },
        {
          key: '2',
          icon: <AppstoreAddOutlined />,
          label: 'Sản phẩm mới',
          type: 'item',
          route: 'newproduct', 
        },
        {
          key: '3',
          icon: <GiftOutlined />,
          label: 'Mã giảm giá',
          type: 'item',
          route: 'newcoupon'
        },
      ],
    },
    {
      key: 'g1',
      icon: <ProfileOutlined />,
      label: 'Mục lục',
      type: 'group',
      children: [
        {
          key: '4',
          icon: <ShoppingOutlined />,
          label: 'Tất cả sản phẩm',
          type: 'item',
          route:'products'
        },
        {
          key: '5',
          icon: <OrderedListOutlined />,
          label: 'Danh mục',
          type: 'item',
        },
        {
          key: '6',
          icon: <BookOutlined />,
          label: 'Bộ sưu tập',
          type: 'item',
        },
        {
          key: '7',
          icon: <DatabaseOutlined />,
          label: 'Thuộc tính',
          type: 'item',
        },
      ],
    },
    {
      key: 'sub4',
      icon: <DollarCircleOutlined />,
      label: 'Doanh thu',
      type: 'group',
      children: [
        {
          key: '8',
          icon: <ShoppingCartOutlined />,
          label: 'Đơn đặt hàng',
          type: 'item',
          route:'orders'
        },
      ],
    },
    {
      key: 'sub5',
      icon: <GiftOutlined />,
      label: 'Khuyến mãi',
      type: 'group',
      children: [
        {
          key: '9',
          label: 'Phiếu giảm giá',
          type: 'item',
          icon: <TagsOutlined />,
        },
      ],
    },
    {
      key: 'sub6',
      icon: <ReadOutlined />,
      label: 'CMS',
      type: 'group',
      children: [
        {
          key: '10',
          label: 'Trang',
          type: 'item',
          icon:<FileProtectOutlined />,
        },
      ],
    },
    {
      key: 'sub2',
      icon: <SettingOutlined />,
      label: 'Setting',
      type: 'group',
      children: [
        {
          key: '11',
          label: 'Option 1',
          type: 'item',
        },
        {
          key: '12',
          label: 'Option 2',
          type: 'item',
        },

      ],
    },
    {
      type: 'divider',
    },
  ];

  const menuItems = menuData.map((item) => {
    if (item.type === 'group') {
      return (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
          {item.children.map((childItem) => (
            <Menu.Item key={childItem.key} icon={childItem.icon}>
              <Link to={childItem.route}>{childItem.label}</Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      );
    } else if (item.type === 'item') {
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.route}>{item.label}</Link>
        </Menu.Item>
      );
    } else if (item.type === 'divider') {
      return <Menu.Divider key={item.key} />;
    }
    return null;
  });

  return (
    <>
      <Row>
        <Col className="custom-scrollbar" span={18} push={6} style={{overflowY: 'scroll',height: '100vh'}}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="newproduct" element={<QuanLyAdmin />} />
            <Route path="newcoupon" element={<NewCoupon/>} />
            <Route path="products" element={<Products/>} />
            <Route path="orders" element={<OrderList/>} />     
          </Routes>
        </Col>
        <Col span={6} pull={18}>
          <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={['13']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            {menuItems}
          </Menu>
        </Col>
      </Row>
    </>
  );
}

export default Admin;
