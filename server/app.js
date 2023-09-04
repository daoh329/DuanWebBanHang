const express = require('express');
const app = express();
const route = require('./routes')
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const mysql = require('./config/db/mySQL');

// Sử dụng bodyParser để phân tích cú pháp các yêu cầu đến
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// nếu gặp lỗi do bảo mật CORS thì mở ra
const cors = require('cors');app.use(cors());

// Kết nối tới cơ sở dữ liệu
mysql.connect((err) => {
  if (err) {
      console.error("Lỗi kết nối:", err);
  } else {
      console.log("Kết nối thành công đến MySQL");
  }
});

// Định nghĩa các tuyến (routes)
app.get('/', (req, res) => {
  res.send('Chào mừng đến với máy chủ Node.js!');
});

app.get('/about', (req, res) => {
  res.send('Đây là trang giới thiệu về chúng tôi.');
});

route(app);

// Khởi chạy máy chủ
app.listen(port, () => {
  console.log(`Máy chủ đang lắng nghe tại cổng ${port}`);
});

