const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
    console.log("Connected to database.");
});

module.exports = db;