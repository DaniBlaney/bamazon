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

//prompts user what id and how many

function userPurchase(){

  inquirer.prompt([
    {
      type: 'input',
      name: 'item_id',
      message: 'Please enter the Items ID which you would like to purchase.',
      filter: Number

    },
    {
      type: 'input',
      name: 'quanity',
      message: 'How many do you need?',
      filter: Number
    }
  ]).then(function(input){
      var item = input.item_id;
      var quanity = input.quanity;

      var queryId = 'SELECT * FROM products WHERE?';

      connection.query(queryId, {item_id: item}, function(err, data){
        if (err) throw err;

        else if (data.length === 0){
          console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
          displayInventory();
        }
        else {
          var productData = data[0];
          console.log('productData.stock_quantity = ' + productData.stock_quantity);
          
        }
      })

  })
}
