const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");

const { query } = require("../util/callbackToPromise");
require("dotenv").config();

const configSession = (app) => {
  const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    clearExpired: true,
    checkExpirationInterval: 1000 * 60 * 60 * 2,
    expiration: 5 * 24 * 60 * 60 * 1000,
  };

  const sessionStore = new MySQLStore(options);

  app.use(
    session({
      secret: "1234",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      proxy: true,
      cookie: { maxAge: 5 * 24 * 60 * 60 * 1000 },
    })
  );

  // mã hóa thông tin người dùng và tạo phiên (save)
  passport.serializeUser(async function (user, cb) {
    cb(null, user);
  });

  // giải mã thông tin người dùng (get)
  passport.deserializeUser(async function (user, cb) {
    // Câu lệnh lấy dữ liệu người dùng
    const queryCheckEmail = `SELECT * FROM users WHERE email = ?`;
    await query(queryCheckEmail, [user._json.email])
      .then((results) => {
        user._json.name = results[0].name;
        user._json.email = results[0].email;
        user._json.phone = results[0].phone;
        user._json.id = results[0].id;
        user._json.permission = results[0].permission;
        user._json.isLocked = results[0].isLocked;
      })
      .catch((error) => {
        if (error) {
          return console.log(error);
        }
      });
    cb(null, user);
  });
};

module.exports = configSession;
