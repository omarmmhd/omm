// src/config/db.js
const sql = require('mssql');

const dbConfig = {
    user: 'omm',
    password: 'omarmdmhd',
    server: 'localhost',
    database: 'LearnGateDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

module.exports = {
    sql,
    dbConfig
};