import React from 'react';
import { Breadcrumb } from 'antd';

const ShowRoom = () => (
  <div>
    <Breadcrumb
      items={[
        {
          title: <a href="/">Trang chủ</a>,
        },
        {
          title: <a href="/showroom">showroom</a>,
        }
      ]}
    />
    {/* Nội dung khác của trang */}


    <body>
        <h1 style={{ textAlign: "center" }}>Thông tin chi tiết phòng ban</h1><br/>
        <table border="2px solid black">
            <tr bgcolor="#008B8B"><th width='5%'>STT</th></tr>
        <tbody id="myTable"></tbody>
        <script src="./js/index.js"></script>
        </table>

    </body>
  </div>
);

export default ShowRoom;
