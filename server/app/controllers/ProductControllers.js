const path = require("path");
const fs = require("fs");

const mysql = require("../../config/db/mySQL");
const { query } = require("../../util/callbackToPromise");

class Product {
  async Addproduct(req, res) {
    try {
      const data = req.body;
      const arrImage = req.files;
      const main_image = [...arrImage].find(
        (file) => file.fieldname === "main_image"
      );
      if (!data.variations) {
        return res
          .status(400)
          .json({ message: "Không có thông tin biến thể sản phẩm" });
      }
      // Đưa images trở lại variations
      var variations = data.variations;
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

      // Lấy ra mảng dữ liệu cho bảng product_variations
      const arrValueTableProductVariations = [];
      for (let i = 0; i < variations.length; i++) {
        const capacityGroup = variations[i].capacityGroup;
        capacityGroup.forEach((item) => {
          const data = {
            capacity: item.capacity,
            price: item.price,
            discount_amount: item.discount_amount ? item.discount_amount : 0,
            color: variations[i].color,
            quantity_variant: item.quantity_variant,
            remaining_quantity_variant: item.quantity_variant,
          };
          arrValueTableProductVariations.push(data);
        });
      }
      // console.log(arrValueTableProductVariations);
      // res.status(200).send("success");
      // return;

      var mainImagePath = "";
      // multer không nhận được ảnh sẽ trả về undefind
      if (main_image) {
        mainImagePath = `/images/${path.basename(main_image.path)}`;
      }
      const configurationString = JSON.stringify(data.configuration);
      const is_product = `INSERT INTO products (name, main_image, shortDescription, CategoryID, status, release_date) VALUES (?, ?, ?, ?, ?, ?)`;
      const is_productdetail =
        "INSERT INTO productdetails(`brand`,`configuration`,`description`,`product_id`)VALUES(?,?,?,?);";
      // PRODUCT
      // Chuyển đổi chuỗi release_date thành giá trị kiểu DATE
      const formattedDate = new Date(data.release_date)
        .toISOString()
        .split("T")[0];
      const productValues = [
        data.name,
        mainImagePath,
        data.shortDescription,
        data.category,
        data.status ? 1 : 0,
        formattedDate,
      ];
      const resultP = await query(is_product, productValues);
      const id_product = resultP.insertId;

      // PRODUCT DETAILS
      const PdValues = [
        data.brand,
        configurationString,
        data.description,
        id_product,
      ];
      await query(is_productdetail, PdValues);

      // product_variations & product_images
      const is_product_variations = `
      INSERT INTO product_variations(color, capacity, product_id, price, discount_amount, quantity_variant, remaining_quantity_variant) VALUES (?,?,?,?,?,?,?);
    `;
      // insert to product_variations
      arrValueTableProductVariations &&
        [...arrValueTableProductVariations].forEach(async (variation) => {
          const variationsValues = [
            variation.color,
            variation.capacity,
            id_product,
            variation.price,
            variation.discount_amount,
            variation.quantity_variant,
            variation.remaining_quantity_variant,
          ];
          await query(is_product_variations, variationsValues);
        });

      // insert to product_images
      const is_product_images = `
      INSERT INTO product_images( product_id, color, path) VALUES (?,?,?);
      `;
      variations &&
        [...variations].forEach(async (item) => {
          const imagesValues = [
            id_product,
            item.color,
            JSON.stringify(item.images),
          ];
          await query(is_product_images, imagesValues);
        });

      res.status(200).send("success");
    } catch (error) {
      console.log(error);
      res.status(500).send("failed");
    }
  }

