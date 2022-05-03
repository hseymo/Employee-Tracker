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
    db.query("SELECT employee.id AS 'employee id', employee.first_name AS 'first name', employee.last_name AS 'last name', role.title AS 'job title', department.name AS 'department', role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS 'manager' FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee m on m.id = employee.manager_id;", function (err, results) {
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
            message: 'What is the name of the department?',
            validate: (ans) => {
                if (ans.trim() !== ''){
                    return true;
                }
                return 'Please enter a department name'
            }
        }
    ]).then(answers => {
        db.query(`SELECT * FROM department`, function (error, results) {
            if (error) {
                throw error
            } else {
                for (let i = 0; i <results.length; i++) {
                    if (results[i].name.toLowerCase() == answers.department_name.toLowerCase()) {
                        console.log('Department already exists!')
                        menu();
                        return;
                    }
                }
                db.query("INSERT INTO department (name) VALUES (?)", answers.department_name, function (err, results) {
                    if (err) {
                        throw err
                    } else {
                        console.log('Success! New department added!')
                        menu();
                    }
                })
            }
        })
    })
};

PromiseDept = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM department", function (err, results) {
            if (err) {
                return reject(err)
            } else {
                const departmentChoices = results.map(({name, id}) => ({
                    name:name,
                    value:id
                }))
                return resolve(departmentChoices);
            }
        })
    })
}

PromiseEmp = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM employee", function (err, results) {
            if (err) {
                return reject(err)
            } else {
                const employeeChoices = results.map(({first_name, last_name, id}) => ({
                    name: first_name + ' ' + last_name,
                    value:id
                }))
                return resolve(employeeChoices);
            }
        })
    })
}

PromiseRole = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM role", function (err, results) {
            if (err) {
                return reject(err)
            } else {
                const roleChoices = results.map(({title, id}) => ({
                    name: title,
                    value:id
                }))
                return resolve(roleChoices);
            }
        })
    })
}


addRole = async () => {
    try {
        const queryDept = await PromiseDept();
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
                type: 'list',
                name: 'role_department', 
                message: 'What department does this role belong in? (see chart)',
                choices: queryDept,
            }
        ])
        .then(answers => {
            let newRole = {
                title: answers.role_name, 
                salary: answers.role_salary,
                department_id: parseInt(answers.role_department)
            }
            db.query(`INSERT INTO role (title, salary, department_id)VALUES (?, ?, ?)`, [newRole.title, newRole.salary, newRole.department_id], function (err, results) {
                console.log('Success! New role was added');
                menu();
            })
        })
    } catch (err) {
        throw err
    }
};

addEmployee = async () => {
    try {
        const roleChoices = await PromiseRole();
        const managerChoices = await PromiseEmp();
        managerChoices.push({value: null})
        const inputResponse = await inquirer.prompt([
            {
                type: 'input',
                name: 'employee_first', 
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'employee_last', 
                message: "What is the employee's last name?"
            },
            {
                type: 'list',
                name: 'employee_role', 
                message: "What is the employee's role?",
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'employee_manager', 
                message: "Who is the employee's manager?",
                choices: managerChoices
            },
        ]).then(answers => {
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.employee_first, answers.employee_last, answers.employee_role, answers.employee_manager], function (err, results) {
                console.log('Success! Employee added.')
                menu()
            })
        })
    } catch (err) {
        throw err
    }
};

updateEmployeeRole = async () => {
    try {
        const employeeChoices = await PromiseEmp();
        const roleChoices = await PromiseRole();
        const inputResponse = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id', 
                message: 'Who is the employee you would like to update?',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'new_role',
                message: 'What is their new role?',
                choices: roleChoices
            }
        ])
        .then(answers => {
            db.query('UPDATE employee SET role_id = (?) WHERE id = (?)', [answers.new_role, answers.employee_id], function (err, results) {
                console.log('Success! Role was updated');
                menu()
            })
        })
    } catch (err) {
        throw err
    }
};

finish = () => {
    console.log('Goodbye!')
};