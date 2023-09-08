const mysql = require("../../config/db/mySQL");
const createTables = require("../../config/CrTables");

class Product{
    async Addproduct(req,res){
      // API: /product/Add


    // CODE TẠO BẢNG TABLE TRONG MYSQL
    // createTables.createLaptopTable
    // createTables.createPhoneTable
    // createTables.createImageUrlTable


      const data = req.body;
    console.log(data);
    if (!data) {
      return res.status(400).json("Invalid data");
    }
    
    
    
    const imageUrls = data.image;
      let Type = data.Type;
      let product = [
        data.name,data.price,data.quantity,data.Entry_Date,Type
      ]
      const query = `INSERT INTO product (name, price, quantity, Entry_Date, Type, status)
      VALUES (?, ?, ?, ?, ?, 'available')`;
      let values = [];
  
      if (Type === 'laptop') {
        values = [
          data.brand,
          data.warranty,
          data.series,
          data.CPU,
          data.GPU,
          data.ram,
          data.Screen,
          data.Storage,
          data.OS,
          data.mass,
          data.color,
        ];
      } else if (Type === 'phone') {
        values = [
          data.ram,
          data.rom,
          data.brand,
          data.color,
          data.series,
          data.OS,
          data.fast_charging,
          data.camera_main,
          data.camera_selfie,
          data.screen,
          data.battery_life,
          data.Chip,
        ];
      }
      // Thực hiện truy vấn SQL
      mysql.query(query, product, (error, results, fields) => {
        if (error) {
          // Trả về mã trạng thái 500 nếu có lỗi xảy ra
          console.log(error);
          res.status(500).send("Bug khi đẩy lên database 'product'");
        } else {
          // Trả về mã trạng thái 200 nếu thêm thông tin thành công
          const newId = results.insertId; // Lấy ID mới được tạo tự động
          console.log("Thêm dữ liệu thành công. ID mới:", newId);
          const imageSql = `
                INSERT INTO image_url (image_url, product_id)
                VALUES (?, ?)
              `;
          if (Type === 'laptop' || Type === 'phone') {
            if(Type === 'laptop'){
              const Sql=`INSERT INTO laptop (id, brand, warranty, series, CPU, GPU, ram, Screen, Storage, OS, mass, color)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              mysql.query(Sql,[newId, ...values],(error, results, fields)=>{
                if(error){
                  console.log(error);
                  res.status(500).send("Bug khi đẩy lên database 'laptop'");
                }
              })
            }else if(Type === 'phone'){
              const Sql=`INSERT INTO phone (id, ram, rom, brand, color, series, OS, fast_charging, camera_main, camera_selfie, screen, battery_life, Chip)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              mysql.query(Sql,[newId, ...values],(error, results, fields)=>{
                if(error){
                  console.log(error);
                  res.status(500).send("Bug khi đẩy lên database 'phone'");
                }
              })
            }
            imageUrls.forEach((imageUrl) => {
              
            
              const imageValues = [imageUrl, newId];
            
              mysql.query(imageSql, imageValues, (err, imageResult) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Image added successfully for', Type, 'with ID', newId);
                }
              });
            });
          }
          console.log(Type, 'and images added successfully');
          res.status(200).send("Thêm thông tin thành công");
        }
      });
    }
    async json(req,res){
      // API: /product/json
      console.log('runjsonP');
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