const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const mysql = require("./config/db/mySQL");
const createTable = require("./config/CrTables");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      // Cấu trúc trong trường _json của profile
      /* _json: { 
				sub: '103355502763555668042',  
				name: 'Manh Hung Nguyen',      
				given_name: 'Manh Hung',       
				family_name: 'Nguyen',
				picture: 'https://lh3.googleusercontent.com/a/AAcHTte7A95bqQdSgLOnKD_fsbVGCYg1G9R9lOSUEEihTx7Wc6I=s96-c',
				email: 'manhhungnguyen284@gmail.com',
				email_verified: true,
				locale: 'vi'
			} */

      // Chạy hàm tạo bảng User
      createTable.createUserTable();

      // lệnh thêm người dùng
      const queryInsertUser = `INSERT INTO users (user_name, email)
			VALUES (?, ?)`;

      // lệnh kiểm tra email người dùng đã tồn tại chưa (đã đăng nhập 1 ít nhất 1 lần)
      const queryCheckEmail = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
      
      // Lấy thông tin tên và email từ profile
      const nameProfile = profile._json.name;
      const emailProfile = profile._json.email;
      
      // chạy lệnh  kiểm tra, nếu đã tồn tại thì bỏ qua, nếu chưa thì thêm vào db
      mysql.query(queryCheckEmail, [emailProfile], (error, results, fields) => {
        
        // Kiểm tra, nếu không lỗi thì tiếp tục
        if (!error) {
          
          // Kiểm tra, nếu không có hàng (rows) nào được trả về thì thêm user
          if ((results[0].count = 0)) {
            mysql.query(
              queryInsertUser,
              [nameProfile, emailProfile],
              (error, results, fields) => {
                if (error) {
                  return console.log(error);
                }
              }
            );
          }
        } else {
          console.log(error);
        }
      });
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
