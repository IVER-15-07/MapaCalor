from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class IncidentCreate(BaseModel):
    titulo: str
    descripcion: str
    sector: str

class IncidentUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    sector: Optional[str] = None

class IncidentResponse(BaseModel):
    id: int
    titulo: str
    descripcion: str
    sector: str
    estado: str
    fecha: datetime

    class Config:
        from_attributes = True