const path = require("path");
const fs = require("fs");

const mysql = require("../../config/db/mySQL");
const { query } = require("../../util/callbackToPromise");

class Accounts {
  // APIs
  async getAllAccounts(req, res) {
    try {
      const qr = `SELECT * FROM banhangdientu.users;`;
      const results = await query(qr);
        
      res.status(200).json(results);
    } catch (error) {
      res.status(503).json({ message: "GET_ALL_FAILED_ACCOUNTS" });
    }
  }

  async upPermission(req, res){
    try {
      const accountId = req.body.accountId; 
      const qr = `UPDATE users SET permission = 'admin' WHERE id = ?`;
      await query(qr, [accountId]);

      res.status(200).json({message: "UP_PERMISSION_SUCCESS_ACCOUNTS"});
    } catch (error) {
      console.log(error);
      res.status(503).json({ message: "UP_PERMISSION_FAILED_ACCOUNTS" });
    }
  }

  async downPermission(req, res){
    try {
      const accountId = req.body.accountId; 
      const qr = `UPDATE users SET permission = 'user' WHERE id = ?`;
      await query(qr, [accountId]);

      res.status(200).json({message: "UP_PERMISSION_SUCCESS_ACCOUNTS"});
    } catch (error) {
      console.log(error);
      res.status(503).json({ message: "UP_PERMISSION_FAILED_ACCOUNTS" });
    }
  }


}

module.exports = new Accounts();
