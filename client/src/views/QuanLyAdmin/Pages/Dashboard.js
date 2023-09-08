import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,AreaChart,Area } from 'recharts';
import { Col, Divider, Row } from 'antd'
import moment from 'moment';

const data = [
  {
    date: moment().subtract(6, 'days').format('MM/DD'),
    quantity: 20,
  },
  {
    date: moment().subtract(5, 'days').format('MM/DD'),
    quantity: 25,
  },
  {
    date: moment().subtract(4, 'days').format('MM/DD'),
    quantity: 30,
  },
  {
    date: moment().subtract(3, 'days').format('MM/DD'),
    quantity: 15,
  },
  {
    date: moment().subtract(2, 'days').format('MM/DD'),
    quantity: 35,
  },
  {
    date: moment().subtract(1, 'days').format('MM/DD'),
    quantity: 40,
  },
  {
    date: moment().format('MM/DD'),
    quantity: 28,
  },
];


const data1 = [
  { name: 'Đơn đặt hàng', value: 50 },
  { name: 'Đơn hàng đã hoàn thành', value: 30 },
  { name: 'Đơn hàng bị hủy', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
function Dashboard() {
  return (
    <>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Divider orientation="left">Dashboard</Divider>
        <Row>
          <Col flex="auto">
            <ResponsiveContainer width="90%" height={400}>
              <AreaChart data={data} style={{ borderRadius: '6px', backgroundColor: 'white' }}>
                <text x="50%" y="20" textAnchor="middle" fill="#333" fontSize="16">
                  Thống kê bán hàng
                </text>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="quantity" name="Số lượng sản phẩm đã bán" fill="rgba(75, 192, 192, 0.6)" />
              </AreaChart>
            </ResponsiveContainer>
          </Col>
          <Col flex="300px">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart style={{ borderRadius: '6px', backgroundColor: 'white', }} >
                <Pie
                  data={data1}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                >
                  {data1.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>
    </>
  )
}
export default Dashboard;