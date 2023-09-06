import React from 'react';
import { Breadcrumb } from 'antd';
import './Tintuc.css'

const Tintuc = () => (
  <div>
    <Breadcrumb
      items={[
        {
          title: <a href="/">Trang chủ</a>,
        },
        {
          title: <a href="/tin-tuc">Tin tức</a>,
        }
      ]}
    />
    {/* Nội dung khác của trang */}


    <body>
    <h1 className="title-tintuc">
  <span>
    Tin tức
  </span>
</h1>
    
    </body>
  </div>
);

export default Tintuc;
