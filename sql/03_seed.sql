INSERT INTO country (name, iso_code) VALUES
('Colombia', 'CO'),
('Perú', 'PE'),
('México', 'MX');

-- Colombia
INSERT INTO department (country_id, name) VALUES
(1, 'Bogotá D.C.'),
(1, 'Antioquia');

INSERT INTO municipality (department_id, name) VALUES
(1, 'Bogotá'),
(2, 'Medellín');

-- Perú
INSERT INTO department (country_id, name) VALUES
(2, 'Lima'),
(2, 'Arequipa');

INSERT INTO municipality (department_id, name) VALUES
(3, 'Lima'),
(4, 'Arequipa');

-- México
INSERT INTO department (country_id, name) VALUES
(3, 'CDMX'),
(3, 'Jalisco');

INSERT INTO municipality (department_id, name) VALUES
(5, 'Ciudad de México'),
(6, 'Guadalajara');
