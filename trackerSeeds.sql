USE tracker_db;

INSERT INTO employeeTbl (first_name, last_name, role_id, manager_id)
VALUES("John", "Doe", 1, 2), ("Some", "Body", 2, 3), ("Mike", "Chan", 3, 1), ("Ashley", "Rodriguez", 4, null), ("Victor", "Coozone", 5, null), ("Joanne", "McJames", 6, 1), ("Tom", "Papa", 7, null), ("Mark", "Normand", 8, 7), ("Joe", "List", 9, 7), ("Mike", "Schmidt", 10, null);

INSERT INTO roleTbl (title, salary, department_id)
VALUES ("CEO", 400000, 1), ("Sales Lead", 99000, 2), ("Salesperson", 80000, 2), ("Lead Engineer", 150000, 3), ("Software Engineer", 120000, 3), ("Accountant", 125000, 4), ("Legal Team Lead", 250000, 5), ("Lawyer", 190000, 5), ("Lead Engineer", 150000, 3);

INSERT INTO departmentTbl (name)
VALUES ("Cheif"), ("Sales"), ("Engineering"), ("Finance"), ("Legal");
