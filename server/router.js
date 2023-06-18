var url = require("url");
var fs = require("fs");
var path = require("path");
const db = require("./databaseConnection.js");
const { log } = require("console");

//...
const { checkLogin } = require('../loginFile/login');
const { validatePassword } = require('./settings');
const { deleteAccount } = require('./settings');
const { registerUser } = require('./newAccount');
const { isUsernameTaken } = require('./newAccount');

let createTableData = null;
let tableInfoG = {name:"", data: {}};

function handleRequest(req, res) {
  const cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const name = parts[0].trim();
      const value = parts[1].trim();
      cookies[name] = value;
    });
  }

  // Assign the parsed cookies to req.cookies
  req.cookies = cookies;

  
    let flag = true;
    let filePath;
    switch (req.url) {
      case '/': //login
        filePath = path.join(__dirname, '..', 'html', '../loginFile/loginPage.html');
        if(req.method === 'POST'){
          flag = false;
          // Handle the login form submission
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            const { username, password } = JSON.parse(body);
         
            // Call the server-side login function and send the response
            checkLogin(username, password, (err, success) => {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false }));
              } else {
                if (success) {
                  // Save the username in a cookie
                  res.setHeader('Set-Cookie', `username=${username}; Path=/; HttpOnly`);
                  res.statusCode = 302;
                  res.setHeader('Location', '/homepage');
                  res.end();
                } else {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success }));
                }
              }
            });
          });
                 }
        break;
      case '/login': //login
    
        filePath = path.join(__dirname, '..', 'html', '../loginFile/loginPage.html');
        if(req.method === 'POST'){
          flag = false;
 // Handle the login form submission
 let body = '';
 req.on('data', (chunk) => {
   body += chunk;
 });
 req.on('end', () => {
   const { username, password } = JSON.parse(body);

   // Call the server-side login function and send the response
   checkLogin(username, password, (err, success) => {
     if (err) {
       console.error(err);
       res.statusCode = 500;
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify({ success: false }));
     } else {
       if (success) {
         // Save the username in a cookie
         res.setHeader('Set-Cookie', `username=${username}; Path=/; HttpOnly`);
         res.statusCode = 302;
         res.setHeader('Location', '/homepage');
         res.end();
       } else {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify({ success }));
       }
     }
   });
 });
        }
        break;
      case '/forgotPassword':
        filePath = path.join(__dirname, '..', 'html', 'forgotPasswordPage.html');
        break;
      case '/newAccount':
        filePath = path.join(__dirname, '..', 'html', '../loginFile/newAccountPage.html');
        if(req.method == "POST"){
          flag = false;
          let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);

      // Check if the username is already taken
      isUsernameTaken(username, (err, taken) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Server error' }));
        } else if (taken) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Username already taken' }));
        } else {
          // Register the new user
          registerUser(username, password, (err, userId) => {
            if (err) {
              console.error(err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, message: 'Server error' }));
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Registration successful' }));
            }
          });
        }
      });
    });
        }
        break;
      case '/settings':
        filePath = path.join(__dirname, '..', 'html', '../loginFile/accountSettings.html');
        if(req.method == 'GET' && !req.cookies.username){
          flag = false;
          res.statusCode = 302;
          res.setHeader('Location', '/login');
          res.end();
          return;
        }
        // Access the parsed cookies
        console.log('Cookies:', req.cookies);
        if(req.method == 'POST'){
          flag = false;let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            const { old_password, new_password, confirm_password } = JSON.parse(body);
            const username = req.cookies.username;
      
            // Call the validatePassword function and send the response
            validatePassword(username, old_password, new_password, confirm_password, (err, success, message) => {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false }));
              } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success, message }));
              }
            });
          });
        }
        break;
      case '/updatePassword':
        console.log('Cookies:', req.cookies);
        if(req.method == 'POST' ){
          flag = false;
          const username = req.cookies.username;
          let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const { old_password, new_password, confirm_password } = JSON.parse(body);
      const username = req.cookies.username;

      // Call the validatePassword function and send the response
      validatePassword(username, old_password, new_password, confirm_password, (err, success, message) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false }));
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success, message }));
        }
      });
    });
        }
        break; 
      case '/deleteAccount':
        if(req.method == 'POST'){
          flag = false;
           // Handle the delete account request
    const username = req.cookies.username;
    console.log("start the proccess of deleting the account..");
      // Call the deleteAccount function from settings.js and send the response
      deleteAccount(username, (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false }));
        } else {
          // Clear the username cookie
          res.setHeader('Set-Cookie', `username=; Path=/; HttpOnly; Max-Age=0`);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        }
      });
        }
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
        if(req.method == 'GET' && !req.cookies.username){
          flag = false;
          res.statusCode = 302;
          res.setHeader('Location', '/login');
          res.end();
          return;
        }
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
        case '/cssNewAccountPage.css':
          filePath =  path.join(__dirname, '..', 'loginFile', 'cssNewAccountPage.css');
          break;
        // ----------------------------------------
        case '/getAllData':
        if (req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');

          getAllDAta(db, res);
          return;
        }

        res.setHeader('Content-Type', 'text/plain');
        filePath = path.join(__dirname, '..', 'html', 'createTable.html');
        break;
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

function getAllDAta(db, res) {
  const query = `SELECT name FROM sqlite_master WHERE type='table';`;

// Execute the query
db.all(query, (err, tables) => {
if (err) {
  console.error(err);
  return;
}

const tableData = {};

// Iterate through each table
tables.forEach((table) => {
  const tableName = table.name;

  // Query to retrieve columns for the table
  const columnsQuery = `PRAGMA table_info(${tableName});`;

  // Execute the query to retrieve columns
  db.all(columnsQuery, (err, columns) => {
  if (err) {
      console.error(err);
      return;
  }

  const rowsQuery = `SELECT * FROM ${tableName};`;

  db.all(rowsQuery, (err, rows) => {
      if (err) {
      console.error(err);
      return;
      }
      tableData[tableName] = {
      columns: columns,
      rows: rows
      };
      if (Object.keys(tableData).length === tables.length) {
      // Display the JSON variable
      // console.log(JSON.stringify(tableData, null, 2));
      res.end(JSON.stringify(tableData, null, 2));
    }
  });
});
});
});
}