const { query } = require("../../util/callbackToPromise");

class PhieuGiamGia {
   // Add discount code
   async add(req, res) {
      const data = req.body;
      try {
         // Update query with new column names and data types
         const insertQuery = `
         INSERT INTO discount_code (code, value_vnd, value_percent, start_date, end_date)
         VALUES (?, ?, ?, ?, ?)
       `;
         const insertValues = [
            data.code,
            data.value_vnd,
            data.value_percent,
            data.start_date,
            data.end_date,
         ];
         await query(insertQuery, insertValues);
         res.status(200).send("Discount code added successfully");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }

   // Set discount code end date current
   async setEnd(req, res) {
      const { id } = req.params;
      try {
         // Update query to update status column
         const updateQuery = `
         UPDATE discount_code
         SET end_date = Now()
         WHERE id = ?
       `;
         await query(updateQuery, [id]);
         res.status(200).send("Discount code set End");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }

   // Update discount code
   async update(req, res) {
      const { id } = req.params;
      const data = req.body;
      try {
         // Update query with new column names and data types
         const updateQuery = `
         UPDATE discount_code
         SET
           code = ?,
           value_vnd = ?,
           value_percent = ?,
           start_date = ?,
           end_date = ?
         WHERE id = ?
       `;
         const updateValues = [
            data.code,
            data.value_vnd,
            data.value_percent,
            data.start_date,
            data.end_date,
            id,
         ];
         await query(updateQuery, updateValues);
         res.status(200).send("Discount code updated successfully");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }

   // Get all discount codes
   async get(req, res) {
      try {
         // Select all columns from the updated table
         const getQuery = `
         SELECT *
         FROM discount_code
       `;
         const results = await query(getQuery);
         if (results.length > 0) {
            res.status(200).json(results);
         } else {
            res.status(404).send("No discount codes found");
         }
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }

   // Add product to discount code
   async addSanPhamOnDiscountCode(req, res) {
      const { products_id, discountCode_id } = req.body;
    
      try {
        // 1. Check for existing duplicate before inserting
        const checkQuery = `
          SELECT * FROM sanpham_discountCode
          WHERE products_id = ? AND discountCode_id = ?
        `;
        const checkValues = [products_id, discountCode_id];
    
        const existingData = await query(checkQuery, checkValues);
    
        if (existingData.length > 0) {
          // Duplicate found, return error
          return res.status(409).send("Duplicate entry found. Product already linked to this discount code.");
        }
    
        // 2. No duplicate found, proceed with insertion
        const insertQuery = `
          INSERT INTO sanpham_discountCode (products_id, discountCode_id)
          VALUES (?, ?)
        `;
        const insertValues = [products_id, discountCode_id];
    
        await query(insertQuery, insertValues);
    
        res.status(200).send("Product added to Discount Code successfully");
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }

   // Remove product from discount code
   async deleteSanPhamOnDiscountCode(req, res) {
      const { products_id, discountCode_id } = req.body;
      // console.log("product_id: ", product_id);
      // console.log("discountCode_id: ", discountCode_id);
      // return res.json("abc");
      try {
         const deleteQuery = `
            DELETE FROM sanpham_discountCode
            WHERE products_id = ? AND discountCode_id = ?;
        `;

         await query(deleteQuery, [products_id, discountCode_id]);

         res.status(200).send("Product removed from Discount Code successfully");
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }
   // Get all products associated with a discount code
   async getSanPhamOnDiscountCode(req, res) {
      const { id } = req.params;
      try {
         const getQuery = `
       SELECT products_id
       FROM sanpham_discountCode
       WHERE discountCode_id = ?
     `;
         const results = await query(getQuery, [id]);
         const productIds = results.map((product) => product.products_id);
         if (productIds.length > 0) {
            res.status(200).json(productIds);
         } else {
            res.status(404).send("No products associated with this discount code");
         }
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }

   // Get all products associated with a product
   async getSanPhamOnDiscountCodeByIdSanPham(req, res) {
      const { sanpham_id } = req.params;
      try {
         // Use new table name and column names
         const getQuery = `
       SELECT *
       FROM sanpham_discountCode
       WHERE sanpham_id = ?
     `;
         const results = await query(getQuery, [sanpham_id]);
         if (results.length > 0) {
            res.status(200).json(results);
         } else {
            res.status(404).send("No products associated with this product");
         }
      } catch (error) {
         console.error(error);
         res.status(500).send("Internal Server Error");
      }
   }

   // /discout/check-unique
   async checkUnique (req, res) {
      try {
         const code = req.body.code;
         const qr = `SELECT COUNT(*) as count FROM discount_code WHERE code = ?`
         const result = await query(qr, [code]);
         console.log(code);
         if (result[0].count === 0) {
            return res.status(200).json({ message: "Does not exist" });
          } else {
            return res.status(200).json({ message: "Already exist" });
          }
      } catch (error) {
         res.status(500).json({message: "Check discount code failure"})
      }
   }
}
module.exports = new PhieuGiamGia();