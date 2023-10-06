import { Header } from "antd/es/layout/layout";
import React, { useState, useEffect } from "react";
import { Breadcrumb } from 'antd';
import './Noidung.css'

function Noidung(){
    return(
<>
<Breadcrumb
      items={[
        {
          title: <a href="/">Trang chủ</a>,
        },
        {
          title: <a href="/sale">Nội dung</a>,
        }
      ]}
    />
    {/* Nội dung khác của trang */}

<body>
  <div className="div_main"></div>

</body>


</>



    );

}

export default Noidung;