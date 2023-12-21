const SocketConfig = (io) => {
  // SocketConfig(io);
  const ObjectAccountId = {};

  // Socket
  io.on("connection", (socket) => {
    console.log("A client has connected.");
    
    socket.on("login", (data) => {
      ObjectAccountId[data.userId] = {
        socketId: socket.id,
        permission: data.permission,
      };
    });

    // Nhận thông báo tình trạng đơn hàng từ admin
    socket.on("notification", (data) => {
      // Gửi thông báo tới người dùng đang đăng nhập
      const userId = data.userId;
      for (const fieldName in ObjectAccountId) {
        if (userId == fieldName) {
          const userSocketId = ObjectAccountId[fieldName].socketId;
          io.to(userSocketId).emit("reload-notification", {
            message: `Notification for user ${userId}`,
          });
        }
      }
    });

    // Nhận thông báo có đơn đặt hàng từ người dùng
    socket.on("new-order-notification", (data) => {
      for (const fieldName in ObjectAccountId) {
        if (
          ObjectAccountId[fieldName].permission === "admin" ||
          ObjectAccountId[fieldName].permission === "superadmin"
        ) {
          const userSocketId = ObjectAccountId[fieldName].socketId;
          io.to(userSocketId).emit("new-order-notification", {
            message: `New order`,
          });
        }
      }
    });

    // Xử lý sự kiện khi ngắt kết nối
    socket.on("disconnect", () => {
      console.log("A client has disconnected.");
    });
  });
};

module.exports = { SocketConfig };
