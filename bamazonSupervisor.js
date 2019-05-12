//require dependencies

var inquirer = require("inquirer");
var mysql = require("mysql");

//mysql connection

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  user: 'root',
  password: '4MySQL32!',
  database: 'bamazon',
});

//Establish Connection
connection.connect(function(err){
	if (err) throw err;
	// console.log('connected as id: ' + connection.threadId)
	executiveOptions();
});

