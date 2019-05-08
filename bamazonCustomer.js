//require dependencies

var inquirer = require('inquirer');
var mysql = require('mysql');

//mysql connection

var connection = mysql.createConnection({
  host: 'localhost',
  port: 8080,

  user: 'root',

  password: '4MySQL'

  database: 'bamazon'
});


