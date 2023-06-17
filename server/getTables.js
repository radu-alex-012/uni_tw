const db = require("./databaseConnection.js");

// PRAGMA table_info("table1"); // toate datele despre tabel (cid, name, type, notnull, dflt_value, pk)
// SELECT name FROM pragma_table_info("table1");
// SELECT type, name, tbl_name, rootpage, sql FROM sqlite_schema where tbl_name = 'table1';

// column ID (CID)
// name (column name)
// type (data type)
// notnull 
// dflt_value
// pk

// - bob_r
//     -db1.db
// - teo 
//     -db2.db
//     -db2.db
//     -db2.db


// IMPORTANT PENTRU FOREIGN KEY 
// foreign key -> PRAGMA foreign_key_list("table1");
// The result set will typically include columns like id (constraint ID), seq (sequence number of the column in the constraint), table (name of the referenced table), from (name of the column in the current table), and to (name of the referenced column in the referenced table).
// The table and from columns in the result set will provide you with the information about the foreign key constraints, including the referenced table and the column in the current table.
// By executing the PRAGMA statement with foreign_key_list, you can retrieve the foreign key constraints of the specified table, including the referenced table and the columns involved in the foreign key relationships.





// function getAllTables() {
//     const query = "SELECT name FROM sqlite_master WHERE type='table'";

//     db.all(query, (err, rows) => {
//     if (err) {
//         console.error(err.message);
//     } else {
//         console.log('Tables in the database:');
//         rows.forEach((row) => {
//         console.log(row.name);
//         });
//     }
//     });

//     db.close((err) => {
//         if (err) {
//           console.error(err.message);
//         } else {
//           console.log('Disconnected from the database.');
//         }
//       });
      
//       return "adfff";
// }

// module.exports = getAllTables;