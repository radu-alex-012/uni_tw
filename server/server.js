const http = require('http');
const fs = require('fs');
const path = require('path');
const { checkLogin } = require('../loginFile/login');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/login' && req.method === 'GET') {
    // Serve the loginPage.html
    const filePath = path.join(__dirname, '../loginFile/loginPage.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(content);
      }
    });
  } else if (req.url === '/cssLoginPage.css' && req.method === 'GET') {
    // Serve the cssLoginPage.css file
    const filePath = path.join(__dirname, '../loginFile/cssLoginPage.css');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(content);
      }
    });
  } else if (req.url === '/cssTheme.css' && req.method === 'GET') {
    // Serve the cssTheme.css file
    const filePath = path.join(__dirname, '../loginFile/cssTheme.css');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(content);
      }
    });
  } else if (req.url === '/home.css' && req.method === 'GET') {
    // Serve the cssTheme.css file
    const filePath = path.join(__dirname, '../css/home.css');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(content);
      }
    });
  }else if (req.url === '/favicon.svg' && req.method === 'GET') {
    // Serve the cssTheme.css file
    const filePath = path.join(__dirname, 'img/icons/favicon.svg');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/svg');
        res.end(content);
      }
    });
  }else if (req.url === '/login' && req.method === 'POST') {
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
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success }));
        }
      });
    });
  } else if (req.url === '/homepage.html' && req.method === 'GET') {
    // Serve the homepage.html
    const filePath = path.join(__dirname, '../homepage.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(content);
      }
    });
} else {
    // Handle other requests
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
