from pydantic import BaseModel


class SectorIncidentCount(BaseModel):
	sector_operativo: str
	total_incidentes: int


class SectorByDateResponse(BaseModel):
	fecha_registro: str
	total: int
	total_incidentes: int
	sectores: list[str]
	incidentes_por_sector: list[SectorIncidentCount]
