const http = require('http');

const routes = {
    '/': (req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Welcome to the homepage!');
    },
    '/about': (req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('About page');
    },
    '/contact': (req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Contact page');
    },
};

const defaultHandler = (req, res) => {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Page not found');
};

const server = http.createServer((req, res) => {
    const {pathname} = new URL(req.url, `http://${req.headers.host}`);

    const handler = routes[pathname] || defaultHandler;

    handler(req, res);
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
