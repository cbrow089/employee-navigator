import inquirer from 'inquirer';
import pg from 'pg';

import dotenv from 'dotenv'

dotenv.config();

const { Pool } = pg;

const newPool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASS, 
    port: 5432,
});

newPool.connect() 
    .then(() => console.log('connected to database'))
    .catch(err => console.error('connection error', err.stack));

// input for questions about what the user wants to do with the database of employees
const questions = [
    // starts the action for all of the inputs.  Will return to this question after each action chain.
    // Question index 0  
    {
        type: 'input',
        name: 'action',
        message: 'What would you like to do?',

    },
    // input for adding a department for the database
    // Question index 1
    {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department you would like to add?',
    },
    // input for adding a role for the database
    // Question index 2
    {
        type: 'input',
        name: 'role',
        message: 'What is the name of the role?',
    },
    // input for adding a salary in the database for the new role added by the previous question
    // Question index 3
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
    },
    // input for adding the newly created role to a department
    // Question index 4
    {
        type: 'input',
        name: 'department',
        message: 'Which department does the role belong to?',
    },

    // input for adding an employee to the database.  This will ask a series of questions to set up the employee and their details to the database starting with their first name.
    // Question index 5
    {
        type: 'input',
        name: 'firstName',
        message: `'What is the employee's first name?'`,
    },
    // input for adding an employee's last name to the database
    // Question index 6
    {
        type: 'input',
        name: 'lastName',
        message: `'What is the employee's last name?'`,
    },
    // input for adding an employee's role to the database
    // Question index 7
    {
        type: 'input',
        name: 'employeeRole',
        message: `'What is the employee's new role?'`,
    },
    // input for adding an employee's manager to the database
    // Question index 8
    {
        type: 'input',
        name: 'employeeManager',
        message: `'Who is the employee's manager?'`,
    },
    // input for updating an employee's role in the database selected from a list of existing employees inside the database.
    // Question index 9
    {
        type: 'list',
        name: 'employees',
        message: `'Which employee's role do you want to update?'`,
    },
     // Question index 10
     {
        type: 'input',
        name: 'departmentToDelete',
        message: 'What is the name of the department you would like to delete?',
    },
    // Question index 11
    {
        type: 'input',
        name: 'roleToDelete',
        message: 'What is the name of the role you would like to delete?',
    },
    // Question index 12
    {
        type: 'input',
        name: 'employeeToDelete',
        message: 'What is the name of the employee you would like to delete?',
    },
    // Question index 13
    {
        type: 'input',
        name: 'departmentBudget',
        message: 'What is the name of the department you would like to view the total budget of?',
    },
];


