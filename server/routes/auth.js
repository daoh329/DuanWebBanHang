const router = require("express").Router();
const passport = require("passport");
const { query } = require("../util/callbackToPromise");
const passportConfig = require("../config/passport");

// API
router.get("/login/success", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user._json,
    });
  } else {
    res.status(403).json({ message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get(
  "/login/google",
  passport.authenticate("google", ["profile", "email"])
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
  }),
  function (req, res) {
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect(process.env.CLIENT_URL);
  });
});

// update profile
router.put("/update/:id", passportConfig.isAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, phone } = req.body;
    const ud_account = `UPDATE users SET name = ?, phone = ? WHERE id = ? `;
    await query(ud_account, [name, phone, id]);
    res.status(200).send("Update account success");
  } catch (error) {
    console.log(error);
    res.status(500).send("Update account failed");
  }
});

// LOGIN PHONE NUMBER (API: /auth/login-otp)
router.post("/login-otp", async (req, res, next) => {
  // Lấy thông tin số điện thoại từ client
  var phoneNumber = req.body.phoneNumber;

  // format kiểu số điện thoại (nếu người dùng không nhập số 0 đằng trước thì thêm số 0);
  // Loại bỏ các ký tự không phải số (nếu có)
  phoneNumber = phoneNumber.replace(/\D/g, "").substring(2);

  // Kiểm tra xem số đầu tiên có phải là số 0 hay không
  if (phoneNumber.charAt(0) !== "0") phoneNumber = "0" + phoneNumber;

  // lệnh kiểm tra email người dùng đã tồn tại chưa (đã đăng nhập ít nhất 1 lần)
  const queryCheckPhone = `SELECT * FROM users WHERE phone = ?`;

  // lệnh thêm người dùng
  const queryInsertPhone = `INSERT INTO users (phone) VALUES (?)`;
  try {
    const userData = await query(queryCheckPhone, [phoneNumber]);

    if (userData.length === 0) {
      await query(queryInsertPhone, [phoneNumber]);
      req.session.user = {
        phoneNumber: phoneNumber,
        name: "",
        email: "",
        picture: "",
      };
      setTimeout(() => {
        return res.status(200).json({ message: "success" });
      }, 1000);
    }

    req.session.user = {
      phoneNumber: phoneNumber,
      name: userData[0].name ? userData[0].name : "",
      email: userData[0].email ? userData[0].email : "",
      picture: "",
    };
    setTimeout(() => {
      return res.status(200).json({ message: "success" });
    }, 1000);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed" });
  }
});

// /auth/add-delivery-address
router.post(
  "/add-delivery-address",
  passportConfig.isAuthenticated,
  async (req, res) => {
    try {
      const {
        idUser,
        name,
        phone,
        email,
        city,
        district,
        commune,
        street,
        setdefault,
      } = req.body;

      const arrayValues = [
        idUser,
        name,
        phone,
        email,
        city,
        district,
        commune,
        street,
        setdefault,
      ];

      // Nếu đặt địa chỉ mới làm mặc định
      if (setdefault === 1) {
        // tìm địa chỉ mặc định hiện tại
        const sl_default_address = `select id from delivery_address where setdefault = 1`;
        const result = await query(sl_default_address);
        // Xóa mặc định của địa chỉ mặc định hiện tại (nếu có)
        if (result[0]) {
          const dl_default = `update delivery_address set setdefault = 0 where id = ?`;
          const insert_query = `INSERT INTO delivery_address (idUser, name, phone, email, city, district, commune, street, setdefault)
        VALUES (?,?,?,?,?,?,?,?,?);`;
          await query(dl_default, [result[0].id]);
          await query(insert_query, arrayValues);
          return res.status(200).send("Thành công");
        }
      }

      const insert_query = `INSERT INTO delivery_address (idUser, name, phone, email, city, district, commune, street, setdefault)
    VALUES (?,?,?,?,?,?,?,?,?);`;
      await query(insert_query, arrayValues);
      res.status(200).send("Thành công");
    } catch (error) {
      console.log(error);
      res.status(500).send("Insert delivery address failed");
    }
  }
);

// /auth/delete-delivery-address/:id
router.delete(
  "/delete-delivery-address/:id",
  passportConfig.isAuthenticated,
  async (req, res) => {
    try {
      const id = req.params.id;
      const dl_address = `DELETE FROM delivery_address WHERE id = ?`;
      await query(dl_address, [id]);
      res.status(200).send("delete success");
    } catch (error) {
      console.log(error);
      res.status(500).send("Delete failed");
    }
  }
);

