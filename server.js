const inquirer = require ('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    startQs();
});

const startQs = () => {
  inquirer.prompt({
    type: 'list',
    name: 'starter',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Quit']
  }).then(res => {
    if (res.starter === 'View all departments') {
      getAllDept();
    } else if (res.starter === 'View all roles') {
      getAllRoles();
    } else if (res.starter === 'View all employees') {
      getAllEmployee();
    } else if (res.starter === 'Add a department') {
      addDeptartment();
    } else if (res.starter === 'Add a role') {
      addRole();
    } else if (res.starter === 'Add an employee') {
      addEmployee();
    } else if (res.starter === 'Update employee role') {
      updateEmployee();
    } else {
      console.log('Exiting...');
      return process.exit();
    }
  });
};

function getAllDept() {
  db.query('SELECT * FROM departments', function (err, results) {
    console.table(results);
    if (err) throw (err);
    startQs();
  });
};

function getAllRoles() {
  db.query('SELECT * FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id', function (err, results) {
    console.table(results);
    if (err) throw (err);
    startQs();
  });
};

function getAllEmployee() {
    db.query('SELECT * FROM employees', function (err, results) {
    console.table(results);
    if (err) throw (err);
    startQs();
  });
};

function addDeptartment() {
  inquirer.prompt(
    {
      type: 'input',
      name: 'department_name',
      message: 'What is the new department name?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Department name cannot be empty!');
          return false;
        }
      }
    }
  ).then(data => {
    const params = data.department_name;
    db.query('INSERT INTO departments (department_name) values (?)', params, (err, results) => {
      if (err) throw (err);
      console.log('Department has been added.');
      startQs();
    });
  });
};

function addRole() {
  db.query('SELECT * FROM departments', (err, results) => {
    if (err) throw (err);
    const department_name = results.map(({ department_name, department_id }) => ({
      value: department_id,
      name: `${department_name}`
    }));
    console.log(department_name);
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is title of the role you are adding?',
        validate: titleInput => {
          if (titleInput) {
            return true;
          } else {
            console.log('Role cannot be empty!');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the pay rate for this role?',
        validate: salaryInput => {
          if (salaryInput) {
            return true;
          } else {
            console.log('Salary cannot be empty!');
            return false;
          }
        }
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department does this role fall under?',
        choices: department_name
      }
    ]).then(data => {
      const newRoleData = [
        data.title,
        data.salary,
        data.department
      ];
      db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', newRoleData, (err, results) => {
        if (err) throw (err);
        console.log('Role has been added');
        startQs();
      });
    });
  });
};

function addEmployee() {
  db.query('SELECT roles.role_id, roles.title FROM roles', (err, results) => {
    if (err) throw (err);
    const roles = results.map(roles => ({ value: roles.role_id, name: roles.title }));
    db.query('SELECT * FROM employees', (err, results) => {
      if (err) throw (err);
      const managers = results.map(employees => ({ value: employees.employee_id, name: employees.first_name + ' ' + employees.last_name }));
      return inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'What is the first name of the employee?',
          validate: first_nameInput => {
            if (first_nameInput) {
              return true;
            } else {
              console.log('First name cannot be empty!');
              return false;
            }
          }
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'What is the last name of the employee?',
          validate: last_nameInput => {
            if (last_nameInput) {
              return true;
            } else {
              console.log('Last name cannot be empty!');
              return false;
            }
          }
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'What role is the employee working?',
          choices: roles
        },
        {
          type: 'list',
          name: 'manager_id',
          message: 'Who is the manager for this employee?',
          choices: managers
        }
      ]).then(data => {
        const newEmployeeData = [
          data.first_name,
          data.last_name,
          data.role_id,
          data.manager_id
        ];
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, newEmployeeData, (err, results) => {
          if (err) throw (err);
          console.log(`New employee added!`);
        });
        startQs();
      });
    });
  });
};

function updateEmployee() {
  db.query(`SELECT * FROM employees`, (err, results) => {
    if (err) throw (err);
    const employees = results.map(employees => ({ value: employees.employee_id, name: employees.first_name + ' ' + employees.last_name }));
    db.query(`SELECT * FROM roles`, (err, results) => {
      if (err) throw (err);
      const roles = results.map(roles => ({ value: roles.role_id, name: roles.title }));
      return inquirer.prompt([
        {
          type: 'list',
          name: 'employee_list',
          message: 'Select the employee you would like to update:',
          choices: employees
        },
        {
          type: 'list',
          name: 'newEmpRole',
          message: 'What is the new role for this employee?',
          choices: roles

        }
      ]).then(data => {
        const newRoleData = [data.employee_list, data.newEmployeeRole];
        db.query(`UPDATE employees SET role_id = ? WHERE employee_id = ?`, newRoleData, (err, results) => {
          if (err) throw (err);
          console.log('Employee information updated.');
        });
        startQs();
      })
    })
  });
};