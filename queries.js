
// VIEW DEPARTMENTS, ROLES, AND EMPLOYEES 
function showEmployeeInfo() {
    console.log("Finding employees...\n");
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.department_name, roles.salary, employee.manager_id FROM ((roles LEFT JOIN employee ON employee.role_id = roles.id) RIGHT JOIN departments ON departments.id = roles.department_id) ORDER BY employee.id;", (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();
    });
};


// ADD DEPARTMENTS, ROLES, AND EMPLOYEES

// UPDATE EMPLOYEE ROLES

// DELETE DEPARTMENTS, ROLES, AND EMPLOYEES

module.exports = showEmployeeInfo();