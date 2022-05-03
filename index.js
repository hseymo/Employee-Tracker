const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// establish connection
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

// main menu with actions and switch statement
function menu() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "What do you want to do?", 
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', "Update an employee's manager", 'Finish']
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
            case "Update an employee's manager":
                updateEmployeeManager();
                break;
            default: 
                finish();
                break;
        }
    })
}

// query statement for departments with name and id
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

// query statement for roles with job titles, role ids, department that the role belongs to and the salary
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

// query statement for employee with id, first and last name, job title, department, salary and manager by name
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
        // check if department already exists
        db.query(`SELECT * FROM department`, function (error, results) {
            if (error) {
                throw error
            } else {
                for (let i = 0; i <results.length; i++) {
                    // if so alert user and retun to menu
                    if (results[i].name.toLowerCase() == answers.department_name.toLowerCase()) {
                        console.log('Department already exists!')
                        menu();
                        return;
                    }
                }
                // otherwise insert new department with values provided, trimming white space
                db.query("INSERT INTO department (name) VALUES (?)", answers.department_name.trim(), function (err, results) {
                    if (err) {
                        throw err
                    } else {
                        console.log(`Success! ${answers.department_name.trim()} was added!`)
                        menu();
                    }
                })
            }
        })
    })
};

// create promise functions for later adding functions; return choices to use as array in inquirer prompt
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

// create promise functions for later adding functions; return choices to use as array in inquirer prompt
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

// create promise functions for later adding functions; return choices to use as array in inquirer prompt
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
        // use promise functions to create array choices in department prompt
        const queryDept = await PromiseDept();
        const inputResponse = await inquirer.prompt([
            {
                type: 'input',
                name: 'role_name', 
                message: 'What is the name of the role?',
                validate: (ans) => {
                    if (ans.trim() !== ''){
                        return true;
                    }
                    return 'Please enter a role'
                }
            },
            {
                type: 'input',
                name: 'role_salary', 
                message: 'What is the salary for this role?',
                validate: (answer) => {
                    // regex expression to ensure only numbers are used
                    const pass = answer.match(/^[0-9]*$/);
                    if (pass){
                        return true;
                    }
                    return 'Please enter a salary with only numbers'
                }
            },
            {
                type: 'list',
                name: 'role_department', 
                message: 'What department does this role belong in?',
                // result of promise function
                choices: queryDept
            }
        ])
        .then(answers => {
            // check if role already exists
            db.query(`SELECT * FROM role`, function (error, results) {
                if (error) {
                    throw error
                } else {
                    for (let i = 0; i <results.length; i++) {
                        // if it does, alert user and send back to menu
                        if (results[i].title.toLowerCase() == answers.role_name.toLowerCase()) {
                            console.log('Role already exists!')
                            menu();
                            return;
                        }
                    }
                    let newRole = {
                        // trim white space
                        title: answers.role_name.trim(), 
                        salary: answers.role_salary,
                        department_id: parseInt(answers.role_department)
                    }
                    // otherwise add to role table
                    db.query(`INSERT INTO role (title, salary, department_id)VALUES (?, ?, ?)`, [newRole.title, newRole.salary, newRole.department_id], function (err, results) {
                        console.log(`Success! ${newRole.title} was added`);
                        menu();
                    })
                }
            })
        })
    } catch (err) {
        throw err
    }
};

addEmployee = async () => {
    try {
        // use promise functions to establish choices for inquirer prompts
        const roleChoices = await PromiseRole();
        const managerChoices = await PromiseEmp();
        // want option to not have a manager
        managerChoices.push({value: null})
        const inputResponse = await inquirer.prompt([
            {
                type: 'input',
                name: 'employee_first', 
                message: "What is the employee's first name?",
                validate: (ans) => {
                    if (ans.trim() !== ''){
                        return true;
                    }
                    return "Please enter employee's first name"
                }
            },
            {
                type: 'input',
                name: 'employee_last', 
                message: "What is the employee's last name?",
                validate: (ans) => {
                    if (ans.trim() !== ''){
                        return true;
                    }
                    return "Please enter employee's last name"
                }
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
            // insert into employee table, trimming white space
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.employee_first.trim(), answers.employee_last.trim(), answers.employee_role, answers.employee_manager], function (err, results) {
                console.log(`Success! ${answers.employee_first.trim()} was added.`)
                menu()
            })
        })
    } catch (err) {
        throw err
    }
};

updateEmployeeRole = async () => {
    try {
        // use promise functions to create choice arrays
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
                console.log(`Success! Role was updated!`);
                menu()
            })
        })
    } catch (err) {
        throw err
    }
};

updateEmployeeManager = async () => {
    try {
        // use promise functions to create choice arrays
        const employeeChoices = await PromiseEmp();
        const inputResponse = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id', 
                message: 'Who is the employee you would like to update?',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'new_manager',
                message: 'Who is their new manager?',
                choices: employeeChoices
            }
        ])
        .then(answers => {
            db.query('UPDATE employee SET manager_id = (?) WHERE id = (?)', [answers.new_manager, answers.employee_id], function (err, results) {
                console.log(`Success! Manager was updated!`);
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