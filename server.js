const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// const api = require('./api');

const db = mysql.createConnection(
    {
        host: 'localhost', 
        user: 'root',
        password: 'password',
        database: 'business_db'
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
                viewDepartments();
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

viewDepartments = () => {
    db.query("SELECT department.name AS 'department name', department.id AS 'department id' FROM department", function (err, results) {
        if (err) {
            throw err
        } else {
            const table = cTable.getTable(results)
            console.log(table)
            menu()
        }
    })
};

viewRoles = () => {
    db.query("SELECT role.title AS 'job title', role.id AS 'role id', department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;", function (err, results) {
        if (err) {
            throw err
        } else {
            const table = cTable.getTable(results)
            console.log(table)
            menu()
        }
    })
};

viewEmployees = () => {
    db.query("SELECT employee.id AS 'employee id', employee.first_name AS 'first name', employee.last_name AS 'last name', role.title AS 'job title', department.name AS 'department', role.salary AS salary, CONCAT(m.first_name, m.last_name) AS 'manager' FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee m on m.id = employee.manager_id;", function (err, results) {
        if (err) {
        throw err
    } else {
        const table = cTable.getTable(results)
        console.log(table)
        menu()
    }
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name', 
            message: 'What is the name of the department?'
        }
    ]).then(answers => {
        db.query("INSERT INTO department (name) VALUES (?)", answers.department_name, function (err, results) {
            if (err) {
                throw err
            } else {
                console.log('Success! Here are the departments:')
                viewDepartments();
            }
        })
    })
};


    // .then(([row]) => {
    //     let departments = rows;
    //     const departmentChoices = departments.map(({ id, name }) => ({
    //         name: name,
    //         value: id
    //     }))
    // })

viewDept = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT department.name AS 'department name', department.id AS 'department id' FROM department", function (err, results) {
            if (err) {
                return reject(err)
            } else {
                const table = cTable.getTable(results)
                console.log(table)
                return resolve(results);
            }
    })
    })
}

addRole = async () => {
    try {
        const queryDept = await viewDept();
        const inputResponse = await inquirer.prompt([
            {
                type: 'input',
                name: 'role_name', 
                message: 'What is the name of the role?'
            },
            {
                type: 'number',
                name: 'role_salary', 
                message: 'What is the salary for this role?',
            },
            {
                input: 'number',
                name: 'role_department', 
                message: 'What department does this role belong in? (see chart)',
                // choices: queryDept
            }
        ])
        .then(answers => {
                let newRole = {
                    title: answers.role_name, 
                    salary: answers.role_salary,
                    department_id: answers.role_department
                }
                console.log(newRole)
                db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", (answers.role_name, answers.role_salary, answers.role_department), function (err, results) {
                    console.log('Success! New role was added')
                    viewRoles();
                })
        })
    } catch (err) {
        throw err
    }






    // .then(answers => {
    //     // TODO: ADD ROLE TO DATABASE
    //     createRole(answers)
    //     .then(() => console.log(`Added ${answers.title} to data`))
    //     .then(() => menu())

    // })
};

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