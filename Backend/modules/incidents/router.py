from fastapi import APIRouter, Depends, HTTPException, Query

from modules.incidents.dependencies import get_incident_service
from modules.incidents.schema import ClientIncidentResponse, HeatmapStateResponse, SectorByDateResponse
from modules.incidents.service import IncidentService


router = APIRouter()


@router.get("/historial", response_model=SectorByDateResponse)
def get_by_sector_and_date(
    fecha_registro: str = Query(..., description="Valor de la columna FECHA_REGISTRO"),
    service: IncidentService = Depends(get_incident_service),
) -> SectorByDateResponse:

    try:
        summary = service.get_incidents_summary_by_date(fecha_registro)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"No se pudo leer el Excel: {error}") from error

    return SectorByDateResponse(
        fecha_registro=fecha_registro,
        total=summary["total_sectores"],
        total_incidentes=summary["total_incidentes"],
        sectores=summary["sectores"],
        incidentes_por_sector=summary["incidentes_por_sector"],
    )


@router.get("/clientes", response_model=ClientIncidentResponse)
def get_client_records(
    fecha_registro: str | None = Query(default=None, description="Filtrar por FECHA_REGISTRO (opcional)"),
    limit: int = Query(default=1000, ge=1, le=5000, description="Cantidad maxima de registros"),
    service: IncidentService = Depends(get_incident_service),
) -> ClientIncidentResponse:

    try:
        items = service.get_client_records(fecha_registro=fecha_registro, limit=limit)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"No se pudo leer el Excel: {error}") from error

    return ClientIncidentResponse(total=len(items), items=items)


@router.get("/heatmap-state", response_model=HeatmapStateResponse)
def get_heatmap_state(
    fecha_registro: str = Query(..., description="Fecha a consultar en el mapa"),
    mode: str = Query(default="auto", description="auto | normal | critical"),
    threshold: int | None = Query(default=None, ge=1, le=100000, description="Umbral de llamadas"),
    service: IncidentService = Depends(get_incident_service),
) -> HeatmapStateResponse:

    try:
        result = service.get_heatmap_state(fecha_registro=fecha_registro, mode=mode, threshold=threshold)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"No se pudo procesar el mapa de calor: {error}") from error

    return HeatmapStateResponse(**result)


@router.get("/heatmap-mes", response_model=HeatmapStateResponse)
def get_heatmap_month(
    year_month: str = Query(..., description="Mes a consultar en formato YYYY-MM (ej: 2026-05)"),
    mode: str = Query(default="auto", description="auto | normal | critical"),
    threshold: int | None = Query(default=None, ge=1, le=100000, description="Umbral de llamadas"),
    service: IncidentService = Depends(get_incident_service),
) -> HeatmapStateResponse:
    """Obtiene el mapa de calor para un mes completo"""
    try:
        result = service.get_heatmap_state_by_month(year_month=year_month, mode=mode, threshold=threshold)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"No se pudo procesar el mapa de calor del mes: {error}") from error

    return HeatmapStateResponse(**result)


@router.get("/heatmap-rango", response_model=HeatmapStateResponse)
def get_heatmap_range(
    fecha_desde: str = Query(..., description="Fecha inicial del rango (YYYY-MM-DD o similar)"),
    fecha_hasta: str = Query(..., description="Fecha final del rango (YYYY-MM-DD o similar)"),
    mode: str = Query(default="auto", description="auto | normal | critical"),
    threshold: int | None = Query(default=None, ge=1, le=100000, description="Umbral de llamadas"),
    service: IncidentService = Depends(get_incident_service),
) -> HeatmapStateResponse:
    """Obtiene el mapa de calor para un rango de fechas"""
    try:
        result = service.get_heatmap_state_by_date_range(
            fecha_inicio=fecha_desde, fecha_fin=fecha_hasta, mode=mode, threshold=threshold
        )
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"No se pudo procesar el mapa de calor del rango: {error}") from error

    return HeatmapStateResponse(**result)

