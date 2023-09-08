import React from 'react';
import { Breadcrumb } from 'antd';

const Support = () => (
  <div>
    <Breadcrumb
      items={[
        {
          title: <a href="/">Trang chủ</a>,
        },
        {
          title: <a href="/support">Tư vấn doanh nghiệp</a>,
        }
      ]}
    />
    {/* Nội dung khác của trang */}


    <body>
        <h1 style={{ textAlign: "center" }}>Thông tin chi tiết phòng ban</h1><br/>
    
    </body>
  </div>
);

export default Support;
