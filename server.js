const inquirer = require('inquirer');
// const api = require('./api');

const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost', 
        user: 'root',
        password: 'password',
        database: 'business'
    },
    console.log('Connected to the business database.')
);

start();

function start () {
    console.log('Welcome!');
    menu();
}

function menu() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "What do you want to do?", 
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Finish']
        }
    ]).then(answers => {
        switch (answers.menu) {
            case 'View all departments':
                // viewDepartments();
                db.query('SELECT * FROM department', function (err, results) {
                    if (err) {
                        throw err
                    } else {
                        const table = cTable.getTable(results)
                        console.log(table)
                    }
                })
                menu();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee': 
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default: 
                finish();
                break;
        }
    })
}