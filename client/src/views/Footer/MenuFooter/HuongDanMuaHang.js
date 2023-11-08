import React, { useState, useEffect } from "react";
import "./HuongDanMuaHang.css"

function HuongDanMuaHang() {
    const arr = [20, 5 ,100, 1, 90, 200, 40, 29];
    for (let item of arr){
        setTimeout(() => console.log(item), item)
    }
    return (
        <div style={{ height: "auto", width: "800px", margin: '0 auto', marginTop: '10px' , textAlign:'left'}}>
         <h1 className="h1-hdmh">Hướng dẫn mua hàng </h1>
         <span>
         Nhằm giúp Khách hàng thuận lợi hơn trong mua sắm tại Phong Vũ,
          dưới đây là hướng dẫn những bước cơ bản để Quý Khách hàng có thể mua hàng trên Website Phong Vũ một cách dễ dàng.
         </span>
         <div style={{display:"block"}}>
            <a>
            Mua hàng qua điện thoại
            </a>
            <a>
            Mua hàng qua chat với nhân viên tư vấn (Facebook Chat, Zalo Chat được tích hợp trên Website Phong Vũ)
            </a>
            <span>
            Đơn đặt hàng Online trên Website Phong Vũ
            </span>
         </div>
        </div>
    );
}

export default HuongDanMuaHang;
