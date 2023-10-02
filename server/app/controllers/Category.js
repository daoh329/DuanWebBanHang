const mysql = require("../../config/db/mySQL");
const createTables = require("../../config/CrTables");

class Category{
  // '/category/add'
  async add(req,res){
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Tên danh mục không được để trống' });
      }
      const sql = 'INSERT INTO category (name) VALUES (?)';
      mysql.query(sql, [name], (error, results) => {
        if (error) {
          console.error('Lỗi khi thêm danh mục:', error);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm danh mục' });
        }
        return res.status(200).send('success');
      });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm danh mục' });
    }
  }
  // '/category/update/:id'
  async update(req,res){
    try {
      const oldname = req.params;
      const { name, } = req.body;
  
      if (!name) {
        return res.status(400).json({ message: 'Tên danh mục không được để trống' });
      }
  
      // Thực hiện truy vấn SQL để sửa danh mục trong cơ sở dữ liệu
      const sql = 'UPDATE category SET name = ? WHERE name = ?';
      mysql.query(sql, [name,oldname], (error, results) => {
        if (error) {
          console.error('Lỗi khi sửa danh mục:', error);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi sửa danh mục' });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Không tìm thấy danh mục với ID đã cho' });
        }
  
        return res.status(200).json({ message: 'Danh mục đã được sửa thành công' });
      });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi sửa danh mục' });
    }
  }
  // '/category/delete/:id'
  async delete(req,res){
    try {
      const id = req.params.id
  
      // Thực hiện truy vấn SQL để xóa danh mục từ cơ sở dữ liệu
      const sql = 'DELETE FROM category WHERE id = ?';
      mysql.query(sql, [id], (error, results) => {
        if (error) {
          console.error('Lỗi khi xóa danh mục:', error);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa danh mục' });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Không tìm thấy danh mục với ID đã cho' });
        }
  
        return res.status(200).json({ message: 'Danh mục đã được xóa thành công' });
      });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa danh mục' });
    }
  }
  // '/category'
  get(req, res){
    try {
      const sql = 'SELECT * FROM category';
      mysql.query(sql, (error, results) => {
        if (error) {
          console.error('danh mục:', error);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh mục' });
        }
        // Return the list of category as JSON.
        return res.status(200).json({ results });
      });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy tất cả danh mục' });
    }
  };
}
module.exports = new Category;