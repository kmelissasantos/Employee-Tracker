USE employeeTracker;

INSERT INTO departments
(department_name)
VALUES
('Management'),
('Marketing'),
('Sales'),
('Technology'),
('Customer Service');

INSERT INTO roles
(title, salary, department_id)
VALUES
('HR Manager', 50000.00, 1),
('Sales Manager', 75000.00, 1),
('Executive Assistance', 60000.00, 1),
('Sales Rep', 50000.00, 1),
('IT Technician', 45000.00, 1),
('Marketing Assistant', 40000.00, 1),
('Customer Service Rep', 35000.00, 1);



INSERT INTO employees
(first_name, last_name, role_id, manager_id)
VALUES
('Melissa', 'Santos', 1, 727),
('Nellie', 'Santos', 27, 365),
('Miguel', 'Dominguez', 07, 777),
('Nina', 'Ninerz', 64, 737),
('Navi', 'Johnson', 23, 672);