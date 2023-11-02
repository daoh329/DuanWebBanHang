const mysql = require("../../config/db/mySQL");
const { query } = require("../../util/callbackToPromise");
const path = require("path");
const fs = require("fs");
const { da } = require("date-fns/locale");
class Product {
  async Addproduct(req, res) {
    const data = req.body;
    const arrImage = req.files;
    var arrPathImage = [];
    arrImage.forEach((image) => {
      const pathImage = `/images/${path.basename(image.path)}`;
      arrPathImage.push(pathImage);
    });
    const configuration =
      data.category === "Điện thoại"
        ? {
            series: data.series,
            screen: data.screen,
            resolution: data.resolution,
            chip: data.chip,
            ram: data.ram,
            rom: data.rom,
            screen: data.screen,
            os: data.os,
            pin: data.pin,
            guarantee: data.guarantee,
            demand: data.demand,
            charging_port: data.charging_port,
            sim_type: data.sim_type,
            mobile_network: data.mobile_network,
            rear_camera: data.rear_camera,
            front_camera: data.front_camera,
            wifi: data.wifi,
            gps: data.gps,
            bluetooth: data.bluetooth,
            headphone_jack: data.headphone_jack,
            size: data.size,
            mass: data.mass,
            accessory: data.accessory,
          }
        : {
            series: data.series,
            part_number: data.part_number,
            guarantee: data.guarantee,
            demand: data.demand,
            cpu: data.cpu,
            ram: data.ram,
            rom: data.rom,
            screen: data.screen,
            vga: data.vga,
            os: data.os,
            maximum_number_of_storage_ports:
              data.maximum_number_of_storage_ports,
            M2_slot_type_supported: data.M2_slot_type_supported,
            output_port: data.output_port,
            connector: data.connector,
            wireless_connectivity: data.wireless_connectivity,
            keyboard: data.keyboard,
            pin: data.pin,
            mass: data.mass,
            accessory: data.accessory,
          };
    const configurationString = JSON.stringify(configuration);
    let nameP;
    if (data.name == null || data.name == "") {
      nameP = data.brand + " " + data.series + " " + data.part_number;
    } else {
      nameP = data.name;
    }

    const sl_categoryid = `SELECT id AS Value FROM category where name = ?`;
    const is_product = `INSERT INTO product (name, price, shortDescription, CategoryID, status) VALUES (?, ?, ?, ?, ?)`;
    const is_galery = `INSERT INTO galery (thumbnail, product_id) VALUES (?, ?)`;
    const is_productdetail =
      "INSERT INTO productdetails(`quantity`,`brand`,`configuration`,`description`,`product_id`,`remaining_quantity`)VALUES(?,?,?,?,?,?);";
    const is_ProDetailColor =
      "INSERT INTO prodetailcolor (`product_id`,`Colorname`) VALUES (?,?);";

    // Hàm sử lí lỗi tập chung
    const handleError = (e, res, message) => {
      console.log(e);
      return res.status(500).json(message);
    };

    try {
      const arrayCategoryid = await query(sl_categoryid, data.category);
      const productValues = [
        nameP,
        data.price,
        data.shortDescription,
        arrayCategoryid[0].Value,
        data.status ? 1 : 0,
      ];
      const resultP = await query(is_product, productValues);
      const id_Product = resultP.insertId;
      for (const image of arrPathImage) {
        const galeryValues = [image, id_Product];
        await query(is_galery, galeryValues);
      }
      const PdValues = [
        data.quantity,
        data.brand,
        configurationString,
        data.description,
        id_Product,
        data.quantity,
      ];
      await query(is_productdetail, PdValues);

      if (Array.isArray(data.color)) {
        for (const x of data.color) {
          await query(is_ProDetailColor, [id_Product, x]);
        }
      } else {
        await query(is_ProDetailColor, [id_Product, data.color]);
      }

      res.status(200).send("success");
    } catch (error) {
      handleError(error, res, { status: "failed" });
    }
  }

