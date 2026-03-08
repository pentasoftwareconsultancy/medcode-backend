const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

module.exports = db.promise();