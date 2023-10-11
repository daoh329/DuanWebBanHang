const router = require("express").Router();
const passport = require("passport");
const { query } = require("../util/callbackToPromise");

// LOGIN GOOGLE
router.get("/login/success", (req, res) => {
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
    res.status(403).json({ message: "Not Authorized" });
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

// API /auth/add-delivery-address
router.post("/add-delivery-address", async (req, res) => {
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
});

// API /auth/delete-delivery-address/:id
router.delete("/delete-delivery-address/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const dl_address = `DELETE FROM delivery_address WHERE id = ?`;
    await query(dl_address, [id]);
    res.status(200).send("delete success");
  } catch (error) {
    console.log(error);
    res.status(500).send("Delete failed");
  }
});

// API /auth/update-delivery-address/:id
router.put("/update-delivery-address/:id", async (req, res) => {
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
});

// API /auth/delivery-address/:id
router.get("/delivery-address/:id", async (req, res) => {
  try {
    const idUser = req.params.id;
    const sl_query = `SELECT * FROM delivery_address WHERE idUser = ?`;
    const result = await query(sl_query, [idUser]);

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Get delivery address failed");
  }
});

module.exports = router;
