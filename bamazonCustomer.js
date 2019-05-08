//require dependencies

var inquirer = require('inquirer');
var mysql = require('mysql');

//mysql connection

var connection = mysql.createConnection({
  host: 'localhost',
  port: 8080,

  user: 'root',

  password: '4MySQL32!',

  database: 'bamazon',
});

function start(){
  console.log('--------Welcome to BAMazon--------');
  connection.query('SELECT * FROM products', function(err, res){
    if (err) throw err;

    for(var i = 0; i<res.length;i++){
    console.log("Item ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
    }
  })
};
console.log('------------------------------------------------------------------');

//prompts user what id and how many

function userPurchase(){

  inquirer.prompt([
    {
      type: 'input',
      name: 'item_id',
      message: 'Please enter the Items ID which you would like to purchase.',
      validate: function(value){
        if (isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
          return true;
        }else{
          return false;
        }
      }
    },

    {
      type: 'input',
      name: 'quanity',
      message: 'How many do you need?',
      validate: function(value){
        if(isNaN(value)){
          return false;
        } else{
          return true;
        }
    }
  },
  ]).then(function(input){
      var item = input.item_id;
      var quanity = input.quanity;
      var total = parseFloat(((res[item].price)*quanity).toFixed(2));

      var queryId = 'SELECT * FROM products WHERE?';
//check if quantity is sufficient
      if (res[item].stock_quantity >= quanity){
//update quantity in product table
        connection.query("UPDATE products SET ? WHERE ?", [
          {stock_quantity: (res[item].stock_quantity - quanity)},
          {item_id: item.item_id}
        ], function (err, result){
            if (err) throw err;
        });
        console.log("Your total is $" + total.toFixed(2));

      promptAgain();
      }else {
        console.log("Sorry, there is not enough in stock!");
      };
      // connection.query(queryId, {item_id: item}, function(err, data){
      //   if (err) throw err;

      //   else if (data.length === 0){
      //     console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
      //     displayInventory();
      //   }
      //   else {
      //     var productData = data[0];
      //     console.log('productData.stock_quantity = ' + productData.stock_quantity);
      //   }
      // })

  });
}

function promptAgain(){
  inquirer.prompt([{
    type: "confirm",
    name: "reply",
    message: "Would you like to purchase another item?"
  }]).then(function(res){
    if (res.reply){
      start();
    } else {
      console.log("Thanks shopping BAMazon!");
    }
  })
}


