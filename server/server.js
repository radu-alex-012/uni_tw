const http = require('http');
const fs = require('fs');
const path = require('path');
const { checkLogin } = require('../loginFile/login');
const { validatePassword } = require('./settings');
const { deleteAccount } = require('./settings');
const { registerUser } = require('./newAccount');
const { isUsernameTaken } = require('./newAccount');


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // Parse the "Cookie" header manually
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

  // Access the parsed cookies
  console.log('Cookies:', req.cookies);

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
  } else if (req.url === '/cssAccountSettings.css' && req.method === 'GET') {
    // Serve the cssTheme.css file
    const filePath = path.join(__dirname, '../cssAccountSettings.css');
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
  }else if (req.url === '/cssTheme.css' && req.method === 'GET') {
    // Serve the cssTheme.css file
    const filePath = path.join(__dirname, '../cssTheme.css');
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
  } else if (req.url === '/cssNewAccountPage.css' && req.method === 'GET') {
    // Serve the cssTheme.css file
    const filePath = path.join(__dirname, '../loginFile/cssNewAccountPage.css');
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
  } else if (req.url === '/favicon.svg' && req.method === 'GET') {
    // Serve the favicon.svg file
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
  }
  /* the views from here */
  else if (req.url === '/login' && req.method === 'POST') {
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
            res.setHeader('Location', '/settings');
            res.end();
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success }));
          }
        }
      });
    });
  } else if (req.url === '/settings' && req.method === 'GET') {
    const username = req.cookies.username;
    if (username) {
      // Serve the accountSettings.html
      const filePath = path.join(__dirname, '../loginFile/accountSettings.html');
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
      res.statusCode = 302;
      res.setHeader('Location', '/login');
      res.end();
    }
  } else if (req.url === '/settings' && req.method === 'POST') {
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
  }else if (req.url === '/deleteAccount' && req.method === 'POST') {
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
  }else if (req.url === '/homepage.html' && req.method === 'GET') {
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
  }else if (req.url === '/newAccount' && req.method === 'GET') {
    // Serve the homepage.html
    const filePath = path.join(__dirname, '../loginFile/newAccountPage.html');
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
  }else if (req.url === '/newAccount' && req.method === 'POST') {
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
  }else {
    // Handle other requests
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
