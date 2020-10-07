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
let rolesArray = ["Lead Engineer", "Software Engineer", "Sales Lead", "Salesperson","Accountant", "Lead Engineer", "Legal Team Lead", "Lawyer"];

  
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
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
            // "Add a Department Role",
            // "Update Employee's Role",
            // "Exit",
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
        } 
        // else if (data.InitialQuestion === "Add a new Department") {
          
        // } else if ( data.InitialQuestion === "Update Employee's Role") {
          
        // } else if (data.InitialQuestion === "Exit") {
        //   console.log("You have exited the Employee Tracker.");
        // }
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
        console.log(`Adding ${department.name} the list of departments ...\n`);
        var departmentID = departmentsArray.indexOf(answer.department) +1;
        console.log(departmentID);
        var query = "INSERT INTO departments (department_name) VALUE ( ? ) ";
        connection.query(query,[answer.title, answer.salary, departmentID],(err, res) => {
        if (err) throw err;
        console.log("Successfully added a new department!");
        getDepartmentNames();
        initialQuestion();
        });
    });
};

function addDepartmentInfo() {
    console.log("Adding new department...\n");
    connection.query("INSERT INTO departments (department_name) VALUE('testdepartmentName')",(err, res) => {
        if (err) throw err;
        console.log("Successfully added new department!");
        initialQuestion()
    });
}
// UPDATE EMPLOYEE ROLES
function updateEmployeeRoles(){
    console.log("Updating employee role...\n");
    connection.query("",(err,res)=>{
        if (err) throw err;
        console.log("Successfully updated employee's role");
        initialQuestion()
    });
}

// DELETE DEPARTMENTS, ROLES, AND EMPLOYEES
