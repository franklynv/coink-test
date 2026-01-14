CREATE OR REPLACE PROCEDURE sp_create_user(
    p_name VARCHAR,
    p_phone VARCHAR,
    p_address TEXT,
    p_country_id INT,
    p_department_id INT,
    p_municipality_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validar país
    IF NOT EXISTS (SELECT 1 FROM country WHERE id = p_country_id) THEN
        RAISE EXCEPTION 'Country does not exist';
    END IF;

    -- Validar departamento
    IF NOT EXISTS (
        SELECT 1 FROM department 
        WHERE id = p_department_id AND country_id = p_country_id
    ) THEN
        RAISE EXCEPTION 'Department does not belong to country';
    END IF;

    -- Validar municipio
    IF NOT EXISTS (
        SELECT 1 FROM municipality 
        WHERE id = p_municipality_id AND department_id = p_department_id
    ) THEN
        RAISE EXCEPTION 'Municipality does not belong to department';
    END IF;

    INSERT INTO app_user(name, phone, address, country_id, department_id, municipality_id)
    VALUES (p_name, p_phone, p_address, p_country_id, p_department_id, p_municipality_id);
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_countries()
RETURNS TABLE(id INT, name VARCHAR, iso_code VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT country.id, country.name, country.iso_code FROM country ORDER BY country.name;
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_departments(p_country_id INT)
RETURNS TABLE(id INT, name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT department.id, department.name FROM department
    WHERE department.country_id = p_country_id
    ORDER BY department.name;
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_municipalities(p_department_id INT)
RETURNS TABLE(id INT, name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT municipality.id, municipality.name FROM municipality
    WHERE municipality.department_id = p_department_id
    ORDER BY municipality.name;
END;
$$;
