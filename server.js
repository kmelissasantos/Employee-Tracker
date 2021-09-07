const mysql = require('mysql');
const inquirer = require('inquirer');
const db = require('./db/connection');

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    start();
}); 