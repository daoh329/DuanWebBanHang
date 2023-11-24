const { query } = require("../../util/callbackToPromise");

class PhieuGiamGia {
   async add(req, res) {
      const data = req.body;
      try {
         const insertQuery = `
          INSERT INTO discount_code (name, value_vnd, value_percent, start_date, end_date)
          VALUES (?, ?, ?, ?, ?)
        `;
         const insertValues = [
            data.name,
            data.value_vnd,
            data.value_percent,
            data.start_date,
            data.end_date,
         ];
         const result = await query(insertQuery, insertValues);
         res.status(200).send("success");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   async setStaus(req, res) {
      const { id } = req.params;
      try {
         const updateQuery = `
       UPDATE discount_code
       SET status = 'fault'
       WHERE id = ?`;
         const result = await query(updateQuery, [id]);
         res.status(200).send("Status set to 'fault'");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   async update(req, res) {
      const { id } = req.params;
      const data = req.body;
      try {
         const updateQuery = `
          UPDATE discount_code
          SET 
            name = ?,
            value_vnd = ?,
            value_percent = ?,
            start_date = ?,
            end_date = ?
          WHERE id = ?
        `;
         const updateValues = [
            data.name,
            data.value_vnd,
            data.value_percent,
            data.start_date,
            data.end_date,
            id,
         ];
         const result = await query(updateQuery, updateValues);
         res.status(200).send("Discount code updated successfully");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   async get(req, res) {
      try {
         const getQuery = `
          SELECT * FROM discount_code
        `;
         const result = await query(getQuery);
         if (result.length > 0) {
            res.status(200).json(result);
         } else {
            res.status(404).send("Discount code not found");
         }
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   async addSanPhamOnDiscountCode(req, res) {
      const { sanpham_id, discountCode_id } = req.body;

      try {
         const insertQuery = `
          INSERT INTO sanpham_discountCode (sanpham_id, discountCode_id)
          VALUES (?, ?)
        `;
         const insertValues = [sanpham_id, discountCode_id];

         const result = await query(insertQuery, insertValues);

         res.status(200).send("Product added to Discount Code successfully");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   async deleteSanPhamOnDiscountCode(req, res) {
      const { sanpham_id, discountCode_id } = req.body;

      try {
         const deleteQuery = `
          DELETE FROM sanpham_discountCode
          WHERE sanpham_id = ? AND discountCode_id = ?
        `;
         const deleteValues = [sanpham_id, discountCode_id];

         const result = await query(deleteQuery, deleteValues);

         res.status(200).send("Product removed from Discount Code successfully");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   async getSanPhamOnDiscountCode(req, res) {
      try {
         const getQuery = `
          SELECT * FROM sanpham_discountCode
        `;
         const result = await query(getQuery);

         res.status(200).json(result);
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   async getSanPhamOnDiscountCodeByIdSanPham(req, res) {
      try {
         const sanphamId = req.params.id;
         const getQuery = `
          SELECT * FROM sanpham_discountCode
          WHERE sanpham_id = ?
        `;
         const result = await query(getQuery, [sanphamId]);

         res.status(200).json(result);
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   async getSanPhamOnDiscountCodeByIdDiscountCode(req, res) {
      try {
         const discountCodeId = req.params.id;
         const getQuery = `
          SELECT * FROM sanpham_discountCode
          WHERE discountCode_id = ?
        `;
         const result = await query(getQuery, [discountCodeId]);

         res.status(200).json(result);
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
}
module.exports = new PhieuGiamGia();