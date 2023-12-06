import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [revenue, setRevenue] = useState([]);
  const [orderDate, setOrderDate] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/orderDate`);
        // Chuyển đổi total_quantity từ chuỗi sang số
        const formattedData = response.data.map(item => ({
          ...item,
          total_quantity: parseInt(item.total_quantity, 10) // Hoặc parseFloat nếu là số thập phân
        }));
        setOrderDate(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/dashboard`);
        // Chuyển đổi total_quantity từ chuỗi sang số
        const formattedData = response.data.map(item => ({
          ...item,
          total_quantity: parseInt(item.total_quantity, 10) // Hoặc parseFloat nếu là số thập phân
        }));
        setData(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetch();
  }, []);


  return (
    <>
      <div>
        <div style={{ backgroundColor: 'white', borderRadius: "5px" }}>
          <h4 style={{ padding: '20px 0px 0px 20px' }}>Biểu đồ số lượng từng sản phẩm đã giao trong ngày</h4>
          <div style={{ display: 'flex', justifyContent: 'center', }}>
            <BarChart width={1100} height={500} data={orderDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total_Quantity" fill="#33CCFF" barSize={40} />
            </BarChart>
          </div>

        </div>

        <div style={{ backgroundColor: 'white', borderRadius: "5px" }}>
          <h4 style={{  marginTop: '20px', padding: '20px 0px 0px 20px' }}>Biểu đồ số lượng từng sản phẩm đã giao trong tháng</h4>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BarChart width={1100} height={500} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 200]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total_Quantity" fill="#33CCFF" barSize={40} />
            </BarChart>
          </div>
        </div>

      </div>

    </>
  );
};

export default Dashboard;
