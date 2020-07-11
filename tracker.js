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
    // DO SELECT All here or at begining of function before inquirer
    // build an array of employees, dpts and roles check to see if anything has changed 
    inquirer.prompt({
        type: 'list',
        message: 'Would you like to do?',
        name: 'toDo',
        choices: ['View All', 'View Employee', 'View Role', 'View Department', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role', 'Exit']
    }).then(function (result) {
        switch (result.toDo) {
            case 'View All':
                viewAllFunc();
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

            case 'Add Employee':
                addEmpFunc();
                break;

            case 'Add Role':
                addRoleFunc();
                break;

            case 'Add Department':
                addDptFunc();
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


// View Table Functions 
// ---------------------------------------
// View ALL
function viewAllFunc() {
    //connection.query("SELECT * FROM employeeTbl LEFT JOIN roleTbl ON employeeTbl.role_id = roleTbl.id", function (err, res) {
    connection.query("SELECT employeeTbl.id, employeeTbl.first_name, employeeTbl.last_name, roleTbl.title AS title, roleTbl.salary AS salary, departmentTbl.name As department FROM EmployeeTbl LEFT JOIN roleTbl on EmployeeTbl.role_id = roleTbl.id Left Join departmentTbl on roleTbl.department_id = departmentTbl.id", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

// View employee list
function viewEmpFunc() {
    connection.query("SELECT id, first_name, last_name FROM employeeTbl", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

// View role list
function viewRoleFunc() {
    connection.query("SELECT id, title, salary FROM roleTbl", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

// View department list
function viewDptFunc() {
    connection.query("SELECT id, name FROM departmentTbl", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}


// Functions for adding to tables based on user choices 
// ---------------------------------------

// Add employee inquirer
function addEmpFunc() {

    // let roleArr = [];
    // // let managerArr = [];

    // currentRoleFunc();
    // function currentRoleFunc() {
    //     connection.query("SELECT title FROM roleTbl", function (err, res) {
    //         if (err) throw err;
    //         let currentRole;
    //         for (var i = 0; i < res.length; i++) {
    //            currentRole = (res[i].title);
    //            roleArr.push(currentRole);
    //         }
    //     })
    // }

    // currentManagerFunc()

    // function currentManagerFunc() {
    //    var man = connection.query("SELECT first_name, last_name FROM employeeTbl", function (err, res) {
    //         if (err) throw err;
    //         let currentManager;
    //         // for (var i = 0; i < 10; i++) {
    //             // currentManager = (res[1]);
    //             console.log(man)
    //         //    managerArr.push(currentManager);
    //         // }
    //         // roleArr.push(currentRole);
    //     })
    //     currentManagerFunc()
    // }

    // or just pull roles and managers here
    // check great bay
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
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            // ['CEO', 'Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Lead Engineer']

        },
        {
            type: 'list',
            message: `Who is the employee's manager?`,
            name: 'manager',
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            // This needs to be a variable representing all current manager (employee) choices from DB
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
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            //['Chief', 'Sales', 'Engineering', 'Finance', 'Legal']
            // This needs to be a variable representing all current department choices from DB
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



// Set of functions to create table data in workbench based on user input from inquirer prompts
// ---------------------------------------

// Creates added employee in db
function createEmployee(result) {
    console.log("Creating a new employee...\n");
    connection.query(
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
}

// Creates added role in db
function createRole(result) {
    console.log("Creating a new role...\n");
    connection.query(
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
}


// Creates added department in db
function createDpt(result) {
    console.log("Creating a new department...\n");
    connection.query(
        "INSERT INTO departmentTbl SET ?",
        {
            name: result.deptName
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Department Added!\n");
        }
    );
}


// NEED TO ADD UPDATE EMPLOYEE ROLE FUNCTION!!!


// NEED TO ADD SELECT STATEMENT TO GET UPDATED ROLES LIST 
// function selectRole() {
//    connection.query(
//        "SELECT title FROM roleTbl;",
//         function (err, res) {
//             if (err) throw err;

//         })
// }
