SELECT * FROM employee;
SELECT * FROM roles;
SELECT * FROM departments;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Erin","Downs", 2, null), ("Evan","Downs", 1, null), ("Clayton", "Richardson", 3, null), ("Kelyn", "Jones", 4, null), ("Nick", "Lay", 5, null), ("George", "Downs", 6, null),("Judy", "Downs", 7, null), ("Laura", "Crisp", 7, null), ("Taylor", "Rutherford", 2, null);
    
INSERT INTO roles (title, salary)
VALUE ("Lead Engineer", 150000), ("Software Engineer", 120000), ("Sales Lead",10000), ("Salesperson",80000), ("Accountant",12500), ("Legal Team Lead",250000), ("Lawyer",190000);

INSERT INTO departments (department_name)
VALUE ("Sales"), ("Engineering"), ("Finance"), ("Legal");

SELECT Orders.OrderID, Customers.CustomerName, Shippers.ShipperName
FROM ((Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID)
INNER JOIN Shippers ON Orders.ShipperID = Shippers.ShipperID);

SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, roles.department_id, roles.salary, employee.manager_id
FROM employees
INNER JOIN roles ON roles.title = employee.role_id
INNER JOIN departments ON departments.department_name = roles.department_id;