  // API: /product/json
  async json(req, res) {
    const queryProduct = `
    SELECT 
    p.id,
    p.name,
    p.status,
    p.shortDescription,
    CONVERT_TZ(p.release_date, '+00:00', '+07:00') AS release_date,
    p.main_image,
    p.CategoryID as category,
    pd.brand,
    CONVERT_TZ(pd.created_at, '+00:00', '+07:00') AS created_at,
    pd.configuration,
    pd.description,
    (
      SELECT json_arrayagg(
      JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount,
          'quantity_variant', pv.quantity_variant,
          'remaining_quantity_variant', pv.remaining_quantity_variant
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
    GROUP BY p.id, p.name, p.status, p.main_image,p.shortDescription, category,
    pd.brand,
    pd.created_at, pd.configuration, pd.description;
    `;

    // Hàm sử lí lỗi tập chung
    const handleError = (e, res, message) => {
      console.log(e);
      return res.status(500).json(message);
    };

    try {
      const results = await query(queryProduct);
      results.forEach((element) => {
        if (element.configuration)
          element.configuration = JSON.parse(element.configuration);
        if (element.images) {
          [...element.images].forEach((image) => {
            image.path = JSON.parse(image.path);
          });
        }
      });
      res.status(200).send(results);
    } catch (error) {
      handleError(error, res, { message: "Get product details failed!!!" });
    }
  }

