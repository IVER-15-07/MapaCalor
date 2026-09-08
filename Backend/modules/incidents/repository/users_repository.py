from db.connection import execute_query

TABLE_USUARIOS = "bi.usuarios_app"
TABLE_ROLES = "bi.roles_app"

def get_by_usuario(usuario: str) -> dict | None:
    query = f"""
        SELECT id, nombre, usuario, correo, password, rol_id, estado, es_activo, fecha_creacion
        FROM {TABLE_USUARIOS}
        WHERE LOWER(usuario) = LOWER('{usuario.strip()}');
    """
    rows = execute_query(query)
    return rows[0] if rows else None


def get_by_correo(correo: str) -> dict | None:
    query = f"""
        SELECT id, nombre, usuario, correo, password, rol_id, estado, es_activo, fecha_creacion
        FROM {TABLE_USUARIOS}
        WHERE LOWER(correo) = LOWER('{correo.strip()}');
    """
    rows = execute_query(query)
    return rows[0] if rows else None


def get_by_id(usuario_id: int) -> dict | None:
    query = f"""
        SELECT id, nombre, usuario, correo, password, rol_id, estado, es_activo, fecha_creacion
        FROM {TABLE_USUARIOS}
        WHERE id = {usuario_id};
    """
    rows = execute_query(query)
    return rows[0] if rows else None


def get_rol_by_nombre(nombre_rol: str) -> dict | None:
    query = f"""
        SELECT id, nombre_rol, descripcion, es_activo
        FROM {TABLE_ROLES}
        WHERE LOWER(nombre_rol) = LOWER('{nombre_rol.strip()}');
    """
    rows = execute_query(query)
    return rows[0] if rows else None


def get_rol_by_id(rol_id: int) -> dict | None:
    query = f"""
        SELECT id, nombre_rol, descripcion, es_activo
        FROM {TABLE_ROLES}
        WHERE id = {rol_id};
    """
    rows = execute_query(query)
    return rows[0] if rows else None


def get_pendientes() -> list[dict]:
    query = f"""
        SELECT id, nombre, usuario, correo, rol_id, estado, es_activo, fecha_creacion
        FROM {TABLE_USUARIOS}
        WHERE estado = 'pendiente'
        ORDER BY fecha_creacion DESC;
    """
    return execute_query(query) or []


def create(nombre: str, usuario: str, correo: str, password_hash: str, rol_id: int, estado: str = "pendiente") -> dict:
    query = f"""
        INSERT INTO {TABLE_USUARIOS} (
            nombre, usuario, correo, password, rol_id, estado, es_activo, fecha_creacion
        ) VALUES (
            '{nombre}', '{usuario}', '{correo}', '{password_hash}', {rol_id}, '{estado}', true, NOW()
        )
        RETURNING id, nombre, usuario, correo, rol_id, estado, es_activo, fecha_creacion;
    """
    rows = execute_query(query)
    return rows[0] if rows else {}


def set_estado(usuario_id: int, nuevo_estado: str, super_admin_id: int) -> dict | None:
    query = f"""
        UPDATE {TABLE_USUARIOS}
        SET estado = '{nuevo_estado}',
            aprobado_por_usuario_id = {super_admin_id},
            fecha_aprobacion = NOW()
        WHERE id = {usuario_id}
        RETURNING id, nombre, usuario, correo, rol_id, estado, es_activo, fecha_creacion;
    """
    rows = execute_query(query)
    return rows[0] if rows else None