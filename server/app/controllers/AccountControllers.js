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
}

module.exports = new Accounts();
