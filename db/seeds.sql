INSERT INTO department (id, name)
VALUES 
    (1, "accounting"),
    (2, "engineering"),
    (3, "human resources");

INSERT INTO role (id, title, salary, department_id)
VALUES
    (100, "CFO", 150000, 1),
    (101, "Controller", 120000, 1),
    (102, "Payroll Specialist", 70000, 1),

    (200, "VP Engineer", 150000, 2),
    (201, "Manager", 120000, 2),
    (202, "Sr Engineer", 130000, 2),
    (203, "Jr. Engineer", 75000, 2),

    (300, "Manager", 100000, 3),
    (301, "Benefits Specialist", 70000, 3),
    (302, "Onboarding Specialist", 70000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES 
    (5000, "Eric", "Church", 100, NULL),
    (5001, "Aaron", "Carter", 101, 5000),
    (5002, "Luke", "Bryan", 102, 5001),
    (5003, "Cody", "Johnson", 102, 5001),

    (6000, "Blake", "Shelton", 200, NULL),
    (6001, "Luke", "Combs", 201, 6000),
    (6002, "Morgan", "Wallen", 202, 6001),
    (6003, "Rodney", "Atkins", 202, 6001),
    (6004, "Craig", "Campbell", 203, 6001),
    (6005, "Kelsea", "Ballerini", 203, 6002),

    (7000, "Shania", "Twain", 300, NULL),
    (7001, "Russell", "Dickerson", 301, 7000),
    (7002, "Justin", "Moore", 301, 7001),
    (7003, "Jon", "Pardi", 302, 7001),
    (7004, "Maren", "Morris", 302, 7001);