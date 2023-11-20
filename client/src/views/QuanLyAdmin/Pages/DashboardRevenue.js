import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const DashboardRevenue = () => {
  const [revenue, setRevenue] = useState([]);
  const [revenueDate, setRevenueDate] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/order/revenueDate`);
    
      // Chuyển đổi updated_day về chuỗi ngày tháng và Revenue thành chuỗi với dấu phân cách hàng nghìn
      const convertedData = result.data
        .map(item => ({
          ...item,
          updated_day: new Date(item.updated_day),
          Revenue: Number(item.Revenue)
        }))
        .sort((a, b) => a.updated_day - b.updated_day);
    
      setRevenueDate(convertedData);
    };
    
    fetchData();
  }, []);    
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/order/revenue`);
    
      // Chuyển đổi updated_month về chuỗi ngày tháng và Revenue thành chuỗi với dấu phân cách hàng nghìn
      const convertedData = result.data
        .map(item => ({
          ...item,
          updated_month: new Date(item.updated_month).toISOString().slice(0, 7),
          Revenue: Number(item.Revenue)
        }))
        .sort((a, b) => new Date(a.updated_month) - new Date(b.updated_month));
    
      setRevenue(convertedData);
    };
    
    fetchData();
  }, []);  

  return (
    <>
    <h4>Biểu đồ doanh thu từng ngày trong tháng</h4>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LineChart
          width={800}
          height={450}
          data={revenueDate}
          margin={{
            top: 50,
            right: 20,
            left: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="updated_day" />
          <YAxis domain={[0, 1000000000]} />
          <YAxis />
          <Tooltip formatter={(value) => [value.toLocaleString('en-US'), 'Revenue']} labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} />
          <Legend />
          <Line type="monotone" dataKey="Revenue" stroke="#FF3366" activeDot={{ r: 10 }} dot={{ stroke: '#FF3366', strokeWidth: 2 }} />
        </LineChart>
      </div>

    <h4>Biểu đồ doanh thu từng tháng</h4>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LineChart
          width={800}
          height={450}
          data={revenue}
          margin={{
            top: 50,
            right: 20,
            left: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="updated_month" />
          <YAxis domain={[0, 5000000000]} />
          <Tooltip formatter={(value) => [value.toLocaleString('en-US'), 'Revenue']} labelFormatter={(value) => new Date(value).toISOString().slice(0, 7)} />
          <Legend />
          <Line type="monotone" dataKey="Revenue" stroke="#FF3366" activeDot={{ r: 10 }} dot={{ stroke: '#FF3366', strokeWidth: 2 }} />
        </LineChart>
      </div>
    </>
  );
};

export default DashboardRevenue;
