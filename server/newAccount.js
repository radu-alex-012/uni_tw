//const sqlite3 = require('sqlite3').verbose();
const dbUser = require('../server/databaseConnection');


// Function to check if a username already exists in the database
function isUsernameTaken(username, callback) {
  db.get('SELECT username FROM user_login WHERE username = ?', username, (err, row) => {
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
  isUsernameTaken(username, (err, isTaken) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else if (isTaken) {
      const error = new Error('Username is already taken');
      callback(error, null);
    } else {
      db.run('INSERT INTO user_login (username, password) VALUES (?, ?)', [username, password], function (err) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          // The row ID of the inserted record can be accessed via the `this.lastID` property
          const userId = this.lastID;
          callback(null, userId, true);
        }
      });
    }
  });
}

module.exports = { isUsernameTaken, registerUser };
