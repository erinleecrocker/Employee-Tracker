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

function initialQuestion() {
    inquirer
        .prompt([
            {
            name: "InitialQuestion",
            message: "What would you like to do?",
          type: "list",
          choices: [
            "Show All Employees",
            "Show All Roles",
            "Show All Departments",
            "Add an Employee",
            "Add a Department",
            "Add a Department Role",
            "Update Employee's Role",
            "Exit",
          ],
        },
      ])
      .then((data) => {
        console.log(data);
        if (data.InitialQuestion === "Show All Employees") {
            showAll();
        } else if (data.InitialQuestion === "Show All Roles") {
            showRoles();
        } else if (data.InitialQuestion === "Show All Departments") {
            showDepartments();
        } else if (data.InitialQuestion === "Add An Employee") {
            
        } else if (data.InitialQuestion === "Add a Department") {
          
        } else if (data.InitialQuestion === "Add a Department Role") {
          
        } else if ( data.InitialQuestion === "Update Employee's Role") {
          
        } else if (data.InitialQuestion === "Exit") {
          console.log("You have exited the Employee Tracker.");
        }
    });
};

function toAddEmployee() {
    inquirer
      .prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is this employee's first name?",
          
        },
        {
            type: "input",
            name: "lastName",
            message: "What is this employee's last name?",
        },
        {
            type: "list",
            name: "Role",
            message: "What is this employee's role?",
            choices: employeeRoles,
        }
      ])
      .then((response) => {
          console.log(response);
        connection.query(
          `INSERT INTO employee (first_name, last_name) VALUES` +
            `("${response.employeeFirstName}", "${response.employeeLastName}")`
        ),
          
        (err, data) => {
          if (err) throw err;
        };
        console.log("Added An Employee");
        init();
      });
  }

// VIEW DEPARTMENTS, ROLES, AND EMPLOYEES 
function showAll() {
    console.log("Finding Employees, Roles, and Departments...\n");
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.department_name, roles.salary, employee.manager_id FROM ((roles LEFT JOIN employee ON employee.role_id = roles.id) RIGHT JOIN departments ON departments.id = roles.department_id) ORDER BY employee.id;", (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();
    });
};
// VIEW DEPARTMENTS
function showDepartments() {
    console.log("Finding Departments...\n");
    connection.query("SELECT * FROM departments",(err, res) =>{
        if (err) throw err;
        console.table(res);
        connection.end();
    })
}
// VIEW ROLES
function showRoles() {
    console.log("Finding Department Roles...\n");
    connection.query("SELECT roles.title, roles.salary, departments.department_name FROM (roles RIGHT JOIN departments ON departments.id = roles.department_id);",(err, res) =>{
        if (err) throw err;
        console.table(res);
        connection.end();
    })
}

//ADD EMPLOYEES
function addEmployeeInfo() {
    console.log("Adding new employee...\n");
    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE ('testname', 'testlastname', 2, null)",(err, res) => {
        if (err) throw err;
        console.log("Successfully added new employee!");
        connection.end();

    });
}
//ADD ROLES
function addRoleInfo() {
    console.log("Adding new role...\n");
    connection.query("INSERT INTO roles (title, salary, department_id) VALUE('newtitle',19999, 1)",(err, res) => {
        if (err) throw err;
        console.log("Successfully added new role!");
        connection.end();
    });
}
//ADD DEPARTMENTS
function addDepartmentInfo() {
    console.log("Adding new department...\n");
    connection.query("INSERT INTO departments (department_name) VALUE('testdepartmentName')",(err, res) => {
        if (err) throw err;
        console.log("Successfully added new department!");
    });
}
// UPDATE EMPLOYEE ROLES
function updateEmployeeRoles(){
    console.log("Updating employee role...\n");
    connection.query("",(err,res)=>{
        if (err) throw err;
        console.log("Successfully updated employee's role");
    });
}

// DELETE DEPARTMENTS, ROLES, AND EMPLOYEES