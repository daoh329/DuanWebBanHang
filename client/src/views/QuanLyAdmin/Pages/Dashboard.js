import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/order/revenue`);
      
      // Chuyển đổi updated_month về chuỗi ngày tháng và Revenue thành chuỗi với dấu phân cách hàng nghìn
      const convertedData = result.data.map(item => ({
        ...item,
        updated_month: new Date(item.updated_month).toISOString().slice(0, 7),
        Revenue: Number(item.Revenue).toLocaleString('en-US')
      }));
  
      setRevenue(convertedData);
    };
  
    fetchData();
  }, []);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/order/dashboard`);
      
      // Chuyển đổi updated_date từ timestamp về chuỗi ngày tháng
      const convertedData = result.data.map(item => ({
        ...item,
        updated_date: new Date(item.updated_date * 1000).toISOString().slice(0, 19).replace('T', ' ')
      }));

      setData(convertedData);
    };

    fetchData();
  }, []);

  return (
    <>
    <h4>Biểu đồ doanh thu từng tháng</h4>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LineChart
          width={800}
          height={450}
          data={revenue}
          margin={{
            top: 50,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="updated_month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Revenue" stroke="#8884d8" activeDot={{ r: 10 }} dot={{ stroke: '#8884d8', strokeWidth: 2 }} />
        </LineChart>
      </div>
    <h4>Biểu đồ đơn đặt hàng</h4>
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
        <XAxis dataKey="updated_date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Delivered" stroke="#008000" activeDot={{ r: 10 }} dot={{ stroke: '#008000', strokeWidth: 2 }} />
      </LineChart>
      </div>
    </>
  );
};

export default Dashboard;
