const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('./config/db/mySQL');
// Định nghĩa các tuyến (routes)
app.get('/', (req, res) => {
  res.send('Chào mừng đến với máy chủ Node.js!');
});

app.get('/about', (req, res) => {
  res.send('Đây là trang giới thiệu về chúng tôi.');
});

// Khởi chạy máy chủ
app.listen(port, () => {
  console.log(`Máy chủ đang lắng nghe tại cổng ${port}`);
});