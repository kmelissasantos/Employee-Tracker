USE employeeTracker;

INSERT INTO department
(name)
VALUES
('HR'),
('Management');

INSERT INTO role
(title, salary, department_id)
VALUES
('HR Manager', 50000.00, 1);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
('Melissa', 'Santos', 1, 727);