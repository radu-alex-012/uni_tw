// ./loginFile/login.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/user.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the user database.');
});

function checkLogin(username, password, callback) {
    const sql = `SELECT * FROM user_login WHERE username = ? AND password = ?`;
    db.get(sql, [username, password], (err, row) => {
      if (err) {
        callback(err, false);
      } else {
        // If a matching row is found, the login is successful
        const success = row ? true : false;
        callback(null, success);
      }
    });
  }
  
  module.exports = { checkLogin };
  