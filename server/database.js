const mysql = require('mysql2');

function createDatabaseConnection(databaseName) {
    const pool = mysql.createPool({
        host: 'localhost',
        port: 3360,
        user: 'Alex',
        password: 'rz@WfD%tMuKe%yUhJXWb$En8XX66Pu',
        database: databaseName,
        connectionLimit: 10,
    });

    return pool.promise();
}

module.exports = createDatabaseConnection;