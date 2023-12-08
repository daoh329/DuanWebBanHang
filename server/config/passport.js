const passport = require("passport");
const { query } = require("../util/callbackToPromise");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      // console.log(profile.id);
      // lệnh kiểm tra email người dùng đã tồn tại chưa (đã đăng nhập ít nhất 1 lần)
      const queryCheckEmail = `SELECT COUNT(*) AS count FROM users WHERE googleId = ?`;

      // lệnh thêm người dùng
      const queryInsertUser = `INSERT INTO users (name, email, permission, googleId) VALUES (?, ?, ?, ?)`;

      // Lấy thông tin tên và email từ profile
      const nameProfile = profile._json.name;
      const emailProfile = profile._json.email;
      const permission = "user";
      const googleId = profile.id;
      // Lưu thông tin người dùng vào csdl
      try {
        // Kiểm tra xem tk đã tồn tại chưa
        const results = await query(queryCheckEmail, [googleId]);
        // nếu chưa thì thực hiện tạo tài khoản mới
        if (results[0].count === 0) {
          await query(queryInsertUser, [nameProfile, emailProfile, permission, profile.id]);
        }
      } catch (error) {
        console.log(error);
      }
      callback(null, profile);
    }
  )
);

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  },
};
