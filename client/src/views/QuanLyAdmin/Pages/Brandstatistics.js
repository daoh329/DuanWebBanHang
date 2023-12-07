import { Flex } from 'antd';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import "../Admin.css";

const Brandstatistics = () => {
  const [laptop, setLaptop] = useState([]);
  const [dienthoai, setDienthoai] = useState([]);

  // Hàm để sinh màu sắc ngẫu nhiên
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/order/brandstatisticslaptop`)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => ({
          name: item.brand,
          value: parseFloat(item.percentage_sold), // Chuyển đổi chuỗi thành số
          color: generateRandomColor() // Sinh màu sắc ngẫu nhiên cho mỗi nhãn hàng
        }));
        setLaptop(formattedData);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/order/brandstatisticsdienthoai`)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => ({
          name: item.brand,
          value: parseFloat(item.percentage_sold), // Chuyển đổi chuỗi thành số
          color: generateRandomColor() // Sinh màu sắc ngẫu nhiên cho mỗi nhãn hàng
        }));
        setDienthoai(formattedData);
      });
  }, []);

  
  return (
    <>
      <div style={{ display: 'flex', columnGap:'10px', width:'100%'}}>
        <div style={{width:'50%',backgroundColor:'white', borderRadius:'5px', }}>
            <h4 style={{padding:'20px 0px 0px 20px'}}>Tỉ lệ thị phần bán hàng của các nhãn hiệu laptop</h4>
          <PieChart width={400} height={400} className='PieChart'>
            <Pie
              data={laptop}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {laptop.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
  
        <div style={{width:'50%',backgroundColor:'white', borderRadius:'5px'}}>
          <h4 style={{padding:'20px 0px 0px 20px'}}>Tỉ lệ thị phần bán hàng của các nhãn hiệu điện thoại</h4>
          <PieChart width={400} height={400} className='PieChart'>
            <Pie
              data={dienthoai}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {dienthoai.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </>
  );  
};

export default Brandstatistics;
