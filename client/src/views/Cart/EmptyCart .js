import React from 'react';
import { Button, Empty } from 'antd';

const EmptyCart = () => {
  return (
    <div style={{ textAlign: 'center', margin:'0 auto' }}>
      <Empty
          image="https://fptshop.com.vn/estore-images/empty-cart.png"
          imageStyle={{ height: 350 }} 
          description={
            <span style={{ color: "#A9A9A9", fontSize:'20px'}}>
              Giỏ hàng của bạn đang trống!
            </span>
          }
        >
          <Button style={{ marginTop: '16px' }} o href='/'>
            Mua sắm ngay
          </Button>
        </Empty>
    </div>
  );
};

export default EmptyCart;
