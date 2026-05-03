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


class ClientIncidentRecord(BaseModel):
	id: str
	cliente: str
	producto: str
	servicio: str
	danio: str
	direccion: str
	sector: str
	fecha: str


class ClientIncidentResponse(BaseModel):
	total: int
	items: list[ClientIncidentRecord]


class HeatmapCallPoint(BaseModel):
	sector_operativo: str
	total_llamadas: int
	intensidad: str


class HeatmapStateResponse(BaseModel):
	fecha_registro: str
	estado_mapa: str
	umbral_llamadas: int
	total_sectores: int
	total_llamadas: int
	llamadas_por_sector: list[HeatmapCallPoint]
