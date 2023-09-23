const mysql = require('../config/db/mySQL');

const query = (query, params) => {
    return new Promise((resolve, reject) => {
      mysql.query(query, params, (error, results, fields) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  };

  module.exports = { query }