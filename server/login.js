const http = require('http');
const url = require('url');
const bcrypt = require('bcrypt');

// Create an in-memory database of users (not suitable for production)
const users = [{
    id: 1, username: 'user1', password: 'password1'
}, {
    id: 2, username: 'user2', password: 'password2'
}, {
    id: 3, username: 'user3', password: 'password3'
}];

// Function to check if the provided username and password match a user in the database
async function authenticate(username, password) {
    const user = users.find(user => user.username === username);
    if (!user) return false;
    // const match = await bcrypt.compare(password, user.password);
    const match = password === user.password;
    return match ? user : false;
}

// Create an HTTP server
const server = http.createServer(async (req, res) => {
    const {pathname, search} = new URL(req.url, `https://${req.headers.host}`);
    const params = new URLSearchParams(search);

    if (pathname === '/login') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const loginData = JSON.parse(body)
                ;const username = loginData.username;
                const password = loginData.password;
                const user = await authenticate(username, password);
                if (user) {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Success!');
                } else {
                    res.writeHead(401, {'Content-Type': 'text/plain'});
                    res.end('Fail!');
                }
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Page not found.');
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Page not found.');
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
