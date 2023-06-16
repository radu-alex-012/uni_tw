// const http = require('http');

// const server = http.createServer((req, res) => {
//   if (req.method === 'POST' && req.url === '/submit') {
//     let body = '';

//     req.on('data', chunk => {
//       body += chunk.toString();
//     });

//     req.on('end', () => {
//       const data = JSON.parse(body);
//       const name = data.name;
//       const email = data.email;

//       console.log('Name:', name);
//       console.log('Email:', email);

//       res.setHeader('Content-Type', 'application/json');
//       res.end(JSON.stringify({ message: 'Form data received!' }));
//     });
//   } else {
//     res.statusCode = 404;
//     res.end('404 Not Found');
//   }
// });

// const port = 3000;
// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });