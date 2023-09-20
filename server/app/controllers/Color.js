const mysql = require("../../config/db/mySQL");

class Color {
  // '/color/add'
  async add(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Tên màu không được để trống' });
      }

      const sql = 'INSERT INTO colors (name) VALUES (?)';
      mysql.query(sql, [name], (error, results) => {
        if (error) {
          console.error('Lỗi khi thêm màu:', error);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm màu' });
        }
        return res.status(201).json({ message: 'Màu đã được thêm thành công'});
      });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm màu' });
    }
  }

  // '/color/update/:oldname'
  async update(req, res) {
    try {
      const { olname } = req.params;
      const { nwname } = req.body;

      if (!nwname) {
        return res.status(400).json({ message: 'Tên màu không được để trống' });
      }

      const sql = 'UPDATE colors SET name = ? WHERE name = ?';
      mysql.query(sql, [nwname, olname], (error, results) => {
        if (error) {
          console.error('Lỗi khi sửa màu:', error);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi sửa màu' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Không tìm thấy màu với tên cũ đã cho' });
        }

        return res.status(200).json({ message: 'Màu đã được sửa thành công' });
      });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi sửa màu' });
    }
  }

  // '/color/delete/:name'
  async delete(req, res) {
    try {
      const { name } = req.params;

      const sql = 'DELETE FROM colors WHERE name = ?';
      mysql.query(sql, [id], (error, results) => {
        if (error) {
          console.error('Lỗi khi xóa màu:', error);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa màu' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Không tìm thấy màu với ID đã cho' });
        }

        return res.status(200).json({ message: 'Màu đã được xóa thành công' });
      });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa màu' });
    }
  }

  // '/color/get'
  async get(req, res) {
    try {
      const sql = 'SELECT * FROM colors';
      mysql.query(sql, (error, results) => {
        if (error) {
          console.error('Danh sách màu:', error);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách màu' });
        }

        return res.status(200).json({ message: 'Danh sách màu đã được lấy thành công', colors: results });
      });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách màu' });
    }
  }
}

module.exports = new Color;
