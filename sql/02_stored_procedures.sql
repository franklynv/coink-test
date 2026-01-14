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
    IF NOT EXISTS (SELECT 1 FROM country WHERE id = p_country_id) THEN
        RAISE EXCEPTION 'Country does not exist';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM department 
        WHERE id = p_department_id AND country_id = p_country_id
    ) THEN
        RAISE EXCEPTION 'Department does not belong to country';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM municipality 
        WHERE id = p_municipality_id AND department_id = p_department_id
    ) THEN
        RAISE EXCEPTION 'Municipality does not belong to department';
    END IF;

    INSERT INTO app_user(name, phone, address, country_id, department_id, municipality_id, row_status)
    VALUES (p_name, p_phone, p_address, p_country_id, p_department_id, p_municipality_id, 1);
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_users(
    p_search VARCHAR DEFAULT '',
    p_page INT DEFAULT 1,
    p_page_size INT DEFAULT 10
)
RETURNS TABLE(
    id INT,
    name VARCHAR,
    phone VARCHAR,
    address TEXT,
    country_id INT,
    country_name VARCHAR,
    department_id INT,
    department_name VARCHAR,
    municipality_id INT,
    municipality_name VARCHAR,
    created_at TIMESTAMP,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH filtered_users AS (
        SELECT u.* FROM app_user u
        WHERE u.row_status = 1
        AND (p_search = '' OR u.name ILIKE '%' || p_search || '%' OR u.phone ILIKE '%' || p_search || '%')
    ),
    total AS (
        SELECT COUNT(*) as cnt FROM filtered_users
    )
    SELECT 
        u.id,
        u.name,
        u.phone,
        u.address,
        u.country_id,
        c.name as country_name,
        u.department_id,
        d.name as department_name,
        u.municipality_id,
        m.name as municipality_name,
        u.created_at,
        t.cnt as total_count
    FROM filtered_users u
    INNER JOIN country c ON u.country_id = c.id
    INNER JOIN department d ON u.department_id = d.id
    INNER JOIN municipality m ON u.municipality_id = m.id
    CROSS JOIN total t
    ORDER BY u.created_at DESC
    LIMIT p_page_size OFFSET (p_page - 1) * p_page_size;
END;
$$;

CREATE OR REPLACE FUNCTION sp_get_user_by_id(p_user_id INT)
RETURNS TABLE(
    id INT,
    name VARCHAR,
    phone VARCHAR,
    address TEXT,
    country_id INT,
    department_id INT,
    municipality_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.name, u.phone, u.address, u.country_id, u.department_id, u.municipality_id
    FROM app_user u
    WHERE u.id = p_user_id AND u.row_status = 1;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_user(
    p_id INT,
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

    UPDATE app_user
    SET name = p_name,
        phone = p_phone,
        address = p_address,
        country_id = p_country_id,
        department_id = p_department_id,
        municipality_id = p_municipality_id
    WHERE id = p_id AND row_status = 1;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_delete_user(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE app_user SET row_status = 0 WHERE id = p_id;
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
