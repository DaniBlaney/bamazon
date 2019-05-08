//require dependencies

var inquirer = require("inquirer");
var mysql = require("mysql");

//mysql connection

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3300,

  user: 'root',
  password: '4MySQL32!',
  database: 'bamazon',
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
 displayProducts();
});

console.log('--------Welcome to BAMazon--------');

var displayProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {

		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " +
						res[i].product_name + " || Price: " + res[i].price);
		}

		// Requests product and number of product items user wants to purchase.
  		userRequest();
	});
};

var userRequest = function(){
  inquirer.prompt([{
		name: "item_id",
		type: "input",
		message: "Please enter item ID for product you want.",
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

		// Queries database for selected product.
		var query = "Select stock_quantity, price, product_sales, department_name FROM products WHERE ?";
		connection.query(query, { item_id: answer.item_id}, function(err, res) {

			if (err) throw err;

			var available_stock = res[0].stock_quantity;
			var price_per_unit = res[0].price;
			var productSales = res[0].product_sales;
			var productDepartment = res[0].department_name;

			// Checks there's enough inventory  to process user's request.
			if (available_stock >= answer.quanity) {

				// Processes user's request passing in data to complete purchase.
				completePurchase(available_stock, price_per_unit, productSales, productDepartment, answer.item_id, answer.quanity);
			} else {

				// Tells user there isn't enough stock left.
				console.log("Sorry, there is not enough in stock!");

				// Lets user request a new product.
				userRequest();
			}
		});
	});
};
// Completes user's request to purchase product.
var completePurchase = function(availableStock, price, productSales, productDepartment, selectedProductID, selectedProductUnits) {

	// Updates stock quantity once purchase complete.
	var updatedStockQuantity = availableStock - selectedProductUnits;

	// Calculates total price for purchase based on unit price, and number of units.
	var totalPrice = price * selectedProductUnits;

	// Updates total product sales.
	var updatedProductSales = parseInt(productSales) + parseInt(totalPrice);

	// Updates stock quantity on the database based on user's purchase.
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{
		stock_quantity: updatedStockQuantity,
		product_sales: updatedProductSales
	}, {
		item_id: selectedProductID
	}], function(err, res) {

		if (err) throw err;
		// Tells user purchase is a success.
		console.log("Your purchase is complete.");

		// Display the total price for that purchase.
		console.log("You're total: " + totalPrice);

		// Updates department revenue based on purchase.
		updateDepartmentRevenue(updatedProductSales, productDepartment);
		// Displays products so user can make a new selection.
	});
};

// Updates total sales for department after completed purchase.
var updateDepartmentRevenue = function(updatedProductSales, productDepartment) {

	// Query database for total sales value for department.
	var query = "Select total_sales FROM departments WHERE ?";
	connection.query(query, { department_name: productDepartment}, function(err, res) {

		if (err) throw err;

		var departmentSales = res[0].total_sales;

		var updatedDepartmentSales = parseInt(departmentSales) + parseInt(updatedProductSales);

		// Completes update to total sales for department.
		departmentSalesUpdate(updatedDepartmentSales, productDepartment);
	});
};

// Completes update to total sales for department on database.
var departmentSalesUpdate = function(updatedDepartmentSales, productDepartment) {

	var query = "UPDATE departments SET ? WHERE ?";
	connection.query(query, [{
		total_sales: updatedDepartmentSales
	}, {
		department_name: productDepartment
	}], function(err, res) {

		if (err) throw err;

		// Displays products so user can choose to make another purchase.
		displayProducts();
	});
};
// console.log("Thanks for shopping BAMazon!");
