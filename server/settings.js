const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const db = new sqlite3.Database('./db/user.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the user database from inside settings.js.');
  }
});

// Validate the password
function validatePassword(username, oldPassword, newPassword, confirmPassword, callback) {
  console.log('Validating password...');
  const query = `SELECT password FROM user_login WHERE username = ?`;
  db.get(query, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      callback(err);
    } else {
      if (row) {
        const storedPassword = row.password;
        console.log('Stored Password:', storedPassword);

        // Validate the password
        if (storedPassword === oldPassword) {
          console.log('Old password matched');
          // Update the password in the database
          const updateQuery = `UPDATE user_login SET password = ? WHERE username = ?`;
          db.run(updateQuery, [newPassword, username], (err) => {
            if (err) {
              console.error(err.message);
              callback(err);
            } else {
              console.log('Password updated successfully');
              callback(null, true, 'Password updated successfully');
            }
          });
        } else {
          console.log('Old password mismatch');
          callback(null, false, 'Old password mismatch');
        }
      } else {
        console.log('User not found');
        callback(null, false, 'User not found');
      }
    }
  });
}

// Delete the account
function deleteAccount(username, callback) {
  console.log('Deleting account...');
  const deleteQuery = `DELETE FROM user_login WHERE username = ?`;
  db.run(deleteQuery, [username], function (err) {
    if (err) {
      console.error(err.message);
      callback(err);
    } else {
      console.log(`Account deleted successfully. Rows affected: ${this.changes}`);
      // TODO:Additional clean-up operations (delete associated data)
      callback(null);
    }
  });
}

module.exports = { validatePassword, deleteAccount };
