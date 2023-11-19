const mysql = require("../../config/db/mySQL");
const { query } = require("../../util/callbackToPromise");
const path = require("path");
const fs = require("fs");
class Product {
  async Addproduct(req, res) {
    try {
      const data = req.body;
      const arrImage = req.files;
      const main_image = [...arrImage].find(
        (file) => file.fieldname === "main_image"
      );

      var variations = data.variations;
      // console.log(variations);
      for (let i = 0; i < variations.length; i++) {
        variations[i].images = [];
        const p = `variations[${i}]`;
        const files = [];
        [...arrImage].forEach((file) => {
          if (file.fieldname.includes(p)) {
            const imagePath = `/images/${path.basename(file.path)}`;
            files.push(imagePath);
          }
        });
        variations[i].images = files;
      }

      var colorAndImagesFromClient = [];
      [...variations].forEach((variation) => {
        const colorAndImage = {
          color: variation.color,
          images: variation.images,
        };
        colorAndImagesFromClient.push(colorAndImage);
      });

      // Sử dụng Set để lấy ra các màu duy nhất
      const uniqueColors = [
        ...new Set(colorAndImagesFromClient.map((item) => item.color)),
      ];

      // Tạo một đối tượng để lưu trữ các màu và ảnh tương ứng
      const colorAndImagesToDB = [];

      // Lặp qua mảng để gán ảnh cho từng màu
      uniqueColors.forEach((color) => {
        const images = colorAndImagesFromClient.find(
          (item) => item.color === color
        ).images;
        colorAndImagesToDB.push({ color, images });
      });

      // res.status(200).send("success");
      // return;
      var mainImagePath = "";
      // multer không nhận được ảnh sẽ trả về undefind
      if (main_image) {
        mainImagePath = `/images/${path.basename(main_image.path)}`;
      }

      const configurationString = JSON.stringify(data.configuration);

      const is_product = `INSERT INTO products (name, main_image, shortDescription, CategoryID, status) VALUES (?, ?, ?, ?, ?)`;
      const is_productdetail =
        "INSERT INTO productdetails(`quantity`,`brand`,`configuration`,`description`,`product_id`,`remaining_quantity`)VALUES(?,?,?,?,?,?);";

      // product
      const productValues = [
        data.name,
        mainImagePath,
        data.shortDescription,
        data.category,
        data.status ? 1 : 0,
      ];
      const resultP = await query(is_product, productValues);
      const id_product = resultP.insertId;

      // product details
      const PdValues = [
        data.quantity,
        data.brand,
        configurationString,
        data.description,
        id_product,
        data.quantity,
      ];
      await query(is_productdetail, PdValues);

      // product_variations & product_images
      const is_product_variations = `
      INSERT INTO product_variations(color, capacity, product_id, price, discount_amount) VALUES (?,?,?,?,?);
    `;
      // insert to product_variations
      [...variations].forEach(async (variation) => {
        const variationsValues = [
          variation.color,
          variation.capacity,
          id_product,
          variation.price,
          variation.discount_amount ? variation.discount_amount : 0,
        ];
        await query(is_product_variations, variationsValues);
      });

      // insert to product_images
      const is_product_images = `
      INSERT INTO product_images( product_id, color, path) VALUES (?,?,?);
      `;
      [...colorAndImagesToDB].forEach(async (colorAndImage) => {
        const imagesValues = [
          id_product,
          colorAndImage.color,
          JSON.stringify(colorAndImage.images),
        ];
        await query(is_product_images, imagesValues);
      });

      res.status(200).send("success");
    } catch (error) {
      console.log(error);
      res.status(500).send("failed");
    }
  }

