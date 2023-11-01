const passport = require("passport");
const { query } = require("../util/callbackToPromise");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const configPassport = () => {
    passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:8080/auth/google/callback",
            scope: ["profile", "email"],
          },
          async function (accessToken, refreshToken, profile, callback) {
            // lệnh kiểm tra email người dùng đã tồn tại chưa (đã đăng nhập ít nhất 1 lần)
            const queryCheckEmail = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
      
            // lệnh thêm người dùng
            const queryInsertUser = `INSERT INTO users (name, email, permission)
                  VALUES (?, ?, ?)`;
      
            // Lấy thông tin tên và email từ profile
            const nameProfile = profile._json.name;
            const emailProfile = profile._json.email;
            const permission = "Khách";
            // Lưu thông tin người dùng vào csdl
            try {
              // Kiểm tra xem tk đã tồn tại chưa
              const results = await query(queryCheckEmail, [emailProfile]);
              // nếu chưa thì thực hiện tạo tài khoản mới
              if (results[0].count === 0) {
                await query(queryInsertUser, [nameProfile, emailProfile, permission]);
              }
            } catch (error) {
              console.log(error);
            }
            callback(null, profile);
          }
        )
      );
}

module.exports = configPassport;