  async json(req, res) {
    // API: /product/json
    const queryProduct = `SELECT 
    product.id,
    product.name,
    product.price,
    product.status,
    product.shortDescription,
    productDetails.brand,
    productDetails.quantity,
    productDetails.remaining_quantity,
    productDetails.created_at,
    productDetails.configuration,
    productDetails.description,
    category.name as category,
    CONCAT('[', GROUP_CONCAT('{"color": "', prodetailcolor.Colorname, '"}' SEPARATOR ','), ']') as color
    FROM product
    JOIN productDetails ON product.id = productDetails.product_id
    JOIN category ON product.CategoryID = category.id
    LEFT JOIN prodetailcolor ON product.id = prodetailcolor.product_id
    GROUP BY product.id, product.name, product.price, product.status, 
    productDetails.brand, productDetails.quantity, productDetails.remaining_quantity, 
    product.shortDescription, productDetails.created_at, productDetails.configuration, productDetails.description, category.name;
    `;

    // Hàm sử lí lỗi tập chung
    const handleError = (e, res, message) => {
      console.log(e);
      return res.status(500).json(message);
    };

    try {
      const getProduct = await query(queryProduct);
      getProduct.forEach((data) => {
        // sử lí color
        data.color = JSON.parse(data.color);
        const colors = data.color;
        data.color = [];
        for (const color in colors) {
          if (colors.hasOwnProperty(color)) {
            data.color.push(colors[color].color);
          }
        }
        // sử lí configuration
        data.configuration = JSON.parse(data.configuration);
      });
      res.status(200).send(getProduct);
    } catch (error) {
      handleError(error, res, { message: "Get product details failed!!!" });
    }
  }

