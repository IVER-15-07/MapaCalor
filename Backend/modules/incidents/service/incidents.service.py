from modules.incidents import repository
from modules.incidents.schema import IncidentCreate, IncidentUpdate
from core.exceptions import AppException

def get_all():
    result = repository.get_all()
    return result

def get_by_id(incident_id: int):
    incident = repository.get_by_id(incident_id)
    if not incident:
        raise AppException(
            status_code=404,
            detail=f"Incidente {incident_id} no encontrado"
        )
    return incident

def create(data: IncidentCreate):
    result = repository.create(data.model_dump())
    if not result:
        raise AppException(
            status_code=500,
            detail="Error al crear el incidente"
        )
    return result

def update(incident_id: int, data: IncidentUpdate):
    # Verifica que existe
    repository.get_by_id(incident_id) or (
        (_ for _ in ()).throw(
            AppException(status_code=404, detail=f"Incidente {incident_id} no encontrado")
        )
    )
    result = repository.update(incident_id, data.model_dump())
    if not result:
        raise AppException(
            status_code=500,
            detail="Error al actualizar el incidente"
        )
    return result

def delete(incident_id: int):
    incident = repository.get_by_id(incident_id)
    if not incident:
        raise AppException(
            status_code=404,
            detail=f"Incidente {incident_id} no encontrado"
        )
    result = repository.delete(incident_id)
    if not result:
        raise AppException(
            status_code=500,
            detail="Error al eliminar el incidente"
        )
    return result