async function init() {
    try {
        const answers = await inquirer.prompt(questions[0]); // Await the prompt for the main action
        

        if (answers.action === 'add department') {
            const departmentAnswers = await inquirer.prompt(questions[1]); // Await the prompt for department
            await addDepartment(departmentAnswers.department); // Await the addDepartment function
            await init(); // Return to the main question after adding the department

        } else if (answers.action === 'add role') {
            const roleAnswers = await inquirer.prompt(questions.slice(2, 5)); // Await the prompt for role
            await addRole(roleAnswers.role, roleAnswers.salary, roleAnswers.department); // Await the addRole function
            await init(); // Return to the main question after adding the role

        } else if (answers.action === 'view all roles') {
            await viewAllRoles(); // Await the viewAllRoles function

        } else if (answers.action === 'view all departments') {
            await viewAllDepartments(); // Await the viewAllDepartments function

        } else if (answers.action === 'add employee') {
            const employeeAnswers = await inquirer.prompt(questions.slice(5, 9)); // Await the prompt for employee details
            
            await addEmployee(employeeAnswers.firstName, employeeAnswers.lastName, employeeAnswers.employeeRole, employeeAnswers.employeeManager); // Await the addEmployee function
            await init(); // Return to the main question after adding the employee

        } else if (answers.action === 'update employee role') {
            const nameAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'employeeName',
                    message: 'Enter the full name of the employee (first and last):'
                }
            ]);
            const employeeName = nameAnswers.employeeName; // Get the employee's name

            const roleAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newRole',
                    message: 'What is the new role for the employee?'
                }
            ]);
            const newRole = roleAnswers.newRole; // Get the new role
            await updateEmployeeRole(employeeName, newRole); // Await the update function
            await init(); // Return to the main question after updating the role

        } else if (answers.action === 'update employee manager') {
            await updateEmployeeManager(); // Await the updateEmployeeManager function

        } else if (answers.action === 'view all employees') {
            await viewAllEmployees(); // Await the viewAllEmployees function

        } else if (answers.action === 'view all employees by department') {
            await viewAllEmployeesByDepartment(); // Await the viewAllEmployeesByDepartment function

        } else if (answers.action === 'view all employees by manager') {
            await viewAllEmployeesByManager(); // Await the viewAllEmployeesByManager function

        } else if (answers.action === 'delete department') {
            const {departmentToDelete} = await inquirer.prompt(questions[10]); // Await the prompt for deleting department
            
            await deleteDepartment(departmentToDelete); // Await the deleteDepartment function

        } else if (answers.action === 'delete role') {
            const {roleToDelete} = await inquirer.prompt(questions[11]); // Await the prompt for deleting role
           
            await deleteRole(roleToDelete); // Await the deleteRole function

        } else if (answers.action === 'delete employee') {
            const {employeeToDelete} = await inquirer.prompt(questions[12]); // Await the prompt for deleting employee
           
            await deleteEmployee(employeeToDelete); // Await the deleteEmployee function

        } else if (answers.action === 'view total budget of department') {
            const {departmentBudget} = await inquirer.prompt(questions[13]); // Await the prompt for budget
            
            await viewTotalBudget(departmentBudget); // Await the viewTotalBudget function

        } else if (answers.action === 'exit') {
            console.log('Goodbye!'); // Exit the program
            newPool.end(); // Close the database connection
        } else {
            console.log('Invalid action. Please try again.');
            await init(); // Return to the main question
        }} catch (error) {
            console.error('Error in init function:', error);
            await init(); // Return to the main question in case of an error
        };
    }

// Function to add a role to the database
async function addRole(role, salary, department) {
    try {
        const checkRole = "SELECT * FROM role WHERE title = $1";
        const roleResult = await newPool.query(checkRole, [role]);

        if (roleResult.rows.length > 0) {
            console.log('Role already exists. Please choose a different name.');
            await init(); // return to the main question
            return; // Exit the function early
        }

        const getDepartmentId = "SELECT id FROM department WHERE name = $1";
        const departmentResult = await newPool.query(getDepartmentId, [department]);

        // Check if the department was found
        if (departmentResult.rows.length === 0) {
            console.log('Department not found. Please ensure the department exists.');
            await init(); // return to the main question
            return; // Exit the function early
        }

        const departmentId = departmentResult.rows[0].id;
        const newRole = "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)";
        await newPool.query(newRole, [role, salary, departmentId]);

        console.log('Role added');
        await init(); // return to the main question
    } catch (err) {
        console.error('Error adding role:', err.stack); // Added error handling
    }
}

// function to add a department to the database
async function addDepartment(department) {
    try {
        const checkDepartment = "SELECT * FROM department WHERE name = $1";
        const result = await newPool.query(checkDepartment, [department]);

        if (result.rows.length > 0) {
            console.log('Department already exists. Please choose a different name.');
            await init(); // return to the main question
            return; // Exit the function early
        }

        const newDepartment = "INSERT INTO department (name) VALUES ($1)";
        await newPool.query(newDepartment, [department]);

        console.log('Department added');
        await init(); // return to the main question
    } catch (err) {
        console.error('Error adding department:', err.stack); // Added error handling
        await init(); // Return to the main question after an error
    }
}

