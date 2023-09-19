import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/order/dashboard`);
      setData(result.data);
    };

    fetchData();
  }, []);

  return (
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
      <Line type="monotone" dataKey="unconfirm" stroke="#FFD700" activeDot={{ r: 10 }} dot={{ stroke: '#FFD700', strokeWidth: 2 }} />
      <Line type="monotone" dataKey="confirm" stroke="#008000" activeDot={{ r: 10 }} dot={{ stroke: '#008000', strokeWidth: 2 }} />
      <Line type="monotone" dataKey="cancel" stroke="#FF0000" activeDot={{ r: 10 }} dot={{ stroke: '#FF0000', strokeWidth: 2 }} />
    </LineChart>
  );
};

export default Dashboard;
