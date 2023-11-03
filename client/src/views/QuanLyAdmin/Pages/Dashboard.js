import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [revenue, setRevenue] = useState([]);
  const [orderDate, setOrderDate] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/order/orderDate`);
  
      // Chuyển đổi updated_date từ timestamp về chuỗi ngày tháng
      const convertedData = result.data
        .sort((a, b) => new Date(a.updated_Date) - new Date(b.updated_Date));
  
      setOrderDate(convertedData);
    };
  
    fetchData();
  }, []);  

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/order/orderDate`);
    
      // Chuyển đổi updated_date từ timestamp về chuỗi ngày tháng
      const convertedData = result.data
        .sort((a, b) => a.updated_Date - b.updated_Date)
    
      setData(convertedData);
    };
    
    fetchData();
  }, []);

  function CustomTooltip({ payload, label, active }) {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Ngày: ${label}`}</p>
          <p className="intro">{`Mã Giao Dịch: ${payload[0].payload.MaGiaoDich}`}</p>
          <p className="desc">{`Phương Thức Thanh Toán: ${payload[0].payload.paymentMenthod}`}</p>
        </div>
      );
    }
  
    return null;
  }

  return (
    <>
    <h4>Biểu đồ trạng thái đơn hàng từng ngày trong tháng</h4>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <LineChart
        width={800}
        height={450}
        data={orderDate}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="updated_Date" />
        <YAxis domain={[0, 50]} />
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="ChuaXacNhan" stroke="orange" activeDot={{ r: 10 }} dot={{ stroke: 'orange', strokeWidth: 2 }} />
        <Line type="monotone" dataKey="DaXacNhan" stroke="green" activeDot={{ r: 10 }} dot={{ stroke: 'green', strokeWidth: 2 }} />
        <Line type="monotone" dataKey="DangVanChuyen" stroke="#BDB76B" activeDot={{ r: 10 }} dot={{ stroke: '#BDB76B', strokeWidth: 2 }} />
        <Line type="monotone" dataKey="DaGiao" stroke="#33CCFF" activeDot={{ r: 10 }} dot={{ stroke: '#33CCFF', strokeWidth: 2 }} />
        <Line type="monotone" dataKey="DaHuy" stroke="#FF3399" activeDot={{ r: 10 }} dot={{ stroke: '#FF3399', strokeWidth: 2 }} />
        <Line type="monotone" dataKey="GiaoKhongThanhCong" stroke="violet" activeDot={{ r: 10 }} dot={{ stroke: 'violet', strokeWidth: 2 }} />
      </LineChart>
      </div>

    <h4>Biểu đồ đơn đã giao trong tháng</h4>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <LineChart
        width={800}
        height={450}
        data={data}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="updated_Date" />
        <YAxis domain={[0, 50]} />
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="DaGiao" stroke="#33CCFF" activeDot={{ r: 10 }} dot={{ stroke: '#33CCFF', strokeWidth: 2 }} />
        {/* <Line type="monotone" dataKey="GiaoKhongThanhCong" stroke="violet" activeDot={{ r: 10 }} dot={{ stroke: 'violet', strokeWidth: 2 }} /> */}
      </LineChart>
      </div>
    </>
  );
};

export default Dashboard;
