from fastapi import APIRouter
from modules.incidents import service
from modules.incidents.schema import IncidentCreate, IncidentUpdate
from core.response import success_response

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("/")
def get_all():
    return success_response(
        data=service.get_all(),
        mensaje="Incidentes obtenidos"
    )

@router.get("/{incident_id}")
def get_one(incident_id: int):
    return success_response(
        data=service.get_by_id(incident_id),
        mensaje="Incidente encontrado"
    )

@router.post("/", status_code=201)
def create(data: IncidentCreate):
    return success_response(
        data=service.create(data),
        mensaje="Incidente creado",
        status=201
    )

@router.patch("/{incident_id}")
def update(incident_id: int, data: IncidentUpdate):
    return success_response(
        data=service.update(incident_id, data),
        mensaje="Incidente actualizado"
    )

@router.delete("/{incident_id}")
def delete(incident_id: int):
    service.delete(incident_id)
    return success_response(
        data=None,
        mensaje="Incidente eliminado"
    )