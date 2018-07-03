//Dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');

//The connection with sql goes here
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'ajffam13325',
    database: 'bamazon'
})

// Test connection and invoque the function that shows the table
connection.connect(function(err){
    if (err) throw err;
    console.log('connection sucessful!');
    readTable();
})

// This function loop the table and display in terminal all products
var readTable = function(){
    connection.query("SELECT * FROM products", function(err, res){
        for(var i =0; i<res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | " +  res[i].department_name + " | " + res[i].price + " | "  + res[i].stock_quantity + " \n " );
        }
    askProductId(res); //Invoques the prompt for user selection
    })
}

// This function lets the user select the product to buy
var askProductId = function(res){
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'Enter the ID of the product you want to buy? [Quit with Q]'
    }]).then(function(answer){
        var correct = false;
        if(answer.choice.toUpperCase()==="Q"){
            process.exit();
        }
        for (var i=0; i<res.length; i++){ 
            if(res[i].item_id == answer.choice){
                correct = true;
                var id = answer.choice - 1 ; //Save the user selection in this var less one to match the id in the table
                var product = res[id].product_name;
                console.log("The product you selected is: " + product);
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many would you like to buy",
                    validate: function(value){
                        if(isNaN(value) === false){
                            return true;
                        }else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    console.log(res[id].stock_quantity);
                    console.log(answer.quantity);
                    if((res[id].stock_quantity - answer.quantity) >= 0){
                        connection.query("UPDATE products SET stock_quantity= '" + (res[id].stock_quantity - answer.quantity) + "' WHERE product_name='" + product + "'", function(err,res2){
                            console.log("Product bought");
                            readTable();
                        })
                    } else {
                        console.log("Insufficient quantity!");
                        askProductId(res);
                    }
                })
            }
        }
        if (i===res.length && correct==false){
            console.log("Not a valid selection");
            askProductId(res);
        }
    });    
}


