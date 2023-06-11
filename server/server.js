const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./db/user1.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the user1 database.');
});

const http = require('http')
const hostname = '127.0.0.1'
const port = 3000



const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World\n')
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})