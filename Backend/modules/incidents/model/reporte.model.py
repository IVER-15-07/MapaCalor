from dataclasses import dataclass
from typing import Optional


@dataclass
class ResumenKPIs:
    total_incidencias: int
    resueltas: int
    pendientes: int


@dataclass
class IncidenciasPorDia:
    dia: str
    incidencias: int
    resueltas: int

@dataclass
class DistribucionTipo:
    categoria: str
    total: int


@dataclass
class TendenciaMensual:
    mes: str
    total_incidencias: int

