const mysql = require("../../config/db/mySQL");
const createTables = require("../../config/CrTables");

class List {
    // '/List/add/:table'
    async add(req, res) {
        try {
            const table = req.params.table
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Tên danh mục không được để trống' });
            }
            const sql = `INSERT INTO ${table} (name) VALUES (?)`;
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
    // '/List/update/:table'
    async update(req, res) {
        try {
            const table = req.params.table;
            // Thực hiện truy vấn SQL để sửa danh mục trong cơ sở dữ liệu
            const sql = `UPDATE ${table} SET name = ? WHERE name = ?`;
            mysql.query(sql, req.body, (error, results) => {
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
    // '/List/delete/:table/:key'
    async delete(req, res) {
        try {
            const { table, key } = req.params

            // Thực hiện truy vấn SQL để xóa danh mục từ cơ sở dữ liệu
            const sql = `DELETE FROM ${table} WHERE name = ?`;
            mysql.query(sql,[key], (error, results) => {
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
    // '/List/:table'
    get(req, res) {
        try {
            const table = req.params.table
            const sql = `SELECT * FROM ${table}`;
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
module.exports = new List;