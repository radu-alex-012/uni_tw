var url = require("url");
var fs = require("fs");
var path = require("path");
const { log } = require("console");

let createTableData = null;

function handleRequest(req, res) {
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
      case '/submitTableDataFromHomepage':
        // filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        if (req.method === 'POST') {
          let body = '';
          
          req.on('data', (chunk) => {
            body += chunk;
          });
          
          req.on('end', () => {
            createTableData = JSON.parse(body);
            console.log('createTableData:', createTableData);
            res.statusCode = 200;
          });

          // filePath = path.join(__dirname, '..', 'html', 'createTable.html');
        } 
        filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        break;
      case '/getTableDataFromHomepage':
        if (req.method === 'GET') {
          console.log("get get get");
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



        // ----------------------------------------
      default:
        filePath = path.join(__dirname, '..', req.url);
        break;
    }

    displayPageByFilePath(req, res, filePath);
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