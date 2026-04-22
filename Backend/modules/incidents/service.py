from modules.incidents.repository import ExcelIncidentRepository


class IncidentService:
    def __init__(self, repository: ExcelIncidentRepository):
        self.repository = repository

    def get_sectors_by_date(self, fecha_registro: str) -> list[str]:
        return self.repository.get_sectors_by_date(fecha_registro)

    def get_incidents_summary_by_date(self, fecha_registro: str) -> dict[str, object]:
        return self.repository.get_incidents_summary_by_date(fecha_registro)