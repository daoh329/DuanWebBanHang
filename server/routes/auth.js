const router = require("express").Router();
const passport = require("passport");
const mysql = require('../config/db/mySQL');

// LOGIN GOOGLE
router.get("/login/success", (req, res) => {
  // console.log(req.user);
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user._json,
    });
  }
  // else if(req.session.user){
  //   const user = req.session.user;
  //   res.status(200).json({
  //     error: false,
  //     message: "Successfully Loged In",
  //     user,
  //   });
  // }
  else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", (req, res, next) => {
  // if (req.session.user) {
    
  // }
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

// LOGIN PHONE NUMBER
router.post("/login-otp", (req, res, next) => {
  res.json({message: "Đang phát triển."})
  // // Lấy thông tin số điện thoại từ client
  // var phoneNumber = req.body.phoneNumber;

  // // format kiểu số điện thoại (nếu người dùng không nhập số 0 đằng trước thì thêm số 0);
  // // Loại bỏ các ký tự không phải số (nếu có)
  // phoneNumber = phoneNumber.replace(/\D/g, '');
  // // Kiểm tra xem số đầu tiên có phải là số 0 hay không
  // if (phoneNumber.charAt(0) !== '0') phoneNumber = '0' + phoneNumber;

  // // lệnh kiểm tra email người dùng đã tồn tại chưa (đã đăng nhập ít nhất 1 lần)
  // const queryCheckPhone = `SELECT * FROM users WHERE phone = ?`;

  // // lệnh thêm người dùng
  // const queryInsertPhone = `INSERT INTO users (phone) VALUES (?)`;

});

module.exports = router;