  // API: /product/delete/:id
  async Delete(req, res) {
    // query get path image
    const sl_galery = `
      SELECT galery.thumbnail AS imagePath
      FROM galery
      INNER JOIN product ON product.id = galery.product_id
      WHERE product.id = ?;
    `;
    const dl_prodetailcolor = `
    DELETE FROM prodetailcolor
    WHERE product_id = ?;    
    `;
    const dl_productDetails = `
      DELETE productdetails
      FROM productdetails INNER JOIN product ON productdetails.product_id = product.id
      WHERE product.id = ?;
    `;
    const dl_galery = `
      DELETE galery
      FROM galery INNER JOIN product ON galery.product_id = product.id
      WHERE product.id = ?;
    `;
    const dl_product = `
      DELETE FROM product WHERE id = ?;
    `;

    // Hàm sử lí lỗi tập chung
    const handleError = (e, res, message) => {
      console.log(e);
      return res.status(500).json(message);
    };

    try {
      // Lấy id từ client request lên
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Not Id" });
      }

      // select imagePath galery
      const arrayImagePath = await query(sl_galery, [id]);

      // check nếu có ảnh thì mới xóa trong server và sql
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
          fs.unlink(publicImagePath, (err) => {
            if (err) {
              console.error("Lỗi khi xóa hình ảnh:", err);
              return res.status(500).json({ message: "Lỗi khi xóa hình ảnh." });
            }
          });
        });

        // nếu xóa image trên server thành công thì xóa trên sql
        await query(dl_galery, [id]).catch((error) => {
          handleError(error, res, { message: "Xóa ảnh trên csdl thất bại." });
        });
      }

      await Promise.all([
        query(dl_prodetailcolor, [id]),
        query(dl_productDetails, [id]),
        query(dl_product, [id]),
      ]);

      res.json({ message: "success" });
    } catch (error) {
      handleError(error, res, { message: "failed" });
    }
  }

  // Cập nhật sản phẩm
  async Update(req, res) {
    // API: /product/update/:id
    const id = req.params.id;
    const dataUpdate = req.body;
    const arrImage = req.files;
    var arrPathImage = [];

    if (arrImage) {
      arrImage.forEach((image) => {
        const pathImage = `/images/${path.basename(image.path)}`;
        arrPathImage.push(pathImage);
      });
    }

    // Tạo tên của các field (Xác định các field muốn cập nhật)
    const fieldsProduct = ["name", "price", "shortDescription"];
    const fieldsColor = ["color"];
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
    var dataGroupTableProDetailColor = {};

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

  async Newphone(req, res) {
    const query = `
      SELECT product.*, productDetails.quantity, productDetails.remaining_quantity, productDetails.brand, productDetails.configuration,productDetails.created_at , galery.thumbnail
      FROM product
      JOIN productDetails ON product.id = productDetails.product_id
      JOIN (
        SELECT id, thumbnail, product_id
        FROM (
          SELECT id, thumbnail, product_id,
                ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id) as rn
          FROM galery
        ) tmp
        WHERE rn = 1
      ) galery ON product.id = galery.product_id
      WHERE product.CategoryID = 2 AND product.status = 1 AND productDetails.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH);
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }

      res.json(results);
    });
  }

  async Newlaptop(req, res) {
    const query = `
      SELECT product.*, productDetails.quantity, productDetails.remaining_quantity, productDetails.brand, productDetails.configuration, productDetails.created_at, galery.thumbnail
      FROM product
      JOIN productDetails ON product.id = productDetails.product_id
      JOIN (
        SELECT id, thumbnail, product_id
        FROM (
          SELECT id, thumbnail, product_id,
                ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id) as rn
          FROM galery
        ) tmp
        WHERE rn = 1
      ) galery ON product.id = galery.product_id
      WHERE product.CategoryID = 1 AND product.status = 1 AND productDetails.created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH);
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }

      res.json(results);
    });
  }

  async QueryProductsLaptop(req, res) {
    const query = `
      SELECT product.*, productDetails.quantity, productDetails.remaining_quantity, productDetails.brand, productDetails.configuration, productDetails.created_at, galery.thumbnail
      FROM product
      JOIN productDetails ON product.id = productDetails.product_id
      JOIN (
        SELECT id, thumbnail, product_id
        FROM (
          SELECT id, thumbnail, product_id,
                ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id) as rn
          FROM galery
        ) tmp
        WHERE rn = 1
      ) galery ON product.id = galery.product_id
      WHERE product.CategoryID = 1 AND product.status = 1;
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }

      res.json(results);
    });
  }

  //Truy vấn điện thoại hiển thị Home
  async QueryProductsDienThoai(req, res) {
    const query = `
      SELECT product.*,productDetails.quantity, productDetails.remaining_quantity, productDetails.brand, productDetails.configuration, productDetails.created_at, galery.thumbnail
      FROM product
      JOIN productDetails ON product.id = productDetails.product_id
      JOIN (
        SELECT id, thumbnail, product_id
        FROM (
          SELECT id, thumbnail, product_id,
                ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY id) as rn
          FROM galery
        ) tmp
        WHERE rn = 1
      ) galery ON product.id = galery.product_id
      WHERE product.CategoryID = 2 AND product.status = 1;
    `;

    mysql.query(query, (error, results) => {
      if (error) {
        return res.json({ error });
      }

      res.json(results);
    });
  }

  async DetailProducts(req, res) {
    const { id } = req.params;

    // Truy vấn để lấy thông tin chi tiết sản phẩm
    const productQuery = `
    SELECT p.id AS p_ID, p.name, p.price, p.shortDescription, p.CategoryID, p.status, c.name as category_name, pd.*, b.name as brand_name
    FROM product p 
    JOIN category c ON p.CategoryID = c.id
    JOIN productDetails pd ON p.id = pd.product_id
    JOIN brand b ON pd.brand = b.name
    WHERE p.id = ?;
    `;
    // Truy vấn để lấy thông tin màu sắc
    const colorQuery = `
      SELECT id, Colorname
      FROM ProdetailColor
      WHERE product_id = ?
      ORDER BY id ASC;
    `;

    // Truy vấn để lấy hình ảnh
    const imageQuery = `
      SELECT id, thumbnail
      FROM galery
      WHERE product_id = ?
      ORDER BY id ASC;
    `;
    // Thực hiện truy vấn
    mysql.query(productQuery, [id], (error, productResults) => {
      if (error) {
        return res.json({ error });
      }

      // Thực hiện truy vấn màu sắc và hình ảnh
      mysql.query(colorQuery, [id], (error, colorResults) => {
        if (error) {
          return res.json({ error });
        }
        mysql.query(imageQuery, [id], (error, imageResults) => {
          if (error) {
            return res.json({ error });
          }
          // Kết hợp kết quả và gửi lại cho client
          const results = {
            ...productResults[0],
            Colorname: colorResults.map((result) => ({
              id: result.id,
              Colorname: result.Colorname,
            })),
            thumbnails: imageResults.map((result) => ({
              id: result.id,
              thumbnail: result.thumbnail,
            })),
          };
          res.json(results);
        });
      });
    });
  }

  // getBrand, API: /product/brands
  getBrands(req, res) {
    const query = `SELECT * FROM brand`;
    mysql.query(query, (e, results, fields) => {
      if (e) {
        console.log(e);
        res.status(500).json("Lỗi lấy dữ liệu brands!");
      }
      res.status(200).send(results);
    });
  }

  // getColors, API: /product/colors
  getColors(req, res) {
    const query = `SELECT * FROM color`;
    mysql.query(query, (e, results, fields) => {
      if (e) {
        console.log(e);
        res.status(500).json("Lỗi lấy dữ liệu color!");
      }
      res.status(200).send(results);
    });
  }

  // disable product, API: /product/disable-and-enable
  async disable(req, res) {
    try {
      const { id, status } = req.body;
      const queryDisable = `UPDATE product SET status = ? WHERE id = ?`;
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
