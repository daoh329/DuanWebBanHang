const router = require("express").Router();
const passport = require("passport");
const { query } = require("../util/callbackToPromise");

// LOGIN GOOGLE
router.get("/login/success", (req, res) => {
  console.log(req.session.user);
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user._json,
    });
  } else if (req.session.user) {
    const user = req.session.user;
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user,
    });
  } else {
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

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

// LOGIN PHONE NUMBER (API: /auth/login-otp)
router.post("/login-otp", async (req, res, next) => {
  // Lấy thông tin số điện thoại từ client
  var phoneNumber = req.body.phoneNumber;

  // format kiểu số điện thoại (nếu người dùng không nhập số 0 đằng trước thì thêm số 0);
  // Loại bỏ các ký tự không phải số (nếu có)
  phoneNumber = phoneNumber.replace(/\D/g, "");

  // Kiểm tra xem số đầu tiên có phải là số 0 hay không
  if (phoneNumber.charAt(0) !== "0") phoneNumber = "0" + phoneNumber;

  // lệnh kiểm tra email người dùng đã tồn tại chưa (đã đăng nhập ít nhất 1 lần)
  const queryCheckPhone = `SELECT * FROM users WHERE phone = ?`;

  // lệnh thêm người dùng
  const queryInsertPhone = `INSERT INTO users (phone) VALUES (?)`;
  try {
    const userData = await query(queryCheckPhone, phoneNumber);

    if (userData.length === 0) {
      await query(queryInsertPhone, phoneNumber);
      req.session.user = {
        phoneNumber: phoneNumber,
        name: "",
        email: "",
        picture: "",
      };
      
      res.redirect(process.env.CLIENT_URL);
    }

    req.session.user = {
      phoneNumber: phoneNumber,
      name: userData[0].name,
      email: userData[0].email,
      picture: "",
    };
    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed" });
  }
});

module.exports = router;
