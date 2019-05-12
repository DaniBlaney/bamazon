CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL (10,2) NOT NULL,
stock_quantity INTEGER NOT NULL,
PRIMARY KEY (item_id)

)

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Revlon UltraHD Matte Lipstick', 'Cosmetics', 5.69, 50),
		('Maybelline Precise Liquid Eyeliner', 'Cosmetics', 6.99, 150),
		('Glad 12 Gal Trash Bags', 'Grocery', 5.99, 800),
		('Brawny Paper Towels', 'Grocery', 4.25, 500),
		('Avocado', 'Produce', 0.85, 80),
		('Chiquita Bannana', 'Produce', 0.20, 100),
		('Cascade Complete ActionPacs', 'Grocery', 12.99, 267),
		('Echo Dot', 'Electronics', 29.99, 200),
		('Huggies Diapers 124ct', 'Baby', 46.99, 76),
		('AmazonBrand Mega Roll Toilet Paper', 'Grocery', 22.25, 575);

SELECT * FROM bamazon.products;

USE bamazon;
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(7,2) NOT NULL DEFAULT '0.00',
  total_sales DECIMAL(7,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (department_id)
);

USE bamazon;
INSERT INTO departments(department_name, over_head_costs) VALUES('Grocery', 500);
INSERT INTO departments(department_name, over_head_costs) VALUES('Baby', 1500);
INSERT INTO departments(department_name, over_head_costs) VALUES('Electronics', 2500);
INSERT INTO departments(department_name, over_head_costs) VALUES('Cosmetics', 800);
Select * From departments;
