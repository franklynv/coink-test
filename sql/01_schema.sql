CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    iso_code VARCHAR(5) NOT NULL UNIQUE
);

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    country_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_country FOREIGN KEY (country_id)
        REFERENCES country(id)
);

CREATE TABLE municipality (
    id SERIAL PRIMARY KEY,
    department_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_department FOREIGN KEY (department_id)
        REFERENCES department(id)
);

CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    country_id INT NOT NULL,
    department_id INT NOT NULL,
    municipality_id INT NOT NULL,
    row_status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT fk_user_country FOREIGN KEY (country_id) REFERENCES country(id),
    CONSTRAINT fk_user_department FOREIGN KEY (department_id) REFERENCES department(id),
    CONSTRAINT fk_user_municipality FOREIGN KEY (municipality_id) REFERENCES municipality(id)
);
