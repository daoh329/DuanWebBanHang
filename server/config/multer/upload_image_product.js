const multer = require("multer");

// Sử dụng chuỗi ngẫu nhiên làm tên file

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/images");
  },
  filename: function (req, file, cb) {
    // Sử dụng timestamp làm tên file
    const timestamp = Date.now();
    // Sử dụng chuỗi ngẫu nhiên làm tên file
    const randomString = Math.random().toString(36).substring(2, 8);
    cb(null, timestamp + randomString + ".jpg");
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
