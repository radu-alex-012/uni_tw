var url = require("url");
var fs = require("fs");
var path = require("path");
const db = require("./databaseConnection.js");
const { log } = require("console");

let createTableData = null;
let tableInfoG = {name:"", data: {}};

function handleRequest(req, res) {
    let flag = true;
    let filePath;
    switch (req.url) {
      case '/': //login
        filePath = path.join(__dirname, '..', 'html', 'index.html');
        break;
      case '/forgotPassword':
        filePath = path.join(__dirname, '..', 'html', 'forgotPasswordPage.html');
        break;
      case '/newAccount':
        filePath = path.join(__dirname, '..', 'html', 'newAccountPage.html');
        break;
      case '/account':
        filePath = path.join(__dirname, '..', 'html', 'accountSettings.html');
        break;
      case '/queryTool':
        filePath = path.join(__dirname, '..', 'html', 'sql.html');
        break;
      case '/about':
        filePath = path.join(__dirname, '..', 'html', 'aboutPage.html');
        break;
      case '/help':
        filePath = path.join(__dirname, '..', 'html', 'helpPage.html');
        break;
      case '/viewTable':
        filePath = path.join(__dirname, '..', 'html', 'viewTable.html');
        break;
      case '/createTable':
        filePath = path.join(__dirname, '..', 'html', 'createTable.html');
        break;






      case '/ss':
        // filePath = path.join(__dirname, '..', 'html', 'helpPage.html');
        const asdf = require("./getTables.js");
        // asdf();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Database");
        return;
        break;



      // homepage stuff
      case '/homepage':
        filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        // displayPageByFilePath(req, res, filePath);
        break;
      case '/getTablesStructure':
            // const jsonData = {
            //   name: 'John',
            //   age: 30,
            //   city: 'New York'
            // };
            // res.setHeader('Content-Type', 'application/json');
            // res.end(JSON.stringify(jsonData));

        mor(res);

        flag = false;
        filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        break;









      case '/submitTableDataFromHomepage':
        // filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        if (req.method === 'POST') {
          let body = '';
          
          req.on('data', (chunk) => {
            body += chunk;
          });
          
          req.on('end', () => {
            createTableData = JSON.parse(body);
            // console.log('createTableData:', createTableData);
            res.statusCode = 200;
          });

          // filePath = path.join(__dirname, '..', 'html', 'createTable.html');
        } 
        filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        break;

case '/getTableDataFromHomepage':
        if (req.method === 'GET') {
          // console.log("get get get");
          res.statusCode = 200;
          // res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Content-Type', 'application/json');
          // console.log(name);
          // res.end(createTableData);

          const data = {
            name: "fffffff",
            email: "fdfdffffff"
          };
          res.end(JSON.stringify(createTableData));
          return;
        }
        //  else {
        //   res.statusCode = 404;
        //   res.end('Page not found');
        // }

        res.setHeader('Content-Type', 'text/plain');
        filePath = path.join(__dirname, '..', 'html', 'createTable.html');
        break;
        case '/deleteTable':
          flag = false;
          if (req.method === 'POST') {
            let requestData = '';
        
            req.on('data', chunk => {
              requestData += chunk;
            });
        
            req.on('end', () => {
              const receivedData = JSON.parse(requestData);
              console.log('Received data:', receivedData);

              dropTable(receivedData.tableName);
        
              // Process the received data and send a response
              const responseData = { message: 'Data received successfully!' };
        
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(responseData));
            });
          } else {
            res.statusCode = 404;
            res.end();
          }
        filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        break;

        case '/viewTABLE':
        // filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        flag=false;
        if (req.method === 'POST') {
          let requestData = '';
      
          req.on('data', chunk => {
            requestData += chunk;
          });
      
          req.on('end', () => {
            const receivedData = JSON.parse(requestData);
            console.log('Received data:', receivedData);

            
            // Process the received data and send a response
            const responseData = { message: 'Data received successfully!' };
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(responseData));

            viewTableFunction(receivedData.tableName, (err, jsonData) => {
              if (err) {
                console.error(err.message);
                return;
              }
              
              saveTabData(jsonData, receivedData.tableName);
            });
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
        filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        break;

        case '/getTableInfo':
          if (req.method === 'GET') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
  
            console.log("importatnt " + tableInfoG);
            res.end(tableInfoG);
            tableInfoG = {name:"", data: {}};
            return;
          }
  
          res.setHeader('Content-Type', 'text/plain');
          filePath = path.join(__dirname, '..', 'html', 'createTable.html');
          break;
            break;



























        case '/dataCreateTable':
          if (req.method === 'POST') {
            let requestData = '';
        
            req.on('data', chunk => {
              requestData += chunk;
            });
        
            req.on('end', () => {
              const receivedData = JSON.parse(requestData);
              // console.log('Received data:', receivedData);
              createTableDataFunc(receivedData);
        
              // Process the received data and send a response
              const responseData = { message: 'Data received successfully!' };
        
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(responseData));
            });
          } else {
            res.statusCode = 404;
            res.end();
          }
          flag = false;
        filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        break;

        // ----------------------------------------
      default:
        filePath = path.join(__dirname, '..', req.url);
        break;
    }

    if (flag){
      displayPageByFilePath(req, res, filePath);
    }
    flag = true;
  }

