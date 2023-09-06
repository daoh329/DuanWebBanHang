require('dotenv').config();
const express = require('express');
const route = require('./routes')
const bodyParser = require('body-parser');
const mysql = require('./config/db/mySQL');

const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const ss = require("express-session");
const passportStrategy = require("./passport");
const app = express();

app.use(ss({
	secret: '1234',
	resave: false,
	saveUninitialized: false,
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoute);

// Sử dụng bodyParser để phân tích cú pháp các yêu cầu đến
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// Định nghĩa các tuyến (routes)
app.get('/', (req, res) => {
  res.send('Chào mừng đến với máy chủ Node.js!');
});

app.get('/about', (req, res) => {
  res.send('Đây là trang giới thiệu về chúng tôi.');
});


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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Máy chủ đang lắng nghe tại cổng ${port}`);
});

