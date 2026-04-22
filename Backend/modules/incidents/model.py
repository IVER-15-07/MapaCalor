from pydantic import BaseModel, ConfigDict


class IncidentRecord(BaseModel):
	sector_operativo: str | None = None
	fecha_registro: str | None = None

	model_config = ConfigDict(extra="allow")