// function to add an employee to the database
async function addEmployee(firstName, lastName, role, manager) {
    // First, get the role ID based on the role name
    const roleIdQuery = `SELECT id FROM role WHERE title = $1`;
    const roleResult = await newPool.query(roleIdQuery, [role]);

    if (roleResult.rows.length === 0) {
        console.log('Role not found. Please ensure the role exists.');
        return; // Exit the function early if the role doesn't exist
    }

    const roleId = roleResult.rows[0].id; // Get the role ID

    if (manager) {
        const managerParts = manager.split(' '); // Split the name into parts
        const managerFirstName = managerParts[0]; // First name
        const managerLastName = managerParts.slice(1).join(' '); // Last name (handles multiple parts)

        // Query to get the manager's ID based on their name
        const managerIdQuery = `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`;
        const result = await newPool.query(managerIdQuery, [managerFirstName, managerLastName]);

        if (result.rows.length === 0) {
            console.log('Manager not found. Please ensure the manager exists.');
            return; // Exit the function early if the manager doesn't exist
        }

        const managerId = result.rows[0].id; // Get the manager ID from the query result

        // Insert the new employee (do not include id)
        const newEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
        await newPool.query(newEmployee, [firstName, lastName, roleId, managerId]);
        console.log("Employee added successfully!");
    } else {
        // Handle the case where no manager name is provided
        console.log("No manager provided. Employee will be added without a manager.");
        const newEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
        await newPool.query(newEmployee, [firstName, lastName, roleId, null]); // Set manager_id to null
        console.log("Employee added successfully!");
    }
}

// function to update an employee's role in the database
async function updateEmployeeRole(employee, newRole) {
    const employeeParts = employee.split(' '); // Split the name into parts
    const employeeFirstName = employeeParts[0]; // First name
    const employeeLastName = employeeParts.slice(1).join(' '); // Last name (handles multiple parts)

    try {
        // Query to get the employee's ID based on their name
        const employeeIdQuery = `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`;
        const employeeResult = await newPool.query(employeeIdQuery, [employeeFirstName, employeeLastName]);

        if (employeeResult.rows.length === 0) {
            console.log('Employee not found. Please ensure the name is correct.');
            await init(); // return to the main question
            return; // Exit the function early
        }

        const employeeId = employeeResult.rows[0].id; // Get the employee ID from the query result

        // Query to get the role's ID based on the role name
        const roleIdQuery = `SELECT id FROM role WHERE title = $1`;
        const roleResult = await newPool.query(roleIdQuery, [newRole]);

        if (roleResult.rows.length === 0) {
            console.log('Role not found. Please ensure the role exists.');
            await init(); // return to the main question
            return; // Exit the function early
        }

        const roleId = roleResult.rows[0].id; // Get the role ID from the query result

        // Update the employee's role
        const updateRole = `UPDATE employee SET role_id = $1 WHERE id = $2`;
        await newPool.query(updateRole, [roleId, employeeId]);

        console.log('Employee role updated');
        await init(); // return to the main question
    } catch (err) {
        console.error('Error updating employee role:', err);
        await init(); // Return to the main question after an error
    }
}

// Function to view all roles in the database
async function viewAllRoles() {
    const query = "SELECT * FROM role";
    
    try {
        const res = await newPool.query(query);
        console.table(res.rows); // Display results in a table format
    } catch (err) {
        console.error('Error retrieving roles', err);
    } finally {
        await init(); // return to the main question
    }
}

// function to view all departments in the database
async function viewAllDepartments() {
    const query = "SELECT * FROM department";
    
    try {
        const res = await newPool.query(query);
        console.table(res.rows); // Display results in a table format
    } catch (err) {
        console.error('Error retrieving departments', err);
    } finally {
        await init(); // return to the main question
    }
}

// function to view all employees in the database
async function viewAllEmployees() {
    const query = "SELECT * FROM employee";
    
    try {
        const res = await newPool.query(query);
        console.table(res.rows); // Display results in a table format
    } catch (err) {
        console.error('Error retrieving employees', err);
    } finally {
        await init(); // return to the main question
    }
}


// bonus functions