  async json(req, res) {
    // API: /product/json
    const queryProduct = `
    SELECT 
    p.id,
    p.name,
    p.status,
    p.shortDescription,
    pd.brand,
    pd.quantity,
    pd.remaining_quantity,
    pd.created_at,
    pd.configuration,
    pd.description,
    category.name as category,
    (
      SELECT json_arrayagg(
      JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount 
        )
		) 
      FROM product_variations AS pv
      WHERE p.id = pv.product_id
    ) AS variations,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'color', pi.color,
          'path', pi.path
        )
      )
      FROM product_images AS pi
      WHERE p.id = pi.product_id
    ) AS images
    FROM products as p
    JOIN productDetails as pd ON p.id = pd.product_id
    JOIN category ON p.CategoryID = category.id
    GROUP BY p.id, p.name, p.status,
    pd.brand, pd.quantity, pd.remaining_quantity, 
    p.shortDescription, pd.created_at, pd.configuration, pd.description, category.name;
    `;

    // Hàm sử lí lỗi tập chung
    const handleError = (e, res, message) => {
      console.log(e);
      return res.status(500).json(message);
    };

    try {
      const results = await query(queryProduct);
      results.forEach((element) => {
        element.configuration = JSON.parse(element.configuration);
        [...element.images].forEach((image) => {
          image.path = JSON.parse(image.path);
        });
      });
      res.status(200).send(results);
    } catch (error) {
      handleError(error, res, { message: "Get product details failed!!!" });
    }
  }

