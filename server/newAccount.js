const sqlite3 = require('sqlite3').verbose();

// Function to check if a username already exists in the database
function isUsernameTaken(username, callback) {
  const db = new sqlite3.Database('../db/user.db');

  db.get('SELECT username FROM user_login WHERE username = ?', username, (err, row) => {
    db.close();

    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      const isTaken = row ? true : false;
      callback(null, isTaken);
    }
  });
}

// Function to register a new user
function registerUser(username, password, callback) {
  const db = new sqlite3.Database('../db/user.db');

  db.run('INSERT INTO user_login (username, password) VALUES (?, ?)', [username, password], function (err) {
    db.close();

    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      // The row ID of the inserted record can be accessed via the `this.lastID` property
      const userId = this.lastID;
      callback(null, userId);
    }
  });
}

module.exports = { isUsernameTaken, registerUser };
