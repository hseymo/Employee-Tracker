-- SELECT * FROM department;

-- SELECT role.title AS 'job title', role.id AS 'role id', department.name AS department, role.salary
-- FROM role
-- LEFT JOIN department ON role.department_id = department.id; 

-- SELECT employee.id AS 'employee id', employee.first_name AS 'first name', employee.last_name AS 'last name', role.title AS 'job title', department.name AS 'department', CONCAT(m.first_name, m.last_name) AS 'manager'
-- FROM employee
-- LEFT JOIN role on employee.role_id = role.id
-- LEFT JOIN department on role.department_id = department.id
-- LEFT JOIN employee m on m.id = employee.manager_id;

-- INSERT INTO department (name) VALUES ('ES'); 
-- SELECT * FROM department;