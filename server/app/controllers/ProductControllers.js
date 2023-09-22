const mysql = require("../../config/db/mySQL");
const createTables = require("../../config/CrTables");


class Product {
  
  async Addproduct(req, res) {
    const data = req.body;
    const arrImage = req.files;
    var arrPathImage = [];
    arrImage.forEach(image => {
      arrPathImage.push(image.path) ;
    });

    const configuration = data.category === "Điện thoại" ? {
      screen: data.screen,
      resolution: data.resolution,
      chip: data.chip,
      ram:data.ram,
      rom: data.rom,
      screen:data.screen,
      os: data.os,
      pin: data.pin,
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
    } : {
      cpu: data.cpu,
      ram:data.ram,
      rom: data.rom,
      screen:data.screen,
      vga: data.vga,
      os: data.os,
      maximum_number_of_storage_ports: data.maximum_number_of_storage_ports,
      M2_slot_type_supported: data.M2_slot_type_supported,
      output_port: data.output_port,
      connector: data.connector,
      wireless_connectivity: data.wireless_connectivity,
      keyboard: data.keyboard,
      pin: data.pin,
      mass: data.mass,
      accessory: data.accessory,
    }

    res.status(200).json("success");

    // const SELECTcategory = `SELECT * FROM category where name = ?`
    // mysql.query(SELECTcategory, data.category, (er, result) => {
    //   if (er) {
    //     res.status(500).send(`Lỗi kết nối server data`)
    //   }
      
    //   // PRODUCT INSERT
    //   const insertProductQuery = `INSERT INTO product (name, price, shortDescription, CategoryID, status) VALUES (?, ?, ?, ?, 1)`;
    //   const productValues = [
    //     data.name, data.price, data.shortDescription, result[0].id
    //   ]
    //   mysql.query(insertProductQuery, productValues, (er, resultP) => {
    //     if(er){
    //       console.log("product:"+er);
    //       res.status(500).send(`lỗi thêm sản phẩm: ` + er)
          
    //     }
    //     // IMG INSERT
    //     const newProductId = resultP.insertId;
    //     const insertGaleryQuery = `INSERT INTO galery (thumbnail, product_id) VALUES (?, ?)`;
    //     for (const image of arrPathImage) {
    //       const galeryValues = [image, newProductId]
    //       mysql.query(insertGaleryQuery, galeryValues, (er, result) => {
    //         if (er) {
    //           console.log('img: ' + er);
    //         }
    //       })
    //     }
    //     // DETAIL PRODUCT
    //     const configurationString = JSON.stringify(configuration);
        
    //     const insertPdetail = 'INSERT INTO productdetails(`quantity`,`brand`,`configuration`,`description`,`product_id`)VALUES(?,?,?,?,?);'
    //     const PdValues = [
    //       data.quantity, data.brand, configurationString, data.description, newProductId
    //     ]
    //     mysql.query(insertPdetail, PdValues, (er, resultPd) => {
    //       if (!er) {
    //         // Truy vấn SQL thành công
    //         const idPD = resultPd.insertId;
    //         // COLOR INSERT
    //         const insertProDetailColorQuery = 'INSERT prodetailcolor (`ProductDetailId`,`Colorname`) VALUES (?,?);';
    //         for (const x of data.color) {
    //           const colorValues = [idPD, x];
    //           mysql.query(insertProDetailColorQuery, colorValues, (er, result) => {
    //             if (er) {
    //               console.log('color: ' + er);
    //             }
    //           })
    //         }
    //         res.status(200).send('thành công')
    //       } else {
    //         // Truy vấn SQL thất bại
    //         console.log(er);
    //       }
    //     });
  
    //   })
  
    // })
  }