// function to update an employee's manager in the database
async function updateEmployeeManager() {
    try {
        // First prompt for the employee's name
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'employeeName',
                message: 'Enter the full name of the employee (first and last):'
            }
        ]);

        const employeeName = answers.employeeName; // Get the employee's name

        // Now prompt for the new manager
        const managerAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'newManager',
                message: 'Who is the new manager for the employee?'
            }
        ]);

        const newManager = managerAnswers.newManager; // Get the new manager
        
        // Call the function to update the employee's manager in the database
        await updateManagerInDatabase(employeeName, newManager);

        console.log('Employee manager updated successfully!'); // Confirmation message
    } catch (err) {
        console.error('Error updating employee manager:', err);
    } finally {
        await init(); // Return to the main question after updating the manager or an error
    }
}

// Function to update an employee's manager in the database
async function updateManagerInDatabase(employeeName, newManager) {
    try {
        console.log('New Manager:', newManager);
        console.log('Employee Name:', employeeName);
        
        const query = `
            UPDATE employee 
            SET manager_id = (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = $1) 
            WHERE CONCAT(first_name, ' ', last_name) = $2
        `;
        await db.query(query, [newManager, employeeName]); // Ensure both parameters are provided
        await init(); // return to the main question
    } catch (error) {
        console.error('Error updating manager in database:', error);
    }
}

// function to view all employees by department in the database
async function viewAllEmployeesByDepartment() {
    const query = `
        SELECT e.first_name, e.last_name, r.title, d.name AS department
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
    `;

    try {
        const res = await newPool.query(query);
        console.table(res.rows); // Display results in a table format
        await init(); // return to the main question
    } catch (err) {
        console.error('Error retrieving employees by department', err);
    } 
}

// function to view all employees by manager in the database
async function viewAllEmployeesByManager() {
    // Query to get all employees and their managers
    
    const query = `
        SELECT e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN employee m ON e.manager_id = m.id
    `;

    try {
        const res = await newPool.query(query);
        console.table(res.rows); // Display results in a table format
        await init(); // return to the main question
    } catch (err) {
        console.error('Error retrieving employees by manager', err);
    } 
}
// function to delete a department from the database
async function deleteDepartment(department) {
    const query = "DELETE FROM department WHERE name = $1";
    
    try {
        await newPool.query(query, [department]);
        console.log('Department deleted');
        await init(); // return to the main question
    } catch (err) {
        console.error('Error deleting department', err);
    } 
}


// function to delete a role from the database
async function deleteRole(role) {
    const query = "DELETE FROM role WHERE title = $1";
    
    try {
        await newPool.query(query, [role]);
        console.log('Role deleted');
        await init(); // return to the main question
    } catch (err) {
        console.error('Error deleting role', err);
    } 
}
// function to delete an employee from the database
async function deleteEmployee(employee) {
    const query = "DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = $1";
    
    try {
        console.log('Attempting to delete employee:', employee);
        const result = await newPool.query(query, [employee]);
        
        if (result.rowCount === 0) {
            console.log('No employee found with that name.');
        } else {
            console.log('Employee deleted');
        }
        await init(); // return to the main question
    } catch (err) {
        console.error('Error deleting employee', err);
    } 
}
// function to view the total budget of a department in the database
async function viewTotalBudget(department) {
    const query = `
        SELECT d.name AS department, SUM(r.salary * emp_count) AS total_budget
        FROM role r
        JOIN department d ON r.department_id = d.id
        LEFT JOIN (
            SELECT role_id, COUNT(*) AS emp_count
            FROM employee
            GROUP BY role_id
        ) e ON e.role_id = r.id
        WHERE d.name = $1
        GROUP BY d.name
    `;

    try {
        const res = await newPool.query(query, [department]);
        console.log('Query Result:', res.rows); // Debug log to check the result

        if (res.rows.length > 0) {
            console.table(res.rows); // Display results in a table format
        } else {
            console.log(`No budget information found for department: ${department}`);
        }
        await init(); // return to the main question
    } catch (err) {
        console.error(`Error retrieving total budget for department ${department}:`, err);
    } 
}


// function to initialize the app
init();