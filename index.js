const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Bubbles92",
    database: "employee_db",
});

let employeeNamesArray = [];
let departmentsArray = [];
let rolesArray = [];

  
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    getEmployees();
    getDepartmentNames();
    getRoleTitles();
    initialQuestion();
});

function initialQuestion() {
    inquirer
        .prompt([
            {
            type: "list",
            name: "InitialQuestion",
            message: "What would you like to do?",
            choices: [
            "View All Employees",
            "View Employees by Departments",
            "Add a new Employee",
            "Add a new Role",
            "Add a new Department",
            "Update Employee's Role",
            "Exit",
          ],
        },
      ])
      .then((data) => {
        console.log(data);
        if (data.InitialQuestion === "View All Employees") {
            showAll();
        } else if (data.InitialQuestion === "View Employees by Departments") {
            showByDepartments();
        } else if (data.InitialQuestion === "Add a new Employee") {
            addEmployee();
        } else if (data.InitialQuestion === "Add a new Role") {
            addRoles();
        } else if (data.InitialQuestion === "Add a new Department") {
            addDepartments();
        } else if ( data.InitialQuestion === "Update Employee's Role") {
            // console.log("updated Employees");
            updeateEmployeeRoles();
        } else if (data.InitialQuestion === "Exit") {
            console.log("-------------------------------------");
            console.log("You have existed the Employee Tracker.");
            console.log("-------------------------------------");
            connection.end();
        };
    });
};

// VIEW DEPARTMENTS, ROLES, AND EMPLOYEES 
function showAll() {
    console.log("Finding Employees, Roles, and Departments...\n");
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.department_name, roles.salary, employee.manager_id FROM ((roles JOIN employee ON employee.role_id = roles.id) JOIN departments ON departments.id = roles.department_id) ORDER BY employee.id;", (err, res) => {
      if (err) throw err;
      console.table(res);
      initialQuestion()
    });
};

// VIEW EMPLOYEES BY DEPARTMENTS
function showByDepartments() {
    inquirer
      .prompt({
        type: "list",
        name: "chooseDepartment",
        message: "What department would you like to search for?",
        choices: departmentsArray
      })
      .then(function(answer) {
        console.log(`Finding Employees in ${answer.chooseDepartment}...\n`);
        var query = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.department_name, roles.salary, employee.manager_id FROM ((roles INNER JOIN employee ON employee.role_id = roles.id) INNER JOIN departments ON departments.id = roles.department_id) WHERE departments.department_name = ?";
        connection.query(query,[answer.chooseDepartment], function (err, res) {
        if (err) throw err;
        console.table(res);
        initialQuestion();
        });
    });
};

// RETRIEVE DEPARTMENT NAME
function getDepartmentNames() {
    connection.query("SELECT departments.department_name FROM departments ORDER BY id",(err, res) =>{
        if (err) throw err;
        departmentsArray = res.map(({ department_name }) => department_name);
    });
};
// RETRIEVE ROLE TITLES
function getRoleTitles() {
    connection.query("SELECT title FROM roles ORDER BY id",(err,res) =>{
        if (err) throw err;
        rolesArray = res.map(({ title }) => title);
    });
};
// RETRIEVE EMPLOYEE NAMES AND ID's
function getEmployees() {
    connection.query("SELECT first_name, last_name FROM employee", (err, res) =>{
        if(err) throw err;
          var employeenames = [];
        for (i=0; i<res.length; i++) {
            employeenames.push(`${res[i].first_name} ${res[i].last_name}`);
        }
        employeeNamesArray = employeenames;
    });
}

// VIEW ROLES
function showRoles() {
    console.log("Finding Department Roles...\n");
    connection.query("SELECT roles.title, roles.salary, departments.department_name FROM (roles RIGHT JOIN departments ON departments.id = roles.department_id);",(err, res) =>{
        if (err) throw err;
        console.table(res);
        initialQuestion()
    })
}

//ADD EMPLOYEES
function addEmployee()  {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the Employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the Employee's last name?"
        },
        {
            type: "list",
            name: "role",
            message: "What is the Employee's role?",
            choices: rolesArray
        }

    ]).then((answer) => {
        console.log(`Adding ${answer.firstName} ${answer.lastName} the ${answer.role} ...\n`);
        var roleID = rolesArray.indexOf(answer.role) +1;
        console.log(roleID);
        var query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)"
        connection.query(query,[answer.firstName, answer.lastName, roleID, null],(err, res) => {
        if (err) throw err;
        console.log("Successfully added new employee!");
        getRoleTitles();
        initialQuestion();
        getEmployees();
        })
    })
}
//ADD ROLES
function addRoles(){
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the Role?"
        },
        {
            type: "input",
            name: "salary",
            message: "what is the designated salary for this Role?"
        },
        {
            type: "list",
            name: "department",
            message: "Which department should this Role be in?",
            choices: departmentsArray
        }

    ]).then((answer) => {
        console.log(`Adding ${answer.title} the ${answer.department} ...\n`);
        var departmentID = departmentsArray.indexOf(answer.department) +1;
        console.log(departmentID);
        var query = "INSERT INTO roles (title, salary, department_id) VALUE(?,?,?)";
        connection.query(query,[answer.title, answer.salary, departmentID],(err, res) => {
        if (err) throw err;
        console.log("Successfully added a new role!");
        getDepartmentNames();
        initialQuestion();
        });
    });
};

//ADD DEPARTMENTS
function addDepartments(){
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the Department?"
        }

    ]).then((answer) => {
        console.log(`Adding ${answer.name} to the list of departments ...\n`);
        var query = "INSERT INTO departments (department_name) VALUE ( ? ) ";
        connection.query(query,[answer.name],(err, res) => {
        if (err) throw err;
        console.log("Successfully added a new department!");
        getDepartmentNames();
        initialQuestion();
        });
    });
};

// UPDATE EMPLOYEE ROLES
function updeateEmployeeRoles(){
    inquirer.prompt([
        {
            type: "list",
            name: "name",
            message: "Which Employee would you like to change roles?",
            choices: employeeNamesArray
        },
        {
            type: "list",
            name: "whichRole",
            message: "What is this employee's new role?",
            choices: rolesArray
        }

    ]).then((answer) => {
        console.log(`Changing ${answer.name}'s role to ${answer.whichRole} ...\n`);
        // var employeeArray = departmentsArray.indexOf(answer.department) +1;
        // console.log(answer);
        // var query = "REPLACE (employee.role,) FROM employee WHERE ( ? )";
        // connection.query(query,[answer.title, answer.salary, departmentID],(err, res) => {
        // if (err) throw err;
        // console.log("Successfully changed Employee Role!");
        // getEmployees();
        // getDepartmentNames();
        initialQuestion();
        // });
        
    });
};
function updateEmployeeRoles(){
    console.log("Updating employee role...\n");
    connection.query("",(err,res)=>{
        if (err) throw err;
        console.log("Successfully updated employee's role");
        initialQuestion()
    });
}

// DELETE DEPARTMENTS, ROLES, AND EMPLOYEES
