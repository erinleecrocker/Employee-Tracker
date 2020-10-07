const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Bubbles92",
    database: "employee_db",
});
  
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    showEmployeeInfo();
});

// VIEW DEPARTMENTS, ROLES, AND EMPLOYEES 
function showEmployeeInfo() {
    console.log("Finding Employees...\n");
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.department_name, roles.salary, employee.manager_id FROM ((roles LEFT JOIN employee ON employee.role_id = roles.id) RIGHT JOIN departments ON departments.id = roles.department_id) ORDER BY employee.id;", (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();
    });
};


// ADD DEPARTMENTS, ROLES, AND EMPLOYEES
function addEmployeeInfo() {
    console.log("Adding employees...\n");
    connection.query("",(err, res) => {
        if (err) throw err;
        
    })
}
// UPDATE EMPLOYEE ROLES

// DELETE DEPARTMENTS, ROLES, AND EMPLOYEES