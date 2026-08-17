from modules.incidents.repository import  incidencias_repository
from modules.incidents.schema.incident_schema import IncidentBase
from core.exceptions import AppException
from datetime import datetime



def _parsear_fecha(fecha: str) -> None:
    try:
        datetime.strptime(fecha, "%Y-%m-%d")
    except ValueError:
        raise AppException(400, f"Formato de fecha inválido: '{fecha}'. Usa YYYY-MM-DD")



def listar_por_dia(fecha: str) -> list[IncidentBase]:
    _parsear_fecha(fecha)

    try:
        rows = incidencias_repository.get_by_dia(fecha)
    except Exception as e:
        raise AppException(500, f"Error al consultar incidencias por día: {e}")

    return [IncidentBase(**row) for row in rows]


def listar_por_mes(anio: int, mes: int) -> list[IncidentBase]:
    if not (1 <= mes <= 12):
        raise AppException(400, "El mes debe estar entre 1 y 12")
    if anio < 2000 or anio > 2100:
        raise AppException(400, "El año no es válido")

    try:
        rows = incidencias_repository.get_by_mes(anio, mes)
    except Exception as e:
        raise AppException(500, f"Error al consultar incidencias por mes: {e}")

    return [IncidentBase(**row) for row in rows]


def listar_por_rango(fecha_inicio: str, fecha_fin: str) -> list[IncidentBase]:
    _parsear_fecha(fecha_inicio)
    _parsear_fecha(fecha_fin)

    if fecha_inicio > fecha_fin:
        raise AppException(400, "'fecha_inicio' no puede ser mayor que 'fecha_fin'")

    try:
        rows = incidencias_repository.get_by_fecha_range(fecha_inicio, fecha_fin)
    except Exception as e:
        raise AppException(500, f"Error al consultar incidencias por rango: {e}")
    return [IncidentBase(**row) for row in rows]