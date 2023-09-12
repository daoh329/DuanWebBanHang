const mysql = require("../../config/db/mySQL");
const createTables = require("../../config/CrTables");

class Product {
  async Addproduct(req, res) {
    const data = req.body
    const SELECTcategory = `SELECT * FROM banhangdientu.category where name = ?`
    mysql.query(SELECTcategory, data.category, (er, result) => {
      if (er) {
        res.status(500).send(`Lỗi kết nối server data`)
      }
      // PRODUCT INSERT
      const insertProductQuery = `INSERT INTO product (name, price, shortDescription, CategoryID, status) VALUES (?, ?, ?, ?, 1)`;
      const productValues = [
        data.name, data.price, data.shortDescription, result[0].id
      ]
      mysql.query(insertProductQuery, productValues, (er, resultP) => {
        if(er){
          console.log("product:"+er);
          res.status(500).send(`lỗi thêm sản phẩm: ` + er)
          
        }
        // IMG INSERT
        const newProductId = resultP.insertId;
        const insertGaleryQuery = `INSERT INTO galery (thumbnail, product_id) VALUES (?, ?)`;
        for (const image of data.images) {
          const galeryValues = [image, newProductId]
          mysql.query(insertGaleryQuery, galeryValues, (er, result) => {
            if (er) {
              console.log('img: ' + er);
            }
          })
        }
        // DETAIL PRODUCT
        const configurationString = JSON.stringify(data.configuration);
        
        const insertPdetail = 'INSERT INTO productdetails(`quantity`,`brand`,`configuration`,`description`,`product_id`)VALUES(?,?,?,?,?);'
        const PdValues = [
          data.quantity, data.brand, configurationString, data.description, newProductId
        ]
        mysql.query(insertPdetail, PdValues, (er, resultPd) => {
          if (!er) {
            // Truy vấn SQL thành công
            const idPD = resultPd.insertId;
            // COLOR INSERT
            const insertProDetailColorQuery = 'INSERT prodetailcolor (`ProductDetailId`,`Colorname`) VALUES (?,?);';
            for (const x of data.color) {
              const colorValues = [idPD, x];
              mysql.query(insertProDetailColorQuery, colorValues, (er, result) => {
                if (er) {
                  console.log('color: ' + er);
                
                }
              })
            }
            res.status(200).send('thành công')
          } else {
            // Truy vấn SQL thất bại
            console.log(er);
          }
        });
  
      })
  
    })
  }



  // const newProductId = productInsertResult.insertId;




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


}
module.exports = new Product;