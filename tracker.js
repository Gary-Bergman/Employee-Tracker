// Required dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
require("dotenv").config();

// Arrays to push into
let roleArr = [];
let roleIdArr = []
let managerArr = [];
let managerIdArr = [];
let employeeArr = [];



// Connect to MySQL
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
    ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝ \n\n`)
    start();
});


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
    connection.query(`SELECT employeeTbl.id, employeeTbl.first_name, employeeTbl.last_name, roleTbl.title AS title, roleTbl.salary AS salary, departmentTbl.name As department, CONCAT_WS(" ", managerName.first_name, managerName.last_name) as manager FROM EmployeeTbl LEFT JOIN roleTbl on EmployeeTbl.role_id = roleTbl.id Left Join departmentTbl on roleTbl.department_id = departmentTbl.id LEFT JOIN employeeTbl managerName ON employeeTbl.manager_id = managerName.id;`, function (err, res) {
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
    connection.query("SELECT * FROM departmentTbl", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}


// Functions for adding to tables based on user choices 
// ---------------------------------------

// Add employee inquirer
function addEmpFunc() {
    // Run starter functions
    currentRoleFunc();
    currentManagerFunc();

    function currentRoleFunc() {
        connection.query("SELECT title, id FROM roleTbl", function (err, res) {
            if (err) throw err;
            let currentRole;
            let currentRoleId;
            // console.log(res.title)
            for (var i = 0; i < res.length; i++) {
                currentRole = (res[i].title);
                currentRoleId = (res[i].id);
                roleArr.push(currentRole);
                roleIdArr.push(currentRoleId);
            }
        })
    }

    function currentManagerFunc() {
        connection.query("SELECT first_name, last_name, id FROM employeeTbl", function (err, res) {
            if (err) throw err;
            let currentManager;
            let currentManagerId;
            for (var i = 0; i < res.length; i++) {
                currentManager = (res[i].first_name + " " + res[i].last_name);
                managerArr.push(currentManager);
                currentManagerId = (res[i].id);
                managerIdArr.push(currentManagerId);
            }
            managerArr.push("null")
        })
    }
    // Adds Null option for user choice in manager selection


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
            choices: roleArr
        },
        {
            type: 'list',
            message: `Who is the employee's manager?`,
            name: 'manager',
            choices: managerArr
        }
    ]).then((result) => {
        createEmployee(result, roleIdArr, managerIdArr, roleArr, managerArr);
        start();
    })
}

//Add role inquirer
function addRoleFunc() {
    let departmentArr = [];
    let departmentIdArr = [];

    // Run starter functions
    currentDptFunc();

    function currentDptFunc() {
        connection.query("SELECT name, id FROM departmentTbl ", function (err, res) {
            if (err) throw err;
            let currentDpt;
            let currentDptId;
            for (var i = 0; i < res.length; i++) {
                currentDpt = (res[i].name);
                currentDptId = (res[i].id);
                departmentArr.push(currentDpt);
                departmentIdArr.push(currentDptId);
            }
        })
    }
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
            choices: departmentArr
        }
    ]).then((result) => {
        createRole(result, departmentArr, departmentIdArr);
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
function createEmployee(result, roleIdArr, managerIdArr, roleArr, managerArr) {
    console.log("Creating a new employee...\n");
    let roleIndex = 0;
    for (let i = 0; i < roleArr.length; i++) {
        if (result.role == roleArr[i]) {
            roleIndex = i;
        }
    }

    let managerIndex = 0;
    for (let i = 0; i < managerArr.length; i++) {
        if (result.manager == managerArr[i]) {
            managerIndex = i;
        }
    }

    console.log(managerIndex);
    console.log(roleIndex)

    console.table(roleArr)
    console.table(managerArr)
    connection.query(
        "INSERT INTO employeeTbl SET ?",
        {
            first_name: result.first,
            last_name: result.last,
            role_id: roleIdArr[roleIndex],
            manager_id: managerIdArr[managerIndex]
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Employee Added!\n");
        }
    );
}

// Creates added role in db
function createRole(result, departmentArr, departmentIdArr) {
    console.log("Creating a new role...\n");
    console.log(result.roleDpt + " role has been added!")

    let departmentIndex = 0;
    for (let i = 0; i < departmentArr.length; i++) {
        if (result.roleDpt == departmentArr[i]) {
            departmentIndex = i;
        }
    }
    connection.query(
        "INSERT INTO roleTbl SET ?",
        {
            title: result.roleTitle,
            salary: result.roleSal,
            department_id: departmentIdArr[departmentIndex],
        },
        function (err, res) {
            if (err) throw err;
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


// SET of functions to update employee role
// ---------------------------------------

// Resolves current employee array to be used in updateEmpRoleFunc
function currentEmployees() {
    return new Promise(resolve => {
        connection.query("SELECT first_name, last_name FROM employeeTbl", (err, res) => {
            if (err)
                throw err;
            let currentEmployee;
            for (var i = 0; i < res.length; i++) {
                currentEmployee = (res[i].first_name + " " + res[i].last_name);
                employeeArr.push(currentEmployee);
            }
            resolve(employeeArr)
        })
    })
}

// Resolves current roles array to be used in updateEmpRoleFunc
function current_Roles() {
    return new Promise(resolve => {
        connection.query("SELECT title, id FROM roleTbl", (err, res) => {
            if (err)
                throw err;
            let roles = [];
            let rolesIdArr = [];
            for (var i = 0; i < res.length; i++) {
                roles.push(res[i].title);
                rolesIdArr.push(res[i].id)
            }
            let rolesObj = {
                arrayStr: roles,
                arrayId: rolesIdArr
            }
            resolve(rolesObj)
        })
    })
}

// async function that prompts users to update employee role
async function updateEmpRoleFunc() {
    let employees = await currentEmployees();
    let rolesObj = await current_Roles();
    let rolesArr = rolesObj.arrayStr;
    let rolesIdArr = rolesObj.arrayId


    console.log(rolesIdArr)
    inquirer.prompt([
        {
            type: 'list',
            message: `What is the name of the employee you'd like to change roles for?`,
            name: 'empName',
            choices: employees
        },
        {
            type: 'list',
            message: 'Please choose a new role.',
            name: 'newRole',
            choices: rolesArr
        }
    ]).then((result) => {
        let employeeName = result.empName.split(" ");
        let rolesIndex = 0;
        for (let i = 0; i < rolesArr.length; i++) {
            if (result.newRole == rolesArr[i]) {
                rolesIndex = i;
            }
        }
        connection.query(
            "UPDATE employeeTbl SET role_id=? WHERE first_name=? AND last_name=?",
            [rolesIdArr[rolesIndex], employeeName[0], employeeName[1]], function (err, res) {
                if (err) throw err;
                start();
            }
        )
    })
}