  async json(req, res) {
    // API: /product/json
    const query = `SELECT * FROM product`
    // Thực hiện truy vấn SELECT để lấy dữ liệu từ bảng
    mysql.query(query, (err, result) => {
      if (err) throw err;

      // Chuyển đổi kết quả truy vấn thành chuỗi JSON
      const jsonResult = JSON.stringify(result);

      // Gửi chuỗi JSON về cho client
      res.send(jsonResult);
    });
  }

  Delete(req, res) {
    const id = req.params.id;
    if (!id) {
      console.log("Không có id được request lên.");
      res.status(500).json("Xóa thất bại. Vui lòng thử lại sau.");
      return;
    }

    // query delete
    const sl_productDetails_ID = `
      SELECT productdetails.id AS value
      FROM product
      INNER JOIN productdetails ON product.id = productdetails.product_id
      WHERE product.id = 1;
    `;
    const dl_prodetailcolor = `
    DELETE FROM prodetailcolor
    WHERE ProductDetailId = ?;    
    `;
    const dl_productDetails = `
      DELETE productdetails
      FROM productdetails INNER JOIN product ON productdetails.product_id = product.id
      WHERE product.id = ?;
    `;
    const dl_product = `
      DELETE FROM product WHERE id = ?;
    `;
    // lấy id của bảng product details
    mysql.query(sl_productDetails_ID, (e, results, fields) => {
      if (e) {
        console.log(e);
        res.status(404).json("Xóa thất bại. Vui lòng thử lại sau.");
        return;
      }
      const productDetails_ID = results[0].value;
      // Xóa product color
      mysql.query(
        dl_prodetailcolor,
        [productDetails_ID],
        (e, results, fields) => {
          if (e) {
            console.log(e);
            res.status(500).json("Xóa thất bại. Vui lòng thử lại sau.");
            return;
          }
          // Xóa product details
          mysql.query(dl_productDetails, [id], (e, r, f) => {
            if (e) {
              console.log(e);
              res.status(500).json("Xóa thất bại. Vui lòng thử lại sau.");
              return;
            }
            // xóa product
            mysql.query(dl_product, [id], (e, r, f) => {
              if (e) {
                console.log(e);
                res.status(500).json("Xóa thất bại. Vui lòng thử lại sau.");
                return;
              }

              res.status(200).json("Xóa thành công.");
            });
          });
        }
      );
    });
  }

  async QueryProducts(req, res) {
    const query = `
      SELECT product.id, product.name, product.price, productDetails.brand, galery.thumbnail
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
      ) galery ON product.id = galery.product_id;
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
    SELECT p.*, c.name as category_name, pd.*, b.name as brand_name
    FROM product p 
    JOIN category c ON p.CategoryID = c.id
    JOIN productDetails pd ON p.id = pd.product_id
    JOIN brand b ON pd.brand = b.name
    WHERE p.id = ?;
    `;

    // Thực hiện truy vấn
    mysql.query(productQuery, [id], (error, productResults) => {
    if (error) {
      return res.json({ error });
    }

    // Truy vấn để lấy thông tin màu sắc
    const colorQuery = `
      SELECT id, Colorname
      FROM ProdetailColor
      WHERE ProductDetailId = ?
      ORDER BY id ASC;
    `;

    // Truy vấn để lấy hình ảnh
    const imageQuery = `
      SELECT id, thumbnail
      FROM galery
      WHERE product_id = ?
      ORDER BY id ASC;
    `;

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
          Colorname: colorResults.map(result => ({ id: result.id, Colorname: result.Colorname })),
          thumbnails: imageResults.map(result => ({ id: result.id, thumbnail: result.thumbnail }))
        };
        
        res.json(results);
      });
    });
    });
  }

  // getBrand, API: /product/brands 
  getBrand(req, res){
    const query = `SELECT * FROM brand`;
    mysql.query(query, (e, results, fields) => {
      if (e){
        console.log(e);
        res.status(500).json("Lỗi lấy dữ liệu brands!")
      } 
      res.status(200).json({results})
    });

  }

}
module.exports = new Product;