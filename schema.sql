DROP DATABASE IF EXISTS empolyeemanager_db;
-- Create a new database called employeemanager_db
CREATE DATABASE employeemanager_db;

-- Connect to the employeemanager_db
\c employeemanager_db;


-- Create a table called department
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL -- to hold department name
);

-- Create a table called role
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL, -- to hold role title
    salary DECIMAL(10, 2) NOT NULL, -- to hold role salary
    department_id INT NOT NULL, -- to hold reference to department
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create a table called employee
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, -- to hold employee first name
    last_name VARCHAR(30) NOT NULL, -- to hold employee last name
    role_id INT NOT NULL, -- to hold reference to role
    manager_id INT, -- to hold reference to another employee
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);