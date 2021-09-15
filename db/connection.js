const mysql = require('mysql2');
const dotenv = require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: 'employeeTracker'
});

module.exports = db;