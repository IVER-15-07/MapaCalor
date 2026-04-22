from core.config import get_settings
from modules.incidents.repository import ExcelIncidentRepository
from modules.incidents.service import IncidentService


def get_incident_repository() -> ExcelIncidentRepository:
    settings = get_settings()
    return ExcelIncidentRepository(
        source_path=settings.incidents_excel_path,
        sheet_name=settings.incidents_excel_sheet_name,
    )


def get_incident_service() -> IncidentService:
    return IncidentService(get_incident_repository())