  // API: /product/delete/:id
  async Delete(req, res) {
    // Lấy id từ client request lên
    const id = req.params.id;
    // query check product in order
    const checkInOrder = `select count(*) as count from orderdetailsproduct where productID = ?`;
    const resultsCheck = await query(checkInOrder, [id]);
    if (resultsCheck[0].count !== 0) {
      return res.json({message: "Do not delete"});
    }

    // query get path image
    const sl_product_images = `
      SELECT path AS imagePath
      FROM product_images
      WHERE product_id = ?;
    `;
    const sl_main_image = `
      SELECT main_image
      FROM products
      WHERE id = ?;
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
      if (!id) {
        return res.status(400).json({ message: "Not Id" });
      }
      // select imagePath galery
      var resultsImagesPath = await query(sl_product_images, [id]);
      var resultsMainImagesPath = await query(sl_main_image, [id]);
      // Tạo mảng chứa các đường dẫn hình ảnh của sản phẩm
      const arrayImagePath = [];
      resultsImagesPath.forEach((element) => {
        const ip = JSON.parse(element.imagePath);
        ip.forEach((value) => {
          arrayImagePath.push(value);
        });
      });
      // Thêm đường dẫn ảnh chính của sản phẩm vào danh sách xóa
      arrayImagePath.push(resultsMainImagesPath[0].main_image);
      // check nếu có ảnh thì mới xóa trong server và sql
      if (arrayImagePath.length != 0) {
        arrayImagePath.forEach(async (imagePath) => {
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

      return res.status(200).json({ message: "success" });
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
    // const arrImage = req.files?.images;
    const main_image = req.files?.main_image;
    const arrVariations = dataUpdate.variations;

    // console.log("id: ", id);
    // console.log("arrVariations: ", arrVariations);
    // return res.status(200).json({ message: "success" });

    // Tạo tên của các field (Xác định các field muốn cập nhật)
    const fieldsProduct = [
      "name",
      "main_image",
      "shortDescription",
      "release_date",
    ];
    const fieldsProductDetails = [
      "quantity",
      "remaining_quantity",
      "brand",
      "configuration",
      "description",
    ];
    // Tạo các đối tượng (object) chứa các field
    // và giá trị tương ứng cho từng bảng
    var dataGroupTableProduct = {};
    var dataGroupTableProductDetails = {};
    // Thêm ảnh chính vào object product
    // create main image path
    var mainImagePath = "";
    if (main_image) {
      mainImagePath = `/images/${path.basename(main_image[0].path)}`;
    }
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
        // product details
        if (fieldsProductDetails.includes(fieldName)) {
          if (fieldName === "configuration") {
            dataGroupTableProductDetails[fieldName] = JSON.stringify(
              dataUpdate[fieldName]
            );
          } else {
            dataGroupTableProductDetails[fieldName] = dataUpdate[fieldName];
          }
        }
      }
      // Cập nhật vào csdl nếu có dữ liệu thay đổi (data Group Table Product không rỗng)
      // 1. update product
      if (Object.values(dataGroupTableProduct).length != 0) {
        const queryUpdateProduct = `UPDATE products SET ? WHERE id = ?`;
        const querySelectMainImage = `SELECT main_image FROM products WHERE id = ?`;
        const mainImagePathData = await query(querySelectMainImage, [id]);
        await query(queryUpdateProduct, [dataGroupTableProduct, id]);
        if (mainImagePath) {
          // Đường dẫn tới thư mục public chứa hình ảnh
          const url = path.join(
            __dirname,
            "../../src",
            "public",
            mainImagePathData[0].main_image
          );
          fs.access(url, fs.constants.F_OK, (err) => {
            if (!err) {
              // Nế có thì thực hiện xóa
              fs.unlink(url, (err) => {
                if (err) {
                  console.error("Lỗi khi xóa hình ảnh:", err);
                  return res
                    .status(500)
                    .json({ message: "Delete image failed." });
                }
              });
            }
          });
        }
      }
      // 2. update product details
      if (Object.values(dataGroupTableProductDetails).length != 0) {
        const queryUpdateProductDetails = `UPDATE productdetails SET ? WHERE product_id = ?`;
        await query(queryUpdateProductDetails, [
          dataGroupTableProductDetails,
          id,
        ]);
      }
      console.log();
      // 3. update product variations
      if (arrVariations && arrVariations.length != 0) {
        arrVariations.forEach(async (variation) => {
          const queryUpdateProductVariations = `UPDATE product_variations SET price = ?, discount_amount = ?, quantity_variant =?, remaining_quantity_variant =?  WHERE product_id = ? AND color = ? AND capacity = ?`;
          await query(queryUpdateProductVariations, [
            variation.price,
            variation.discount_amount,
            variation.quantity_variant,
            variation.remaining_quantity_variant,
            id,
            variation.color,
            variation.capacity,
          ]).catch((error) => {
            console.log(error);
            return;
          });
        });
      }

      // ===== Vì images không lấy trong req.body nên sẽ sử lí riêng =====
      // Nếu mảng images path không rỗng -> Thực hiện cập nhật
      // var arrPathImage = [];
      // // create images path
      // if (arrImage) {
      //   arrImage.forEach((image) => {
      //     const pathImage = `/images/${path.basename(image.path)}`;
      //     arrPathImage.push(pathImage);
      //   });
      // }
      // if (arrPathImage.length != 0) {
      //   // Xóa các image trước đó
      //   const sl_galery = `
      //   SELECT galery.thumbnail AS imagePath
      //   FROM galery
      //   WHERE product_id = ?;
      // `;
      //   const dl_galery = `
      //   DELETE FROM galery
      //   WHERE product_id = ?;
      //   `;

      //   // select imagePath galery
      //   const arrayImagePath = await query(sl_galery, [id]);

      //   // check nếu có ảnh thì mới xóa trong server và sql
      //   // Thêm sau khi xóa
      //   if (arrayImagePath.length != 0) {
      //     await arrayImagePath.forEach(async (imagePath) => {
      //       // Đường dẫn tới thư mục public chứa hình ảnh
      //       const publicImagePath = path.join(
      //         __dirname,
      //         "../../src",
      //         "public",
      //         imagePath.imagePath
      //       );
      //       // Thực hiện xóa image trong server
      //       // Kiểm tra file có trong thư mục không
      //       fs.access(publicImagePath, fs.constants.F_OK, (err) => {
      //         if (!err) {
      //           // Nế có thì thực hiện xóa
      //           fs.unlink(publicImagePath, (err) => {
      //             if (err) {
      //               console.error("Lỗi khi xóa hình ảnh:", err);
      //               return res
      //                 .status(500)
      //                 .json({ message: "Delete image failed." });
      //             }
      //           });
      //         }
      //       });
      //     });
      //     // Nếu xóa image trên server thành công thì xóa trên sql
      //     await query(dl_galery, [id]);
      //     // Thêm ảnh mới của sản phẩm
      //     const queryUpdateGalery = `INSERT INTO galery (thumbnail, product_id) VALUES (?,?)`;
      //     arrPathImage.forEach(async (image) => {
      //       await query(queryUpdateGalery, [image, id]);
      //     });
      //     return res.status(200).json({ message: "success" });
      //   }
      //   // Nếu sản phẩm chưa có ảnh nào
      //   // Thêm ảnh mới của sản phẩm
      //   const queryUpdateGalery = `INSERT INTO galery (thumbnail, product_id) VALUES (?,?)`;
      //   arrPathImage.forEach(async (image) => {
      //     await query(queryUpdateGalery, [image, id]);
      //   });
      // }
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
    pd.brand, 
    pd.configuration,
    pd.description,
    CONVERT_TZ(pd.created_at, '+00:00', '+07:00') AS created_at,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'color', pv.color,
        'capacity', pv.capacity,
        'price', pv.price,
        'discount_amount', pv.discount_amount,
        'quantity_variant', pv.quantity_variant,
        'remaining_quantity_variant', pv.remaining_quantity_variant
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
    pd.brand, pd.configuration, pd.description, pd.created_at;
    `;

    try {
      const results = await query(productQuery, [id]);
      results.forEach((element) => {
        if (element.configuration)
          element.configuration = JSON.parse(element.configuration);
        if (element.images) {
          [...element.images].forEach((image) => {
            image.path = JSON.parse(image.path);
          });
        }
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
      (
        SELECT JSON_OBJECT(
          'color', pv.color,
            'capacity', pv.capacity,
            'price', pv.price,
            'discount_amount', pv.discount_amount,
            'quantity_variant', pv.quantity_variant,
            'remaining_quantity_variant', pv.remaining_quantity_variant
          )
        FROM product_variations AS pv
        WHERE p.id = pv.product_id AND pv.color = ? AND pv.capacity = ?
      ) AS variations,
      (
        SELECT pi.path
        FROM product_images AS pi
        WHERE p.id = pi.product_id AND pi.color = ?
      ) AS images,
      (
        SELECT 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              "id", dc.id,
              "content", dc.content,
              "value_vnd", dc.value_vnd,
              "value_percent", dc.value_percent,
              "start_date", CONVERT_TZ(dc.start_date, '+00:00', '+07:00'),
              "end_date", CONVERT_TZ(dc.end_date, '+00:00', '+07:00')
            )
          )
        FROM discount_code as dc 
        JOIN sanpham_discountcode as sd ON sd.discountCode_id = dc.id
        WHERE sd.products_id = ?
      ) as coupons
        FROM products as p
        JOIN productDetails ON p.id = productDetails.product_id
        JOIN category ON p.CategoryID = category.id
        LEFT JOIN prodetailcolor ON p.id = prodetailcolor.product_id
        WHERE p.id = ?
        GROUP BY p.id, p.name, p.status, p.shortDescription, p.main_image,
       productDetails.created_at,  productDetails.brand,
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
          data[i].product_id,
        ]);
        results.forEach((result) => {
          if (results.images) {
            result.images = JSON.parse(result.images);
          }
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
    pd.brand,
    pd.configuration,
    CONVERT_TZ(pd.created_at, '+00:00', '+07:00') AS created_at,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount,
          'quantity_variant', pv.quantity_variant,
          'remaining_quantity_variant', pv.remaining_quantity_variant
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
    pd.brand,configuration, pd.created_at;
    `;
    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }
      results.forEach((element) => {
        if (element.images) {
          [...element.images].forEach((image) => {
            image.path = JSON.parse(image.path);
          });
        }
      });
      res.json(results);
    });
  }

  async Newlaptop(req, res) {
    const query = `
    SELECT
    p.*,
    pd.brand,
    pd.configuration,
    CONVERT_TZ(pd.created_at, '+00:00', '+07:00') AS created_at,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount,
          'quantity_variant', pv.quantity_variant,
          'remaining_quantity_variant', pv.remaining_quantity_variant
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
    pd.brand,configuration, pd.created_at;
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }
      results.forEach((element) => {
        if (element.images) {
          [...element.images].forEach((image) => {
            image.path = JSON.parse(image.path);
          });
        }
      });
      res.json(results);
    });
  }

  //Truy vấn laptop hiển thị Home
  async QueryProductsLaptop(req, res) {
    const query = `
    SELECT
    p.*,
    pd.brand, 
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount ,
          'quantity_variant', pv.quantity_variant,
          'remaining_quantity_variant', pv.remaining_quantity_variant
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
      pd.brand;
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }
      results.forEach((element) => {
        if (element.images) {
          [...element.images].forEach((image) => {
            image.path = JSON.parse(image.path);
          });
        }
      });
      res.json(results);
    });
  }

  //Truy vấn điện thoại hiển thị Home
  async QueryProductsDienThoai(req, res) {
    const query = `
    SELECT
    p.*,
    pd.brand, 
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount,
          'quantity_variant', pv.quantity_variant,
          'remaining_quantity_variant', pv.remaining_quantity_variant
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
      pd.brand;
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
    SELECT p.*, MAX(pd.brand) as brand,
      (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount,
          'quantity_variant', pv.quantity_variant,
          'remaining_quantity_variant', pv.remaining_quantity_variant
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
      AND p.CategoryID = 1 AND p.status = 1 AND orders.status = 4
      GROUP BY p.id
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
    SELECT p.*, MAX(pd.brand) as brand,
      (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'color', pv.color,
          'capacity', pv.capacity,
          'price', pv.price,
          'discount_amount', pv.discount_amount,
          'quantity_variant', pv.quantity_variant,
          'remaining_quantity_variant', pv.remaining_quantity_variant
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
      AND p.CategoryID = 2 AND p.status = 1 AND orders.status = 4
      GROUP BY p.id
      ORDER BY SUM(orderDetailsProduct.quantity) DESC
      LIMIT 10;
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

  // /product/order/:id
  async getProductOfOrder(req, res) {
    try {
      const product_id = req.params.id;
      console.log(req.body);
      return res.status(200);

      const sl_product = `
        SELECT
        product.*,
        productDetails.brand,
        productDetails.created_at,
        productDetails.configuration,
        category.name as category,
        CONCAT('[', GROUP_CONCAT('{"color": "', prodetailcolor.Colorname, '"}' SEPARATOR ','), ']') as color,
        CONCAT('[', GROUP_CONCAT('{"galery": "', galery.thumbnail, '"}' SEPARATOR ','), ']') as galery
        FROM products
        JOIN productDetails ON product.id = productDetails.product_id
        JOIN category ON product.CategoryID = category.id
        LEFT JOIN prodetailcolor ON product.id = prodetailcolor.product_id
        LEFT JOIN galery ON product.id = galery.product_id
        WHERE product.id = ?
        GROUP BY product.id, product.name, product.price, product.status, productDetails.brand, 
        product.shortDescription, productDetails.created_at, productDetails.configuration, 
        category.name;
        `;
      const results = await query(sl_product, [product_id]);
      // chuyển string thành mảng (color, image)
      // color
      if (results[0]?.color) {
        const colorRaw = JSON.parse(results[0].color);
        let arrColor = [];
        colorRaw.forEach((color) => {
          arrColor.push(color.color);
        });
        results[0].color = arrColor;
      }

      // image
      if (results[0]?.galery) {
        const imageRaw = JSON.parse(results[0].galery);
        let arrimage = [];
        imageRaw.forEach((image) => {
          arrimage.push(image.galery);
        });
        results[0].galery = arrimage;
      }

      res.status(200).json(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Get product failed" });
    }
  }

  // /product/:id/variant
  async getRemainingQuantityVariant(req, res) {
    try {
      const product_id = req.params.id;
      const { color, capacity } = req.body;
      const qr = `Select * from product_variations where product_id = ? and color = ? and capacity = ?`;
      const results = await query(qr, [product_id, color, capacity]);

      res.status(200).json(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Get failed variant" });
    }
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

  async getProductImageAndDescription(req, res) {
    try {
      const dataID = req.body; // Giả sử danh sách id được gửi trong body request
      // Chuẩn bị câu truy vấn
      const lc_query = `SELECT id, main_image, shortDescription FROM products WHERE id IN (?)`;

      // Thực thi truy vấn với danh sách id
      const products = await query(lc_query, [dataID]);
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }

      // Trả về dữ liệu sản phẩm
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getProductDescription(req, res) {
    try {
      // Giả sử danh sách id được gửi trong body request
      // Chuẩn bị câu truy vấn
      const lc_query = `SELECT id, shortDescription FROM products`;

      // Thực thi truy vấn với danh sách id
      const products = await query(lc_query);
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }

      // Trả về dữ liệu sản phẩm
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCoupons(req, res) {
    try {
      const product_id = req.params.id;
      const qr = `
      SELECT dc.*
      FROM sanpham_discountcode AS sdc
      JOIN discount_code AS dc ON sdc.discountCode_id = dc.id
      WHERE sdc.products_id = ?;`;
      const results = await query(qr, [product_id]);

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: "Get failed coupons" });
    }
  }
}
module.exports = new Product();
