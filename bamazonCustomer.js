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

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
 displayProducts();
});
console.log('')
console.log('------------------------------Welcome to BAMazon-------------------------------');
console.log('')

var amountDue;
var currentDepartment;
var updateSales;

function displayProducts() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {

		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("Item ID: " + res[i].item_id + " || Product Name: " +
						res[i].product_name + " || Price: $" + res[i].price);
		}

		// Requests product and number of product items user wants to purchase.
  		userRequest();
	});
};

function userRequest(){
  inquirer.prompt([{
		name: "itemId",
		type: "input",
		message: "Please enter item ID for product you want:",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
      return false;
		}
	}, {
		name: "quantity",
		type: "input",
		message: "How many do you want?",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false
		}
	}]).then(function(answer) {
		connection.query('SELECT * FROM products WHERE item_id = ?', [answer.itemId], function(err,res){
			if (answer.quantity > res[0].stock_quantity){
				console.log("Sorry, there is not enough in stock!");
				console.log('');

			} else {
				amountDue = res[0].price * answer.quantity;
				currentDepartment = res [0]. department_name;
				console.log("Thank you for your order! Your total is $" + amountDue.toFixed(2));
				console.log('')
				//update product sales
				connection.query('UPDATE products SET ? WHERE ?',[{
					stock_quantity: res[0].stock_quantity - answer.quantity
				},{
					item_id: answer.itemId
				}], function(err,res){});
				logSale();
				newOrder();
			}
		})
	})
}

	//this logs the users order and updates table
	function logSale(){
		connection.query('SELECT * FROM departments WHERE department_name = ?', [currentDepartment], function(err, res){
			updateSales = res[0].total_sales + amountDue;
			updateDepartmentSales();
		})
	}

	function updateDepartmentSales(){
		console.log('hey');
		connection.query('UPDATE departments SET ? WHERE ?', [{
			total_sales: updateSales
		},{
			department_name: currentDepartment
		}], function (err,res){});
	}

	//Allows the user to place a new order or end the connection
	function newOrder(){
		inquirer.prompt([{
			name: "choice",
			type: "confirm",
			message: "Would you like to place another order?"
		}]).then(function(answer){
			if(answer.choice){
				userRequest();
			}
			else{
				console.log('Thank you for shopping at BAMazon!');
				connection.end();
			}
		})
	};

		// displayProducts();
