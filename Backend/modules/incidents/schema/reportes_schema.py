from pydantic import BaseModel
from typing import List



class KPIsSchema(BaseModel):
    total_incidencias: int
    resueltas: int
    pendientes: int
  

class PorDiaSchema(BaseModel):
    dia: str
    incidencias: int
    resueltas: int

class DistribucionTipoSchema(BaseModel):
    categoria: str
    total: int

class TendenciaMensualSchema(BaseModel):
    mes: str
    total_incidencias: int

class DistribucionZonaSchema(BaseModel):
    zona: str
    total: int

class ReporteDashboardCompletoSchema(BaseModel):
    kpis: KPIsSchema
    incidencias_por_dia: List[PorDiaSchema]
    distribucion_tipo: List[DistribucionTipoSchema]
    tendencia_mensual: List[TendenciaMensualSchema]
    distribucion_zona: List[DistribucionZonaSchema]