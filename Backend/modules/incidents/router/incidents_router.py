from fastapi import APIRouter, Query
from core.response import success_response
from modules.incidents.service import incidencias_service

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("/dia")
def listar_por_dia(
    fecha: str = Query(..., description="YYYY-MM-DD")
):
    incidencias = incidencias_service.listar_por_dia(fecha)
    return success_response(data=incidencias, mensaje="Incidencias del día obtenidas correctamente")


@router.get("/mes")
def listar_por_mes(
    anio: int = Query(..., description="Ej: 2026"),
    mes: int = Query(..., ge=1, le=12, description="1-12")
):
    incidencias = incidencias_service.listar_por_mes(anio, mes)
    return success_response(data=incidencias, mensaje="Incidencias del mes obtenidas correctamente")


@router.get("/rango")
def listar_por_rango(
    fecha_inicio: str = Query(..., description="YYYY-MM-DD"),
    fecha_fin: str = Query(..., description="YYYY-MM-DD")
):
    incidencias = incidencias_service.listar_por_rango(fecha_inicio, fecha_fin)
    return success_response(data=incidencias, mensaje="Incidencias del rango obtenidas correctamente")