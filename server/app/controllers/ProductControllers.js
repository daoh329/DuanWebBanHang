const mysql = require("../../config/db/mySQL");
const createTables = require("../../config/CrTables");

class Product{
    async Addlaptop(res,req){
        const data = req.body;
        console.log(data);
        if (!data) {
            return res.status(400).json("Invalid data");
        }
        // CODE TẠO BẢNG TABLE TRONG MYSQL
        // createTables.Laptop
        // createTables.image_url
        const imageUrls = data.image;
        const dataLaptop = [
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
            data.status
        ];
        const query = `INSERT INTO laptop (
            name,
            price,
            quantity,
            brand,
            series,
            CPU,
            GPU,
            VGA,
            ram,
            Screen_size,
            Screen_resolution,
            OS,
            mass,
            Production_Date,
            Entry_Date,
            status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Thực hiện truy vấn SQL
        mysql.query(query, dataLaptop, (error, results, fields) => {
        if (error) {
            // Trả về mã trạng thái 500 nếu có lỗi xảy ra
            res.status(500).send("Bug khi đẩy lên database");
        } else {
            // Trả về mã trạng thái 200 nếu thêm thông tin cá nhân thành công
            
            imageUrls.forEach((imageUrl) => {
                const imageSql = `
                  INSERT INTO image_url (image_url, laptop_id, dienthoai_id)
                  VALUES (?, ?, ?)
                `;
              
                const values = [imageUrl, laptopId]; // Thay thế laptopId và dienthoaiId bằng các giá trị thích hợp
              
                mysql.query(imageSql, values, (err, imageResult) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Image added successfully for laptop with ID', laptopId);
                  }
                });
              });
              console.log('Laptop and images added successfully');
              res.status(200).send("Thêm thông tin cá nhân thành công");
        }
        });

    }
}
module.exports = new Product