// /auth/update-delivery-address/:id
router.put(
  "/update-delivery-address/:id",
  passportConfig.isAuthenticated,
  async (req, res) => {
    try {
      // get values and id
      const values = req.body;
      const id = req.params.id;
      if (values.setdefault === 1) {
        const sl_default_address = `select id from delivery_address where setdefault = 1`;
        const result = await query(sl_default_address);
        if (result[0]) {
          const dl_default = `update delivery_address set setdefault = 0 where id = ?`;
          const insert_query = `UPDATE delivery_address SET ? WHERE id = ?`;
          await query(dl_default, [result[0].id]);
          await query(insert_query, [values, id]);
          return res.status(200).send("Thành công");
        }
      }
      // create query SQL update
      const insert_query = `UPDATE delivery_address SET ? WHERE id = ?;
    `;
      // update csdl
      await query(insert_query, [values, id]);
      // response success
      res.status(200).send("Thành công");
    } catch (error) {
      // log error
      console.log(error);
      // response error
      res.status(500).send("Insert delivery address failed");
    }
  }
);

// /auth/delivery-address/:id
router.get(
  "/delivery-address/:id",
  passportConfig.isAuthenticated,
  async (req, res) => {
    try {
      const idUser = req.params.id;
      const sl_query = `SELECT * FROM delivery_address WHERE idUser = ?`;
      const result = await query(sl_query, [idUser]);

      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Get delivery address failed");
    }
  }
);

// /auth/add-notification/:id
router.post(
  "/create-notification",
  passportConfig.isAuthenticated,
  async (req, res) => {
    try {
      const { title, content, order_id, user_id, type } = req.body;
      // Kiểm tra dữ liệu tải lên
      if (!user_id) throw new Error("Thiếu id người dùng");
      if (!order_id) throw new Error("Thiếu id đơn hàng");
      if (!type) throw new Error("Thiếu loại thông báo");
      if (!title) throw new Error("Thiếu tiêu đề thông báo");
      if (!content) throw new Error("Thiếu nội dung thông báo");

      // Tìm kiếm thông báo
      const sl_notificationByOrderId = `SELECT * FROM notifications WHERE order_id = ?`;
      const resultCount = await query(sl_notificationByOrderId, [order_id]);
      // Kiểm tra thông báo của đơn hàng đã tồn tại chưa
      if (resultCount.length === 0) {
        // Nếu chưa tồn tại
        // Tạo thông báo
        const sl_notification = `SELECT * FROM notifications WHERE id = ?`;
        const q_insert_notification = `INSERT INTO notifications (user_id, order_id, title, content, type) VALUES (?,?,?,?,?)`;
        const results = await query(q_insert_notification, [
          user_id,
          order_id,
          title,
          content,
          type,
        ]);
        // Nếu không có dòng nào bị ảnh hưởng
        // Bắn lỗi ra catch
        if (results.affectedRows === 0)
          throw new Error("Tạo thông báo thất bại");
        // Nếu không bị lỗi thì tiếp tục
        // Lấy id của thông báo vừa được tạo
        const insertId = results.insertId;
        // Lấy thông báo vừa tạo
        const data = await query(sl_notification, [insertId]);
        // Trả dữ liệu vừa tạo về client
        res.status(200).json(data);
      } else {
        // Nếu đã tồn tại
        // Cập nhật thông báo
        const up_notification = `UPDATE notifications SET title = ?, content = ?, type = ?, is_read = 0 WHERE order_id = ?`;
        const sl_notification = `SELECT * FROM notifications WHERE order_id = ?`;
        const results = await query(up_notification, [
          title,
          content,
          type,
          order_id,
        ]);
        if (results.affectedRows === 1) {
          // Lấy thông báo vừa tạo
          const data = await query(sl_notification, [order_id]);
          // trả dữ liệu vừa cập nhật về client
          res.status(200).json(data);
        } else {
          throw new Error("Cập nhật thông báo thất bại");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// /auth/get-notification/:id
router.get(
  "/get-notifications/:id",
  passportConfig.isAuthenticated,
  async (req, res) => {
    try {
      const userId = req.params.id;
      const q = `SELECT * FROM notifications WHERE user_id = ? ORDER BY updated_at DESC;`;
      const notifications = await query(q, [userId]);

      res.status(200).json(notifications);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Get notification failed" });
    }
  }
);

// /auth/read-notifications
router.put(
  "/read-notifications",
  passportConfig.isAuthenticated,
  async (req, res) => {
    try {
      const arrId = req.body;
      const q = `UPDATE notifications SET is_read = 1 WHERE id = ?`;
      for (let i = 0; i < arrId.length; i++) {
        await query(q, [arrId[i]]);
      }

      res.status(200).json({ message: "Read notifications success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Read notifications failed" });
    }
  }
);

module.exports = router;
