const inquirer = require('inquirer');
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

// TODO: create a Class???

// FUNCTIONS - 

viewDepartments = () => {
    console.log('View all departments:');
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            throw err
        } else {
            const table = cTable.getTable(results)
            console.log(table)
        }
    })
    menu();
};

viewRoles = () => {
    console.log('View all roles:');
    db.query('SELECT * FROM role', function (err, results) {
        if (err) {
            throw err
        } else {
            console.log(results)
        }
    })
};

// viewEmployees = () => {
//     console.log('View all employees:')
//     // TODO: DISPLAY 
//     // FROM EMPLOYEE: id, first_name, last_name, manager by name???
//     // FROM ROLE: title, salary
//     // FROM DEPARTMENT: name
//     db.query('SELECT * FROM employee', function (err, results) {
//         if (err) {
//             throw err
//         } else {
//             console.log(results)
//         }
//     })
// };

// addDepartment = () => {
//     console.log('Add a department:')
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'department_name', 
//             message: 'What is the name of the department?'
//         }
//     ]).then(answers => {
//         // TODO: ADD DEPARTMENT TO DATABASE
//     })
// };

// addRole = () => {
//     console.log('Add a role:')
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'role_name', 
//             message: 'What is the name of the role?'
//         },
//         {
//             type: 'number',
//             name: 'role_salary', 
//             message: 'What is the salary for this role?',
//         },
//         {
//             type: 'list',
//             name: 'role_department', 
//             message: 'What department does this role belong in?',
//             // TODO: choices: [ LIST DEPARTMENTS ]
//         }
//     ]).then(answers => {
//         // TODO: ADD ROLE TO DATABASE
//     })
// };

// addEmployee = () => {
//     console.log('Add a employee:')
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'employee_first', 
//             message: "What is the employee's first name?"
//         },
//         {
//             type: 'input',
//             name: 'employee_last', 
//             message: "What is the employee's last name?"
//         },
//         {
//             type: 'list',
//             name: 'employee_role', 
//             message: "What is the employee's role?",
//             // TODO: choices: [ LIST ROLES ]
//         },
//         {
//             type: 'list',
//             name: 'employee_manager', 
//             message: "Who is the employee's manager?",
//             // TODO: choices: [ LIST MANAGERS ]
//         },
//     ]).then(answers => {
//         // TODO: ADD EMPLOYEE TO DATABASE
//     })
// };

// updateEmployeeRole = () => {
//     console.log('Update an employee role:')
//     // TODO: write function
// };

// finish = () => {
//     console.log('Goodbye!')
// };

// TODO: module.exports