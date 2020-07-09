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
    -- CONSTRAINT fk_departmentTbl FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
    PRIMARY KEY (id)
);

-- Table for employees
CREATE TABLE employeeTbl (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    -- CONSTRAINT fk_roleTbl FOREIGN KEY (role_id) REFERENCES roleTbl(id) ON DELETE CASCADE
    PRIMARY KEY (id)
);


-- CREATE TABLE role (
--   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--   title VARCHAR(30) UNIQUE NOT NULL,
--   salary DECIMAL UNSIGNED NOT NULL,
--   department_id INT UNSIGNED NOT NULL,
--   INDEX dep_ind (department_id),
--   CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
-- );