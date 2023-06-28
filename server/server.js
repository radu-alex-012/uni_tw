const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sessions = [];
const createDatabaseConnection = require('./database.js');

function getContentType(ext) {
    switch (ext) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.svg':
            return 'image/svg+xml';
        default:
            return 'application/octet-stream';
    }
}

function generateSessionId() {
    const randomBytes = crypto.randomBytes(32);
    return crypto.createHash('sha256').update(randomBytes).digest('hex').toString();
}

async function authenticate(email, password) {
    const db = createDatabaseConnection('db_mgmt');
    try {
        const [results, fields] = await db.query('SELECT password FROM users WHERE email = ?', [email]);
        if (results.length === 1) {
            const hash = results[0].password;
            return await new Promise((resolve) => {
                bcrypt.compare(password, hash, (err, result) => {
                    if (err) {
                        console.error(err);
                        resolve(false);
                    }
                    resolve(result);
                });
            });
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function isAuthenticated(req) {
    const cookie = req.headers.cookie;
    if (cookie) {
        const cookies = cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const [name, value] = cookies[i].trim().split('=');
            if (name === 'session')
                return sessions[value] !== undefined;
        }
    }
    return false;
}

const server = http.createServer((req, res) => {
    const {pathname} = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET') {
        if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/res')) {
            const filePath = path.join(__dirname, '..', pathname);
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('File not found');
                } else {
                    const ext = path.extname(filePath);
                    const contentType = getContentType(ext);
                    res.writeHead(200, {'Content-Type': contentType});
                    res.end(content);
                }
            });
        } else if (pathname === '/register') {
            const registerPath = path.join(__dirname, '..', 'html', 'register.html');
            fs.readFile(registerPath, 'utf8', (err, content) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content);
                }
            });
        } else if (pathname === '/forgotPassword') {
            const forgotPassPath = path.join(__dirname, '..', 'html', 'forgotPassword.html');
            fs.readFile(forgotPassPath, 'utf8', (err, content) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content);
                }
            });
        } else if (isAuthenticated(req)) {
            if (pathname === '/' || pathname === '/home') {
                const homePath = path.join(__dirname, '..', 'html', 'home.html');
                fs.readFile(homePath, 'utf8', (err, content) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(content);
                    }
                });
            } else {
                res.writeHead(401, {'Content-Type': 'text/plain'});
                res.end('Forbidden');
            }
        } else {
            const indexPath = path.join(__dirname, '..', 'html', 'index.html');
            fs.readFile(indexPath, 'utf8', (err, content) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content);
                }
            });
        }
    } else if (req.method === 'POST') {
        if (pathname === '/login') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const formData = JSON.parse(body);
                const email = formData['email'];
                const password = formData['password'];

                if (await authenticate(email, password)) {
                    const sessionId = generateSessionId();
                    sessions[sessionId] = email;
                    res.setHeader('Location', '/home');
                    res.setHeader('Set-Cookie', `session=${sessionId}; HttpOnly; Path=/`);
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Success!');
                } else {
                    res.writeHead(401);
                    res.end('Fail!');
                }
            });
        } else {
            res.writeHead(401, {'Content-Type': 'text/plain'});
            res.end('Forbidden');
        }
    } else if (req.method === 'DELETE') {
        if (pathname === '/logout') {
            const sessionId = req.headers.cookie.split('=')[1];
            delete sessions[sessionId];
            res.setHeader('Location', '/');
            res.setHeader('Set-Cookie', `session=; HttpOnly; Path=/; Expires=${new Date(0).toUTCString()}`);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Logged out!');
        } else {
            res.writeHead(401, {'Content-Type': 'text/plain'});
            res.end('Forbidden');
        }
    } else {
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('Method Not Allowed');
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});