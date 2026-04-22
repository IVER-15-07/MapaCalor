from fastapi import APIRouter, Depends, HTTPException, Query

from modules.incidents.dependencies import get_incident_service
from modules.incidents.schema import SectorByDateResponse
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

