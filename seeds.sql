-- Data for department table
INSERT INTO department (name) 
VALUES  ('Engineering'),
        ('Sales'),
        ('Finance'),
        ('Legal');

-- Data for role table
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Sales Lead', 80000, 2),
       ('Accountant', 70000, 3),
       ('Legal Team Lead', 70000, 4);
       

-- Data for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Mike', 'Chan', 2, 1),
       ('Ashley', 'Rodriguez', 3, 1),
       ('Kevin', 'Tupik', 4, 1),
       ('Kunal', 'Singh', 1, 1),
       ('Malia', 'Brown', 2, 1),
       ('Sarah', 'Lourd', 3, 1),
       ('Tom', 'Allen', 4, 1),
       ('Megan', 'Smith', 1, 1),
       ('Ben', 'Finkel', 2, 1);
       