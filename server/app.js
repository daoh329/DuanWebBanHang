require("dotenv").config();
require("./config/createTable");
const express = require("express");
const route = require("./routes");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
require("./config/db/mySQL");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const session = require("express-session");
const passportStrategy = require("./passport");
const app = express();
const fs = require('fs');

// Đường dẫn đến thư mục bạn muốn tạo
const directoryPath = path.join(__dirname, 'src/public/images');
// Kiểm tra xem thư mục đã tồn tại hay chưa
if (!fs.existsSync(directoryPath)) {
  // Nếu thư mục không tồn tại, tạo nó
  fs.mkdirSync(directoryPath, { recursive: true }, (err) => {
    if (err) {
      console.error(`Không thể tạo thư mục ${directoryPath}:`, err);
    } else {
      console.log(`Thư mục ${directoryPath} đã được tạo thành công.`);
    }
  });
}

app.use(
	session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
  })
);

app.set('view engine', 'jade');
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());
// Sử dụng bodyParser để phân tích cú pháp các yêu cầu đến
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.static(path.join(__dirname, "./src/public")));

// Định nghĩa các tuyến (routes)
app.use("/auth", authRoute);
route(app);

// Khởi chạy máy chủ
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Máy chủ đang lắng nghe tại cổng ${port}`);
});
