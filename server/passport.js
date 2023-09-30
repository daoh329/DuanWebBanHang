const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { query } = require("./util/callbackToPromise");
const createTable = require("./config/CrTables");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
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

      // lệnh thêm người dùng
      const queryInsertUser = `INSERT INTO users (name, email)
			VALUES (?, ?)`;

      // lệnh kiểm tra email người dùng đã tồn tại chưa (đã đăng nhập ít nhất 1 lần)
      const queryCheckEmail = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;

      // Lấy thông tin tên và email từ profile
      const nameProfile = profile._json.name;
      const emailProfile = profile._json.email;
      try {
        const results = await query(queryCheckEmail, [emailProfile]);
        if (results[0].count === 0) {
          await query(queryInsertUser, [nameProfile, emailProfile]);
        }
      } catch (error) {
        console.log(error);
      }
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  // Câu lệnh lấy dữ liệu người dùng
  const queryCheckEmail = `SELECT * FROM users WHERE email = ?`;
  await query(queryCheckEmail, [user._json.email])
  .then((results) => {
    user._json.name = results[0].name;
    user._json.email = results[0].email;
    user._json.phone = results[0].phone;
    user._json.id = results[0].id;
  })
  .catch((error) => {
    if (error) {
      return console.log(error);
    }
  })
  done(null, user);
});
