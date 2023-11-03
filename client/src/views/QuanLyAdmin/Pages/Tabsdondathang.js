import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import { LeftOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";

import QLAlldonhang from '../QLAlldonhang';
import QLdelivered from '../QLdelivered';
import OrderList from '../QLdonhang';
import QLdeliveryfailed from '../QLdeliveryfailed';
import QLshipping from '../QLshipping';
import '../Admin.css';
import QLAlldelivered from '../QLAlldelivered';


const TabsDonDatHang = () => {
  const [size, setSize] = useState('small');
  const onChange = (e) => {
    setSize(e.target.value);
  };

  const navigate = useNavigate();

  const handleCancelOrder = () => {
    navigate(-1);
  };

  return (
    <div>

        {/* <Button
          onClick={handleCancelOrder}
          id="order-informations-title-btn"
          icon={<LeftOutlined />}
        /> */}

      <Tabs 
        defaultActiveKey="1" 
        type="card" 
        size={size}
        className="custom-tabs"
        items={[
          {
            key: "0",
            label:   <Button
            onClick={handleCancelOrder}
            id="order-informations-title-btn"
            icon={<LeftOutlined />}
          />,
            tab:   <Button
            onClick={handleCancelOrder}
            id="order-informations-title-btn"
            icon={<LeftOutlined />}
          />,
            
          },
          {
            key: "1",
            label: "Đơn đặt hàng",
            tab: "Đơn đặt hàng",
            children: <OrderList />
          },
          {
            key: "2",
            label: "Xác nhận vận chuyển",
            tab: "Xác nhận vận chuyển",
            children: <QLshipping />
          },
          {
            key: "3",
            label: "Xác nhận giao hàng",
            tab: "Xác nhận đơn hàng",
            children: <QLdelivered />
          },
          {
            key: "4",
            label: "Tất cả đơn hàng đã giao",
            tab: "Tất cả đơn hàng đã giao",
            children: <QLAlldelivered />
          },
          {
            key: "5",
            label: "Đơn hàng đã hủy hoặc giao không thành công",
            tab: "Đơn hàng đã hủy hoặc giao không thành công",
            children: <QLdeliveryfailed />
          },
          {
            key: "6",
            label: "Tất cả đơn hàng",
            tab: "Tất cả đơn hàng",
            children: <QLAlldonhang />
          }
        ]}
      />
    </div>
  );
};

export default TabsDonDatHang;
