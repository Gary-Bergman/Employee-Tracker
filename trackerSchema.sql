DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

use tracker_db;

-- Table for departments
CREATE TABLE departmentTbl (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

-- Table for roles
CREATE TABLE roleTbl (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    CONSTRAINT fk_dptFK FOREIGN KEY (department_id) REFERENCES departmentTbl(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

-- Table for employees
CREATE TABLE employeeTbl (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT(30) NOT NULL,
    manager_id INT DEFAULT NULL,
    CONSTRAINT fk_roleFK FOREIGN KEY (role_id) REFERENCES roleTbl(id) ON DELETE CASCADE,
    INDEX man_ind (manager_id),
    CONSTRAINT fk_managerFK FOREIGN KEY (manager_id) REFERENCES employeeTbl(id) ON DELETE SET NULL,
    PRIMARY KEY (id)
);