  // API: /product/delete/:id
  async Delete(req, res) {
    // query get path image
    const sl_product_images = `
      SELECT path AS imagePath
      FROM product_images
      WHERE product_id = ?;
    `;
    const dl_productDetails = `
      DELETE FROM productdetails
      WHERE product_id = ?;
    `;

    const dl_product_images = `
    DELETE FROM product_images WHERE product_id = ?;
    `;

    const dl_product_variations = `
      DELETE FROM product_variations WHERE product_id = ?;
    `;

    const dl_product = `
      DELETE FROM products WHERE id = ?;
    `;

    try {
      // Lấy id từ client request lên
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Not Id" });
      }

      // select imagePath galery
      var arrayImagePath = await query(sl_product_images, [id]);
      arrayImagePath = JSON.parse(arrayImagePath[0].imagePath);
      // check nếu có ảnh thì mới xóa trong server và sql
      if (arrayImagePath.length != 0) {
        await arrayImagePath.forEach(async (imagePath) => {
          // Đường dẫn tới thư mục public chứa hình ảnh
          const publicImagePath = path.join(
            __dirname,
            "../../src",
            "public",
            imagePath
          );
          // Thực hiện xóa image trong server
          // Kiểm tra file có trong thư mục không
          fs.access(publicImagePath, fs.constants.F_OK, (err) => {
            if (!err) {
              // Nế có thì thực hiện xóa
              fs.unlink(publicImagePath, (err) => {
                if (err) {
                  console.error("Lỗi khi xóa hình ảnh:", err);
                  return res
                    .status(500)
                    .json({ message: "Delete image failed." });
                }
              });
            }
          });
        });

        // nếu xóa image trên server thành công thì xóa trên sql
        await query(dl_product_images, [id]).catch((error) => {
          return res
            .status(500)
            .json({ message: "Xóa ảnh trên csdl thất bại." });
        });
      }

      await Promise.all([
        query(dl_product_variations, [id]),
        query(dl_productDetails, [id]),
        query(dl_product, [id]),
      ]);

      return res.json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "failed" });
    }
  }

  // Cập nhật sản phẩm
  async Update(req, res) {
    // API: /product/update/:id
    const id = req.params.id;
    const dataUpdate = req.body;
    const arrImage = req.files?.images;
    const main_image = req.files?.main_image;
    const arrCapacity = dataUpdate.capacity;

    var mainImagePath = "";
    var arrPathImage = [];

    // create main image path
    if (main_image) {
      mainImagePath = `/images/${path.basename(main_image[0].path)}`;
    }
    // create images path
    if (arrImage) {
      arrImage.forEach((image) => {
        const pathImage = `/images/${path.basename(image.path)}`;
        arrPathImage.push(pathImage);
      });
    }

    // Tạo tên của các field (Xác định các field muốn cập nhật)
    const fieldsProduct = [
      "name",
      "price",
      "main_image",
      "discount",
      "shortDescription",
    ];

    const fieldsProductDetails = [
      "quantity",
      "remaining_quantity",
      "brand",
      "configuration",
      "description",
    ];
    const fieldsColor = ["color"];
    // Tạo các đối tượng (object) chứa các field
    // và giá trị tương ứng cho từng bảng
    var dataGroupTableProduct = {};
    var dataGroupTableProductDetails = {};
    var dataGroupTableProDetailColor = {};
    // Thêm ảnh chính vào object product
    if (mainImagePath) {
      dataGroupTableProduct["main_image"] = mainImagePath;
    }
    try {
      // lặp qua các field trong req.body (trừ images)
      // và gán giá trị cùng field tương ứng vào object
      for (const fieldName in dataUpdate) {
        // product
        if (fieldsProduct.includes(fieldName)) {
          dataGroupTableProduct[fieldName] = dataUpdate[fieldName];
        }
        // details
        if (fieldsProductDetails.includes(fieldName)) {
          if (fieldName === "configuration") {
            dataGroupTableProductDetails[fieldName] = JSON.stringify(
              dataUpdate[fieldName]
            );
          } else {
            dataGroupTableProductDetails[fieldName] = dataUpdate[fieldName];
          }
        }
        // color details
        if (fieldsColor.includes(fieldName)) {
          dataGroupTableProDetailColor[fieldName] = dataUpdate[fieldName];
        }
      }

      // Cập nhật vào csdl nếu có dữ liệu thay đổi (dataGroupTableProduct không rỗng)
      // 1. update product
      if (Object.values(dataGroupTableProduct).length != 0) {
        const queryUpdateProduct = `UPDATE product SET ? WHERE id = ?`;
        await query(queryUpdateProduct, [dataGroupTableProduct, id]);
      }
      // 2. update product details
      if (Object.values(dataGroupTableProductDetails).length != 0) {
        const queryUpdateProductDetails = `UPDATE productdetails SET ? WHERE product_id = ?`;
        await query(queryUpdateProductDetails, [
          dataGroupTableProductDetails,
          id,
        ]);
      }
      // 3. update color details
      if (Object.values(dataGroupTableProDetailColor).length != 0) {
        const dl_prodetailcolor = `
        DELETE FROM prodetailcolor
        WHERE product_id = ?;
        `;
        await query(dl_prodetailcolor, [id]);
        const queryUpdateProDetailsColor = `INSERT INTO prodetailcolor (Colorname, product_id) VALUES (?,?)`;
        dataGroupTableProDetailColor.color.forEach(async (color) => {
          await query(queryUpdateProDetailsColor, [color, id]);
        });
      }
      // 4. Update capacity
      if (arrCapacity?.length !== 0 && arrCapacity) {
        // Xóa các id đã có
        const dl_capacity_list = `
        DELETE FROM capacity_list
        WHERE product_id = ?;
        `;
        await query(dl_capacity_list, [id]);

        for (let i = 0; i < arrCapacity?.length; i++) {
          // Nếu có id, Thêm trên id cũ
          if (arrCapacity[i].id) {
            const is_capacity_list =
              "INSERT INTO capacity_list (`id`,`product_id`,`capacity`, `capacity_price`) VALUES (?,?,?,?);";
            await query(is_capacity_list, [
              arrCapacity[i].id,
              id,
              arrCapacity[i].capacity,
              arrCapacity[i].capacity_price,
            ]);
          } else {
            // Nếu id chưa tồn tại, thêm dữ liệu mới
            const is_capacity_list =
              "INSERT INTO capacity_list (`product_id`,`capacity`, `capacity_price`) VALUES (?,?,?);";
            await query(is_capacity_list, [
              id,
              arrCapacity[i].capacity,
              arrCapacity[i].capacity_price,
            ]);
          }
        }
      }
      // return res.status(200).json({ message: "success" });

      // ===== Vì images không lấy trong req.body nên sẽ sử lí riêng =====
      // Nếu mảng images path không rỗng -> Thực hiện cập nhật

      if (arrPathImage.length != 0) {
        // Xóa các image trước đó
        const sl_galery = `
        SELECT galery.thumbnail AS imagePath
        FROM galery
        WHERE product_id = ?;
      `;
        const dl_galery = `
        DELETE FROM galery
        WHERE product_id = ?;
        `;

        // select imagePath galery
        const arrayImagePath = await query(sl_galery, [id]);

        // check nếu có ảnh thì mới xóa trong server và sql
        // Thêm sau khi xóa
        if (arrayImagePath.length != 0) {
          await arrayImagePath.forEach(async (imagePath) => {
            // Đường dẫn tới thư mục public chứa hình ảnh
            const publicImagePath = path.join(
              __dirname,
              "../../src",
              "public",
              imagePath.imagePath
            );
            // Thực hiện xóa image trong server
            // Kiểm tra file có trong thư mục không
            fs.access(publicImagePath, fs.constants.F_OK, (err) => {
              if (!err) {
                // Nế có thì thực hiện xóa
                fs.unlink(publicImagePath, (err) => {
                  if (err) {
                    console.error("Lỗi khi xóa hình ảnh:", err);
                    return res
                      .status(500)
                      .json({ message: "Delete image failed." });
                  }
                });
              }
            });
          });
          // Nếu xóa image trên server thành công thì xóa trên sql
          await query(dl_galery, [id]);
          // Thêm ảnh mới của sản phẩm
          const queryUpdateGalery = `INSERT INTO galery (thumbnail, product_id) VALUES (?,?)`;
          arrPathImage.forEach(async (image) => {
            await query(queryUpdateGalery, [image, id]);
          });
          return res.status(200).json({ message: "success" });
        }
        // Nếu sản phẩm chưa có ảnh nào
        // Thêm ảnh mới của sản phẩm
        const queryUpdateGalery = `INSERT INTO galery (thumbnail, product_id) VALUES (?,?)`;
        arrPathImage.forEach(async (image) => {
          await query(queryUpdateGalery, [image, id]);
        });
      }
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "failed" });
    }
  }

  async DetailProducts(req, res) {
    const { id } = req.params;
    // Truy vấn để lấy thông tin chi tiết sản phẩm
    const productQuery = `
    SELECT
    p.*,
    pd.quantity, 
    pd.remaining_quantity, 
    pd.brand, 
    pd.configuration,
    pd.description,
    pd.created_at,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'color', pv.color,
        'capacity', pv.capacity,
        'price', pv.price,
        'discount_amount', pv.discount_amount 
      )
    ) AS variations,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'color', pi.color,
          'path', pi.path
        )
      )
      FROM product_images AS pi
      WHERE p.id = pi.product_id
    ) AS images
    FROM products AS p
    JOIN productDetails AS pd ON p.id = pd.product_id
    LEFT JOIN product_variations AS pv ON p.id = pv.product_id
    WHERE p.id = ?
    GROUP BY
    p.id, p.name, p.shortDescription, p.CategoryID, p.main_image, p.status,
    pd.quantity, pd.remaining_quantity, pd.brand, pd.configuration, pd.description, pd.created_at;
    `;

    try {
      const results = await query(productQuery, [id]);
      results.forEach((element) => {
        element.configuration = JSON.parse(element.configuration);
        [...element.images].forEach((image) => {
          image.path = JSON.parse(image.path);
        });
      });
      res.json(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Get product details failed" });
    }
  }

  async GetProductCart(req, res) {
    // /product/cart
    const data = req.body;
    const sl_product = `
    SELECT 
      p.id, p.name, p.status, p.shortDescription, p.main_image,
      productDetails.brand,
      productDetails.quantity,
      (
        SELECT JSON_OBJECT(
          'color', pv.color,
            'capacity', pv.capacity,
            'price', pv.price,
            'discount_amount', pv.discount_amount 
          )
        FROM product_variations AS pv
        WHERE p.id = pv.product_id AND pv.color = ? AND pv.capacity = ?
      ) AS variations,
      (
        SELECT pi.path
        FROM product_images AS pi
        WHERE p.id = pi.product_id AND pi.color = ?
      ) AS images
        FROM products as p
        JOIN productDetails ON p.id = productDetails.product_id
        JOIN category ON p.CategoryID = category.id
        LEFT JOIN prodetailcolor ON p.id = prodetailcolor.product_id
        WHERE p.id = ?
        GROUP BY p.id, p.name, p.status, p.shortDescription, p.main_image,
      productDetails.quantity, productDetails.created_at,  productDetails.brand,
      category.name;
    `;
    try {
      const cartProducts = [];
      for (let i = 0; i < data.length; i++) {
        const results = await query(sl_product, [
          data[i].color,
          data[i].capacity,
          data[i].color,
          data[i].product_id,
        ]);
        results.forEach((result) => {
          result.images = JSON.parse(result.images);
        });
        cartProducts.push(results[0]);
      }
      res.status(200).json(cartProducts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Get product failed" });
    }
  }

  async Newphone(req, res) {
    const query = `
    SELECT
    p.*,
    pd.quantity, 
    pd.remaining_quantity, 
    pd.brand,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount 
        )
		  )
      FROM product_variations AS pv
      WHERE p.id = pv.product_id
	  ) AS variations,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'color', pi.color,
        'path', pi.path
      )
    ) AS images
    FROM products as p
    JOIN productDetails AS pd ON p.id = pd.product_id
    LEFT JOIN product_images AS pi ON p.id = pi.product_id
    WHERE p.CategoryID = 2 AND p.status = 1 AND pd.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
    GROUP BY p.id, p.name, p.shortDescription, p.CategoryID, p.main_image, p.status,
      pd.quantity, pd.remaining_quantity, pd.brand
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }
      results.forEach((element) => {
        [...element.images].forEach((image) => {
          image.path = JSON.parse(image.path);
        });
      });
      res.json(results);
    });
  }

  async Newlaptop(req, res) {
    const query = `
    SELECT
    p.*,
    pd.quantity, 
    pd.remaining_quantity, 
    pd.brand,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount 
        )
		  )
      FROM product_variations AS pv
      WHERE p.id = pv.product_id
	  ) AS variations,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'color', pi.color,
        'path', pi.path
      )
    ) AS images
    FROM products as p
    JOIN productDetails AS pd ON p.id = pd.product_id
    LEFT JOIN product_images AS pi ON p.id = pi.product_id
    WHERE p.CategoryID = 1 AND p.status = 1 AND pd.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
    GROUP BY p.id, p.name, p.shortDescription, p.CategoryID, p.main_image, p.status,
      pd.quantity, pd.remaining_quantity, pd.brand
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }
      results.forEach((element) => {
        [...element.images].forEach((image) => {
          image.path = JSON.parse(image.path);
        });
      });
      res.json(results);
    });
  }

  //Truy vấn laptop hiển thị Home
  async QueryProductsLaptop(req, res) {
    const query = `
    SELECT
    p.*,
    pd.quantity, 
    pd.remaining_quantity, 
    pd.brand, 
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount 
        )
		  )
      FROM product_variations AS pv
      WHERE p.id = pv.product_id
	  ) AS variations,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'color', pi.color,
        'path', pi.path
      )
    ) AS images
      FROM products as p
      JOIN productDetails AS pd ON p.id = pd.product_id
      LEFT JOIN product_images AS pi ON p.id = pi.product_id
      WHERE p.CategoryID = 1 AND p.status = 1
      GROUP BY p.id, p.name, p.shortDescription, p.CategoryID, p.main_image, p.status,
        pd.quantity, pd.remaining_quantity, pd.brand;
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }
      results.forEach((element) => {
        [...element.images].forEach((image) => {
          image.path = JSON.parse(image.path);
        });
      });
      res.json(results);
    });
  }

  //Truy vấn điện thoại hiển thị Home
  async QueryProductsDienThoai(req, res) {
    const query = `
    SELECT
    p.*,
    pd.quantity, 
    pd.remaining_quantity, 
    pd.brand, 
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount 
        )
		  )
      FROM product_variations AS pv
      WHERE p.id = pv.product_id
	  ) AS variations,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'color', pi.color,
        'path', pi.path
      )
    ) AS images
      FROM products as p
      JOIN productDetails AS pd ON p.id = pd.product_id
      LEFT JOIN product_images AS pi ON p.id = pi.product_id
      WHERE p.CategoryID = 2 AND p.status = 1
      GROUP BY p.id, p.name, p.shortDescription, p.CategoryID, p.main_image, p.status,
        pd.quantity, pd.remaining_quantity, pd.brand;
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }
      results.forEach((element) => {
        [...element.images].forEach((image) => {
          image.path = JSON.parse(image.path);
        });
      });
      res.json(results);
    });
  }

  async topLaptop(req, res) {
    const query = `
    SELECT p.*, MAX(pd.brand) as brand, pd.remaining_quantity,
      (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount 
        )
		  )
      FROM product_variations AS pv
      WHERE p.id = pv.product_id
	  ) AS variations
      FROM products as p
      JOIN productDetails as pd ON p.id = pd.product_id
      JOIN orderDetailsProduct ON p.id = orderDetailsProduct.productID
      JOIN orders ON orderDetailsProduct.orderID = orders.id
      WHERE orders.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
      AND p.CategoryID = 1 AND p.status = 1
      GROUP BY p.id, pd.remaining_quantity
      ORDER BY SUM(orderDetailsProduct.quantity) DESC
      LIMIT 10;
      `;
    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }
      res.json(results);
    });
  }

  async topDienthoai(req, res) {
    const query = `
    SELECT p.*, MAX(pd.brand) as brand, pd.remaining_quantity,
      (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount 
        )
		  )
      FROM product_variations AS pv
      WHERE p.id = pv.product_id
	  ) AS variations,
      (
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'color', pi.color,
        'path', pi.path
      )
    )
    FROM product_images AS pi
    WHERE p.id = pi.product_id
  ) AS images
      FROM products as p
      JOIN productDetails as pd ON p.id = pd.product_id
      JOIN orderDetailsProduct ON p.id = orderDetailsProduct.productID
      JOIN orders ON orderDetailsProduct.orderID = orders.id
      WHERE orders.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
      AND p.CategoryID = 2 AND p.status = 1
      GROUP BY p.id, pd.remaining_quantity
      ORDER BY SUM(orderDetailsProduct.quantity) DESC
      LIMIT 10;
      `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }

      res.json(results);
    });
  }

  // get capacity, API: /product/capacity
  getCapacity(req, res) {
    const query = `SELECT * FROM capacity`;
    mysql.query(query, (e, results, fields) => {
      if (e) {
        console.log(e);
        res.status(500).json("Lỗi lấy dữ liệu capacity!");
      }
      res.status(200).send(results);
    });
  }

  // disable product, API: /product/disable-and-enable
  async disable(req, res) {
    try {
      const { id, status } = req.body;
      const queryDisable = `UPDATE products SET status = ? WHERE id = ?`;
      if (status === 0) {
        await query(queryDisable, [1, id]);
      } else {
        await query(queryDisable, [0, id]);
      }
      setTimeout(() => {
        res.status(200).json({ message: "success" });
      }, 1000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        res.status(500).json({ message: "error" });
      }, 1000);
    }
  }
}
module.exports = new Product();
