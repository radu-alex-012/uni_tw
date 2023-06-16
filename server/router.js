var url = require("url");
var fs = require("fs");
var path = require("path");
const db = require("./databaseConnection.js");
const { log } = require("console");

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



      case '/homepage':
        filePath = path.join(__dirname, '..', 'html', 'homepage.html');
        break;
      default:
        filePath = path.join(__dirname, '..', req.url);
        break;
    }
  
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

function asdf(req, res) {
    if (req.method === 'POST') {
        let body = '';
    
        req.on('data', chunk => {
          body += chunk.toString();
        });
    
        req.on('end', () => {
          const formData = new URLSearchParams(body);
          const value = formData.get('value');
          const mail = formData.get('mail');
    
          const responseData = `Form data received! Value = ` + value + ', mail = ' + mail;

            console.log(responseData);
            addUser(value, mail);

            const response = 'Thank you!';
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 200;
            res.end(response);
        });
      } else {
        res.statusCode = 404;
        res.end('404 Not Found');
      }
}

function addUser(name, mail) {
    sql = "INSERT INTO users(name, mail) VALUES(?,?)";
    db.run(
        sql,
        [name, mail],
        (err) => {
            if (err) return console.error(err.message);
        }
    );
}

module.exports = handleRequest;