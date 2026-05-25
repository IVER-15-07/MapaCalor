from db.connection import execute_query

def get_all():
    query = """
        SELECT id, titulo, descripcion, sector, estado, fecha
        FROM incidents
        ORDER BY fecha DESC
    """
    return execute_query(query)

def get_by_id(incident_id: int):
    query = """
        SELECT id, titulo, descripcion, sector, estado, fecha
        FROM incidents
        WHERE id = %s
    """
    result = execute_query(query, (incident_id,))
    return result[0] if result else None

def create(data: dict):
    query = """
        INSERT INTO incidents (titulo, descripcion, sector, estado, fecha)
        VALUES (%(titulo)s, %(descripcion)s, %(sector)s, 'abierto', NOW())
        RETURNING id, titulo, descripcion, sector, estado, fecha
    """
    result = execute_query(query, data)
    return result[0] if result else None

def update(incident_id: int, data: dict):
    # Solo actualiza los campos que vienen
    fields = []
    params = {}
    for key, value in data.items():
        if value is not None:
            fields.append(f"{key} = %({key})s")
            params[key] = value

    if not fields:
        return get_by_id(incident_id)

    params["id"] = incident_id
    query = f"""
        UPDATE incidents
        SET {', '.join(fields)}
        WHERE id = %(id)s
        RETURNING id, titulo, descripcion, sector, estado, fecha
    """
    result = execute_query(query, params)
    return result[0] if result else None

def delete(incident_id: int):
    query = """
        DELETE FROM incidents
        WHERE id = %s
        RETURNING id
    """
    result = execute_query(query, (incident_id,))
    return result[0] if result else None