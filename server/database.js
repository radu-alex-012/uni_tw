const mysql = require('mysql2');

function createDatabaseConnection(databaseName) {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3360,
        user: 'Alex',
        password: 'rz@WfD%tMuKe%yUhJXWb$En8XX66Pu',
        database: databaseName,
    });

    return connection.promise();
}

module.exports = createDatabaseConnection;