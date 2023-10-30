import React from 'react';
import { Button, Result } from 'antd';
const BuySuccess = () => (
  <Result
    status="success"
    title={<div style={{color:'#52c41a'}}>Đặt hàng thành công!</div>}
    subTitle={
        <div style={{color:'black'}}>
          DINHMINH.VN cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của DINHMINH.VN.<br />
          Đơn hàng của bạn đã được đặt thành công, DINHMINH.VN sẽ liên hệ xác nhận lại với bạn!<br />
          DINHMINH.VN xin cảm ơn!
        </div>
      }
    extra={[
      <Button type="primary" key="console" href='/'>
        Về trang chủ
      </Button>,
      <Button key="buy" href='/cart'>Mua lại</Button>
    ]}
  />
);
export default BuySuccess;