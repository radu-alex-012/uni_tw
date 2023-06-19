const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

function executeSQLQuery(sql) {
  return new Promise((resolve, reject) => {
    const dbFile = "query.db";
    const dbExists = fs.existsSync(dbFile);

    if (dbExists) {
        console.log('Deleting the old query.db file and install a new one..');
      fs.unlinkSync(dbFile); // Delete the existing database file
    }

    const db = new sqlite3.Database(dbFile);

    db.serialize(() => {
      const statements = sql.split(/;\r?\n/);

      const results = [];

      statements.forEach((statement) => {
        const trimmedStatement = statement.trim();
        if (trimmedStatement) {
          db.run(trimmedStatement, (error) => {
            if (error) {
              results.push({ success: false, error: error.message });
            } else {
              results.push({ success: true, statement: trimmedStatement });
            }

            if (results.length === statements.length) {
              resolve(formatOutput(results));
            }
          });
        }
      });
    });

    db.close();
  });
}

function formatOutput(results) {
  let output = "";

  results.forEach((result) => {
    const statement = result.success ? result.statement : "Invalid statement";
    output += `${statement}\n`;
    if (result.error) {
      output += `Error: ${result.error}\n`;
    }
  });

  return output.trim();
}

module.exports = { executeSQLQuery};