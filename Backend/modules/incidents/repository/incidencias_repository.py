from db.connection import execute_query

TABLE = "bi.aggcw_danios_help"

def get_by_dia(fecha: str):
    """
    Obtiene los registros de la tabla bi.aggcw_danios_hrlp filtrados por fecha.
    :param fecha: Fecha en formato 'YYYY-MM-DD'.
    :return: Lista de diccionarios con los registros encontrados.
    """
    query = f"""
    SELECT * FROM {TABLE}
    WHERE fecha_registro = %s
    ORDER BY fecha_registro DESC;
    """
    return execute_query(query, (fecha,))

def get_by_fecha_range(fecha_inicio: str, fecha_fin: str):
    """
    Obtiene los registros de la tabla bi.aggcw_danios_hrlp filtrados por un rango de fechas.
    :param fecha_inicio: Fecha de inicio en formato 'YYYY-MM-DD'.
    :param fecha_fin: Fecha de fin en formato 'YYYY-MM-DD'.
    :return: Lista de diccionarios con los registros encontrados.
    """
    query = f"""
    SELECT * FROM {TABLE}
    WHERE fecha_registro BETWEEN %s AND %s
    ORDER BY fecha_registro DESC;
    """
    return execute_query(query, (fecha_inicio, fecha_fin))

def get_by_mes(anio: int, mes: int):
    """
    Obtiene los registros de la tabla bi.aggcw_danios_hrlp filtrados por año y mes.
    :param anio: Año en formato 'YYYY'.
    :param mes: Mes en formato 'MM'.
    :return: Lista de diccionarios con los registros encontrados.
    """
    query = f"""
    SELECT * FROM {TABLE}
    WHERE EXTRACT(YEAR FROM fecha_registro) = %s
      AND EXTRACT(MONTH FROM fecha_registro) = %s
    ORDER BY fecha_registro DESC;
    """
    return execute_query(query, (anio, mes))

def get_all():
    """
    Obtiene todos los registros de la tabla bi.aggcw_danios_hrlp.
    :return: Lista de diccionarios con todos los registros.
    """
    query = f"""
    SELECT * FROM {TABLE}
    ORDER BY fecha_registro DESC;
    """
    return execute_query(query)