module.exports = handleRequest;

function displayPageByFilePath(req, res, filePath) {
  // console.log("displayPageByFilePath");

  const fileExt = path.extname(filePath).toLowerCase();
    let contentType = 'text/plain';
  
    switch (fileExt) {
      case '.html':
        contentType = 'text/html';
        break;
      case '.css':
        filePath = path.join(__dirname, '..', 'javaa', path.basename(req.url));
        contentType = 'text/css';
        break;
      case '.js':
        filePath = path.join(__dirname, '..', 'javascript', path.basename(req.url));
        contentType = 'text/javascript';
        break;
      case '.svg':
        filePath = path.join(__dirname, '..', 'img', 'icons', path.basename(req.url));
        contentType = 'image/svg+xml';
        break;
    }
  
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // if (err.code === 'ENOENT' && fileExt === '.html') {
        if (err.code === 'ENOENT') {
          // Serve custom "Page Not Found" HTML page
          const notFoundFilePath = path.join(__dirname, '..', 'html', 'pageNotFound.html');
          fs.readFile(notFoundFilePath, (err, notFoundData) => {
            if (err) {
              res.statusCode = 404;
              res.end('File not found');
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/html');
              res.end(notFoundData);
            }
          });
        } else {
          res.statusCode = 404;
          // 
          res.end('File not found - 2');
          // 
        }
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
      }
    });
}

function createTableDataFunc(data) {
  let sql = generateCreateTableQuery(data);
  // console.log("sql " + sql);
  
  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created successfully.');
    }
  });
}

function generateCreateTableQuery(tableDetails) {
  const { tableName, columnsList } = tableDetails;

  let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
  columnsList.forEach((column, index) => {
    const { name, type, length, defaultValue, notNull, pk, fk, autoIndex } = column;
    createTableQuery += `${name} ${type}`;
    if (length) {
      createTableQuery += `(${length})`;
    }
    if (defaultValue) {
      if (type === "VARCHAR" || type === "TEXT") {
        createTableQuery += ` DEFAULT \'${defaultValue}\'`;
      } else {
        createTableQuery += ` DEFAULT ${defaultValue}`;
      }
    }
    if (notNull) {
      createTableQuery += ' NOT NULL';
    }
    if (pk) {
      createTableQuery += ' PRIMARY KEY';
    }
    if (fk) {
      createTableQuery += ' FOREIGN KEY';
    }
    if (autoIndex) {
      createTableQuery += ' AUTOINCREMENT';
    }
    if (index < columnsList.length - 1) {
      createTableQuery += ', ';
    }
  });
  createTableQuery += ')';

  return createTableQuery;
}




// -----------
function getTableInfo(db, tableName) {
  return new Promise((resolve, reject) => {
    const columnQuery = `
      PRAGMA table_info('${tableName}');
    `;

    // Execute the column query
    db.all(columnQuery, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const tableInfo = {
        name: tableName,
        columns: []
      };

      rows.forEach(row => {
        const columnInfo = {
          name: row.name,
          type: row.type,
          defaultValue: row.dflt_value,
          primaryKey: row.pk === 1,
          foreignKey: row.pk === 0 && row.notnull === 1,
          autoIncrement: row.pk === 1 && row.autoinc === 1
        };

        tableInfo.columns.push(columnInfo);
      });

      resolve(tableInfo);
    });
  });
}

function mor(res) {
  const query = `
    SELECT name
    FROM sqlite_master
    WHERE type = 'table';
  `;
  
  // Execute the query
  db.all(query, async (err, tables) => {
    if (err) {
      console.error(err.message);
      return;
    }
  
    // Store table information in a JSON object
    const databaseInfo = {
      tables: []
    };
  
    try {
      // Retrieve column information for each table
      for (const table of tables) {
        const tableInfo = await getTableInfo(db, table.name);
        databaseInfo.tables.push(tableInfo);
      }
  
      // Print the database information as JSON
      // console.log(JSON.stringify(databaseInfo, null, 2));

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(databaseInfo));
      
    } catch (error) {
      console.error(error.message);
    }
  });
}

function dropTable(name){
  let sql = "DROP TABLE IF EXISTS " + name + ";";

  db.run(sql, function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Table '${name}' deleted successfully.`);
    }
  });
}

function viewTableFunction(tableName, callback) {
  db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
    if (err) {
      console.error(err.message);
      return callback(err, null);
    }
  
    const jsonData = {
      data: rows
    };
  
    const jsonString = JSON.stringify(jsonData);
    callback(null, jsonString);
  });
}




function saveTabData(data, name) {
  tableInfoG.name = name;
  // tableInfoG.data = JSON.parse(data);
  tableInfoG.data = JSON.parse(data);
  tableInfoG = JSON.stringify(tableInfoG);
  // console.log(JSON.parse(data));

  // console.log("tableInfoG" + JSON.stringify(tableInfoG));
  console.log("tableInfoG" + tableInfoG);
}