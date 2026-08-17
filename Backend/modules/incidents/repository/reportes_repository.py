from db.connection import execute_query

TABLE = "bi.aggcw_danios_help"

def get_kpis():
    """
    Obtiene el total de incidencias, resueltas y pendientes.
    """
    query = f"""
        SELECT 
            COUNT(*) AS total_incidencias,
            COUNT(CASE WHEN actividad IS NOT NULL AND actividad != '' THEN 1 END) AS resueltas,
            COUNT(CASE WHEN actividad IS NULL OR actividad = '' THEN 1 END) AS pendientes
        FROM {TABLE};
    """
    return execute_query(query)


def get_incidencias_por_dia():
    """
    Obtiene las incidencias y resueltas agrupadas por día de la semana.
    """
    query = f"""
        SELECT 
            TO_CHAR(fecha_registro, 'Dy') AS dia,
            COUNT(*) AS incidencias,
            COUNT(CASE WHEN actividad IS NOT NULL AND actividad != '' THEN 1 END) AS resueltas
        FROM {TABLE}
        GROUP BY fecha_registro, TO_CHAR(fecha_registro, 'Dy')
        ORDER BY fecha_registro ASC
        LIMIT 7;
    """
    return execute_query(query)


def get_distribucion_tipo():
    """
    Obtiene la distribución por tipo o servicio (gráfico circular superior).
    """
    query = f"""
        SELECT 
            COALESCE(servicio, 'Otros') AS categoria,
            COUNT(*) AS total
        FROM {TABLE}
        GROUP BY servicio
        ORDER BY total DESC;
    """
    return execute_query(query)


def get_tendencia_mensual():
    """
    Obtiene la evolución mensual de incidencias (gráfico de barras inferior).
    """
    query = f"""
        SELECT 
            TO_CHAR(fecha_registro, 'Mon') AS mes,
            COUNT(*) AS total_incidencias
        FROM {TABLE}
        GROUP BY DATE_TRUNC('month', fecha_registro), TO_CHAR(fecha_registro, 'Mon')
        ORDER BY DATE_TRUNC('month', fecha_registro) ASC
        LIMIT 6;
    """
    return execute_query(query)


def get_distribucion_zona():
    """
    Obtiene la distribución por sector o zona geográfica (gráfico circular inferior).
    """
    query = f"""
        SELECT 
            COALESCE(sector_operativo, 'Sin Zona') AS zona,
            COUNT(*) AS total
        FROM {TABLE}
        GROUP BY sector_operativo
        ORDER BY total DESC
        LIMIT 5;
    """
    return execute_query(query)