// Required dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: process.env.MYSQL_PASS,
    database: "tracker_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    init();
});


// Table dependency example
console.table([
    {
        name: 'foo',
        age: 10
    }, {
        name: 'bar',
        age: 20
    }
]);

function init() {
    inquirer.prompt({
        type: 'list',
        message: 'Would you like to do?',
        name: 'toDo',
        choices: ['Add Employee', 'Add Role', 'Add Department', 'View Employee', 'View Role', 'View Department', 'Update Employee Role', 'Exit']
    }).then((option) => {
        // Make this a Switch Statment
        if (option.toDo == 'Add Employee') {
            addEmpFunc();
        } else if (option.toDo == 'Add Role') {
            addRoleFunc();
        } else if (option.toDo == 'Add Department') {
            addDptFunc();
        } else if (option.toDo == 'View Employee') {
            viewEmpFunc();
        } else if (option.toDo == 'View Role') {
            viewRoleFunc();
        } else if (option.toDo == 'View Department') {
            viewDptFunc();
        } else if (option.toDo == 'Update Employee Role') {
            updateEmpRoleFunc();
        } else {
            console.log("Thanks for using the Employee-Tracker! Have a great day and stay safe!\n#NoCovid #BLM")
            connection.end();
        }
    })
}

// Functions for additional user input based on user answer to init question
function addEmpFunc() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the employees first name?',
            name: 'first'
        },
        {
            type: 'input',
            message: 'What is the employees last name?',
            name: 'last'
        },
        {
            type: 'list',
            message: 'What is the employees role?',
            name: 'role',
            choices: ['CEO', 'CFO', 'Janitor']
        },
        {
            // NEED TO MAKE EMPLOYEE POSSESSIVE
            type: 'list',
            message: 'Who is the employees manager?',
            name: 'manager',
            choices: ['Joe', 'Jane', 'Jill']
        }
    ]).then((result) => {
        //Call db to enter
        console.log(result);
        // createEmployee(result);
        init();
    })
}

// Set of functions to create table data in workbench based on user input from inquirer prompts
function createEmployee(result) {
    console.log("Creating a new employee...\n");
    var query = connection.query(
        "INSERT INTO employeeTbl SET ?",
        {
            first_name: result.first,
            last_name: result.last,
            role_id: result.role,
            manager_id: result.manager
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Employee Added!\n");
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}
