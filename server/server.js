const http = require("http");
const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3000";
const router = require("./router.js");
const server = http.createServer(router);

server.listen(port, host, () => {
    console.log("Server running at http://" + host + ":" + port);
});