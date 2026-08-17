from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Incidencia:
    segmento: Optional[str] = None
    producto: Optional[str] = None
    servicio: Optional[str] = None
    dano: Optional[str] = None
    sector_operativo: Optional[str] = None
    fecha_registro: Optional[datetime] = None
    punto_venta: Optional[str] = None
    actividad: Optional[str] = None
    personal_diagnostico: Optional[str] = None