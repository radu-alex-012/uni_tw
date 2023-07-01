const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const querystring = require('querystring');
const {URL} = require('url');
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

function getEmail(req) {
    const cookie = req.headers.cookie;
    if (cookie) {
        const cookies = cookie.split(';');
        for (const pair of cookies) {
            const [key, value] = pair.trim().split('=');
            if (key === 'email') {
                return decodeURIComponent(value);
            }
        }
        return '';
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

const server = http.createServer(async (req, res) => {
    const {pathname} = new URL(req.url, `http://${req.headers.host}`);
    const queryParams = querystring.parse(new URL(req.url, `http://${req.headers.host}`).searchParams.toString());

    if (req.method === 'GET') {
        if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/res/')) {
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
            } else if (pathname === '/account') {
                const accountPath = path.join(__dirname, '..', 'html', 'account.html');
                fs.readFile(accountPath, 'utf8', (err, content) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(content);
                    }
                });
            } else if (pathname === '/alter') {
                const selectedDatabase = queryParams.schema;
                const tableName = queryParams.table;
                const alterFilePath = path.join(__dirname, '..', 'html', 'alter.html');
                fs.readFile(alterFilePath, 'utf8', (err, content) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    } else {
                        const modifiedContent = content
                            .replace('{{selectedDatabase}}', selectedDatabase)
                            .replace('{{tableName}}', tableName);
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(modifiedContent);
                    }
                });
            } else if (pathname === '/alterData') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk;
                });
                req.on('end', async () => {
                    try {
                        const databaseName = queryParams.schema;
                        const tableName = queryParams.table;
                        const userMgmt = createDatabaseConnection(databaseName);
                        const [columnInfo, columnFields] = await userMgmt.query('SELECT column_name as column_name, column_type as column_type, column_default as column_default, is_nullable as is_nullable, column_key as column_key, extra as extra FROM information_schema.columns WHERE table_schema = ? AND table_name = ?', [databaseName, tableName]);

                        const columns = columnInfo.map(row => {
                            const {column_type} = row;
                            let type = '';
                            let length = '';

                            // Splitting the column_type string to extract type and length
                            const typeParts = column_type.split('(');
                            type = typeParts[0].trim();

                            if (typeParts.length > 1) {
                                const lengthPart = typeParts[1].split(')')[0];
                                length = parseInt(lengthPart);
                            }

                            return {
                                name: row.column_name,
                                type,
                                length,
                                defaultValue: row.column_default,
                                nullable: row.is_nullable === 'YES',
                                primaryKey: row.column_key === 'PRI',
                                foreignKey: row.column_key === 'MUL',
                                autoIncrement: row.extra.toLowerCase().includes('auto_increment')
                            };
                        });
                        console.log(columns);
                        res.statusCode = 200;
                        res.end(JSON.stringify(columns));
                    } catch (err) {
                        console.error(err);
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    }
                });
            } else if (pathname === '/data') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    const email = getEmail(req);
                    const dbMgmt = createDatabaseConnection('db_mgmt');
                    const [dbResults, dbFields] = await dbMgmt.query('SELECT db_name FROM user_databases WHERE user_email=?', [email]);
                    const databaseNames = dbResults.map(row => row.db_name);
                    const [userResults, userFields] = await dbMgmt.query('SELECT username FROM users WHERE email = ?', [email]);
                    const username = userResults.map(row => row.username);
                    const responseData = {
                        username: username,
                        databases: []
                    };

                    for (const name of databaseNames) {
                        const userMgmt = createDatabaseConnection(name);
                        const [tableResults, tableFields] = await userMgmt.query('SELECT table_name AS table_name FROM information_schema.tables WHERE table_schema = ?', [name]);
                        const tableNames = tableResults.map(row => row.table_name);
                        const tablesInfo = [];

                        for (const tableName of tableNames) {
                            const [columnInfo, columnFields] = await userMgmt.query('SELECT column_name as column_name, column_type as column_type, column_default as column_default, is_nullable as is_nullable, column_key as column_key, extra as extra FROM information_schema.columns WHERE table_schema = ? AND table_name = ?', [name, tableName]);
                            const columns = columnInfo.map(row => ({
                                name: row.column_name,
                                type: row.column_type,
                                defaultValue: row.column_default,
                                isNullable: row.is_nullable === 'YES',
                                isPrimaryKey: row.column_key === 'PRI',
                                isForeignKey: row.column_key === 'MUL',
                                isAutoIncrement: row.extra.toLowerCase().includes('auto_increment')
                            }));

                            tablesInfo.push({
                                name: tableName,
                                columns: columns
                            });
                        }

                        responseData.databases.push({
                            name: name,
                            tables: tablesInfo
                        });
                    }
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(responseData));
                });
            } else if (pathname === '/sidebar') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    const email = getEmail(req);
                    const dbMgmt = createDatabaseConnection('db_mgmt');
                    const [dbResults, dbFields] = await dbMgmt.query('SELECT db_name FROM user_databases WHERE user_email=?', [email]);
                    const databaseNames = dbResults.map(row => row.db_name);
                    const [userResults, userFields] = await dbMgmt.query('SELECT username FROM users WHERE email=?', [email]);
                    const username = userResults.map(row => row.username)[0];
                    const responseData = {
                        username: username,
                        databases: databaseNames
                    };
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(responseData));
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
        if (isAuthenticated(req)) {
            if (pathname === '/execute-sql') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    const data = JSON.parse(body);
                    const database = data.schema;
                    const db = createDatabaseConnection(database);
                    const statements = data.sql;
                    try {
                        for (const statement of statements) {
                            const results = await db.query(statement);
                            console.log('Query results:', results);
                        }
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('Ok!');
                    } catch (error) {
                        console.error('Failed to execute the SQL statement:', error);
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    }
                });
            } else {
                res.writeHead(401, {'Content-Type': 'text/plain'});
                res.end('Forbidden');
            }
        } else {
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
                        res.setHeader('Set-Cookie', [
                            `session=${sessionId}; HttpOnly; Path=/`,
                            `email=${encodeURIComponent(email)}; Path=/`
                        ]);
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
        }
    } else if (req.method === 'DELETE') {
        if (isAuthenticated(req)) {
            if (pathname === '/logout') {
                const sessionId = req.headers.cookie.split('=')[1];
                delete sessions[sessionId];
                res.setHeader('Location', '/');
                res.setHeader('Set-Cookie', `session=; HttpOnly; Path=/; Expires=${new Date(0).toUTCString()}`);
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Logged out!');
            } else if (pathname === '/drop') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    const selectedDatabase = queryParams.schema;
                    const tableName = queryParams.table;
                    const db = createDatabaseConnection('db_mgmt');
                    try {
                        await db.query(`DROP TABLE \`${selectedDatabase}\`.\`${tableName}\``);
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('Success!');
                    } catch (error) {
                        console.error(error);
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    }
                });
            }
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