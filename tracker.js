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
    console.log(`
    ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗
    ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝
    █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░
    ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░
    ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗
    ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝
    
    ████████╗██████╗░░█████╗░░█████╗░██╗░░██╗███████╗██████╗░
    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░██╔╝██╔════╝██╔══██╗
    ░░░██║░░░██████╔╝███████║██║░░╚═╝█████═╝░█████╗░░██████╔╝
    ░░░██║░░░██╔══██╗██╔══██║██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗
    ░░░██║░░░██║░░██║██║░░██║╚█████╔╝██║░╚██╗███████╗██║░░██║
    ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝`)
    start();
});

// var example = createEmployee;
// Table dependency example

// Starts the initial inquirer and gets used for recursion
function start() {
   
    inquirer.prompt({
                type: 'list',
        message: 'Would you like to do?',
        name: 'toDo',
        choices: ['Add Employee', 'Add Role', 'Add Department', 'View Employee', 'View Role', 'View Department', 'Update Employee Role', 'Exit']
    }).then(function (result) {
        switch (result.toDo) {
            case 'Add Employee':
                addEmpFunc();
                break;

            case 'Add Role':
                addRoleFunc();
                break;

            case 'Add Department':
                addDptFunc();
                break;

            case 'View Employee':
                viewEmpFunc();
                break;

            case 'View Role':
                viewRoleFunc();
                break;

            case 'View Department':
                viewDptFunc();
                break;

            case 'Update Employee Role':
                updateEmpRoleFunc();
                break;

            case 'Exit':
                console.log("Thanks for using the Employee-Tracker! Have a great day and stay safe!\n#NoCovid #BLM")
                connection.end();
                break;
        }
    })
}

// Functions for additional user input based on user answer to init question
//////////////////////////////////////////////////////////

// Add employee inquirer
function addEmpFunc() {
                inquirer.prompt([
                    {
                        type: 'input',
                        message: `What is the employee's first name?`,
                        name: 'first'
                    },
                    {
                        type: 'input',
                        message: `What is the employee's last name?`,
                        name: 'last'
                    },
                    {
                        type: 'list',
                        message: `What is the employee's role?`,
                        name: 'role',
                        choices: [1, 2, 3]
                    },
                    {
                        type: 'list',
                        message: `Who is the employee's manager?`,
                        name: 'manager',
                        choices: [1, 2, 3]
                    }
                ]).then((result) => {
                    //Call db to enter
                    console.log("Employee Addeed: ");
                    console.log(result);
                    createEmployee(result);
                    start();
                })
            }

// Add role inquirer
function addRoleFunc() {
                inquirer.prompt([
                    {
                        type: 'input',
                        message: `What is the title of the new role you'd like to add?`,
                        name: 'roleTitle'
                    },
                    {
                        type: 'input',
                        message: 'What is the salary for this role?',
                        name: 'roleSal'
                    },
                    {
                        type: 'list',
                        message: 'What is the department for this role?',
                        name: 'roleDpt',
                        choices: ['Engineering', 'HR', 'Sales', 'Chief', 'Maintenance']
                    }
                ]).then((result) => {
                    console.log("Role Added: ");
                    console.log(result);
                    createRole(result);
                    start();
                })
            }

// Add department inquirer
function addDptFunc() {
                inquirer.prompt(
                    {
                        type: 'input',
                        message: `What is the name of the department you'd like to add?`,
                        name: 'deptName'
                    }
                ).then((result) => {
                    console.log("Department Added: ");
                    console.log(result);
                    createDpt(result);
                    start();
                })
            }

// View employee list
function viewEmpFunc() {
                connection.query("SELECT * FROM employeeTbl", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            }

// View role list
function viewRoleFunc() {
                connection.query("SELECT * FROM roleTbl", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            }

// View department list
function viewDptFunc() {
                connection.query("SELECT * FROM departmentTbl", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            }

// Set of functions to create table data in workbench based on user input from inquirer prompts
////////////////////////////////////////////////

// Creates added employee in db
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
var example = createEmployee;

// Creates added role in db
function createRole(result) {
                console.log("Creating a new role...\n");
    var query = connection.query(
        "INSERT INTO roleTbl SET ?",
        {
                title: result.roleTitle,
            salary: result.roleSal,
            department_id: result.roleDpt,
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Role Added!\n");
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}


// Creates added department in db
function createDpt(result) {
                console.log("Creating a new department...\n");
    var query = connection.query(
        "INSERT INTO departmentTbl SET ?",
        {
                name: result.deptName
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Department Added!\n");
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}


