require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const app = express();
const fs = require("fs");
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const route = require("./routes");
require("./config/createTable");
require("./config/db/mySQL");
const authRoute = require("./routes/auth");
const configSession = require("./config/session");
const passportConfig = require("./config/passport");
const { SocketConfig } = require("./config/Socket/socket");

// Đường dẫn đến thư mục bạn muốn tạo
const directoryPath = path.join(__dirname, "src/public/images");
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
// cors
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());
// config session
configSession(app);
app.set("view engine", "jade");
// app.use(passport.authenticate('session'));
app.use(passportConfig.initialize);
app.use(passportConfig.session);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "./src/public")));

// Định nghĩa các tuyến (routes)
app.use("/auth", authRoute);
route(app);

// SocketConfig(io);
const ObjectUserId = {};

// Socket
io.on("connection", (socket) => {
  console.log("A client has connected.");

  // // Xử lý sự kiện khi nhận được thông báo từ client
  socket.on("login", (data) => {
    ObjectUserId[data.message] = socket.id;
  });

  socket.on("notification", (data) => {
    // Gửi thông báo tới người dùng đang đăng nhập
    const userId = data.message;
    for (const fieldName in ObjectUserId) {
      if (userId == fieldName) {
        const userSocketId = ObjectUserId[fieldName];
        io.to(userSocketId).emit("reload-notification", {
          message: `Notification for user ${userId}`,
        });
      }
    }
    // Gửi thông báo tới tất cả client kết nối
  });

  // Xử lý sự kiện khi ngắt kết nối
  socket.on("disconnect", () => {
    console.log("A client has disconnected.");
  });
});

// Khởi chạy máy chủ
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Máy chủ đang lắng nghe tại cổng ${port}`);
});
