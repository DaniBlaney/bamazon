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
	supervisorOptions();
});

function supervisorOptions(){
	inquirer.prompt([{
		name: 'input',
		type: 'list',
		message: 'What would you like to do today?',
		choices: ['1) View Sales by Department', '2) Create New Department']
	}]).then(function(answer){
		if(answer.input === '1) View Sales by Department'){
			console.log('');
			connection.query('SELECT * FROM departments', function(err, res){
				console.log('SALES BY DEPARTMENT');
				for(i=0; i<res.length; i++){
					var profit = res[i].total_sales - res[i].over_head_costs;
					console.log('Department ID: ' + res[i].department_id + ' | ' + 'Department Name: ' + res[i].DepartmentName);
					console.log('Overhead Costs: ' + res[i].over_head_costs);
					console.log('Total Sales: ' + res[i].total_sales);
					// console.log('Total Profit: ' + profit);
					console.log('-----------------');
				}
			newTransaction();
			})
		}
		else{
			addDepartment();
		}

	})
};
