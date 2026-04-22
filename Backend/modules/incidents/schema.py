from pydantic import BaseModel


class SectorByDateResponse(BaseModel):
	fecha_registro: str
	total: int
	sectores: list[str]
