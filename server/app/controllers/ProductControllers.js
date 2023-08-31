const mysql = require("../../config/db/mySQL");
const createTables = require("../../config/CrTables");

class Product{
    async Addproduct(req,res){

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
      let table = '';
      let values = [];
  
      if (data.type === 'laptop') {
        table = 'laptop';
        values = [
          data.name,
          data.price,
          data.quantity,
          data.brand,
          data.series,
          data.CPU,
          data.GPU,
          data.VGA,
          data.ram,
          data.Screen_size,
          data.Screen_resolution,
          data.OS,
          data.mass,
          data.Production_Date,
          data.Entry_Date,
          data.color,
          data.status
        ];
      } else if (data.type === 'phone') {
        table = 'phone';
        values = [
          data.name,
          data.price,
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
          data.quantity,
          data.status
        ];
      }
  
      const query = `INSERT INTO ${table} (
          name,
          price,
          ${table === 'laptop' ? 'quantity,' : ''}
          brand,
          series,
          CPU,
          GPU,
          VGA,
          ram,
          Screen_size,
          Screen_resolution,
          OS,
          ${table === 'laptop' ? 'mass,' : ''}
          Production_Date,
          Entry_Date,
          ${table === 'laptop' ? 'color,' : ''}
          status
        ) VALUES (${table === 'laptop' ? '?, ' : ''}?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${table === 'laptop' ? '?, ' : ''}?, ?, ${table === 'laptop' ? '?, ' : ''}?)`;
  
      // Thực hiện truy vấn SQL
      mysql.query(query, values, (error, results, fields) => {
        if (error) {
          // Trả về mã trạng thái 500 nếu có lỗi xảy ra
          res.status(500).send("Bug khi đẩy lên database");
        } else {
          // Trả về mã trạng thái 200 nếu thêm thông tin thành công
          const newId = results.insertId; // Lấy ID mới được tạo tự động
          console.log("Thêm dữ liệu thành công. ID mới:", newId);
  
          if (table === 'laptop' || table === 'phone') {
            imageUrls.forEach((imageUrl) => {
              const imageSql = `
                INSERT INTO image_url (image_url, ${table === 'laptop' ? 'laptop_id' : 'phone_id'})
                VALUES (?, ?)
              `;
            
              const imageValues = [imageUrl, newId];
            
              mysql.query(imageSql, imageValues, (err, imageResult) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Image added successfully for', table, 'with ID', newId);
                }
              });
            });
          }
          console.log(table, 'and images added successfully');
          res.status(200).send("Thêm thông tin thành công");
        }
      });
    }
  }
module.exports = new Product;