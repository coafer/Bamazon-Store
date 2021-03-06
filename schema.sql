DROP DATABASE IF EXISTS bamazon;

create database bamazon;
use bamazon;

create table products(
	item_id integer auto_increment not null,	
    product_name varchar (100) not null,
    department_name varchar (100) not null,
    price decimal (10,4) not null,
    stock_quantity integer (10) not null,
    primary key (item_id)
);