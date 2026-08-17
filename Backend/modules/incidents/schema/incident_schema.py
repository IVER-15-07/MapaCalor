from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Union

class IncidentBase(BaseModel):
    segmento: Optional[Union[str, int]] = None
    producto: Optional[Union[str, int]] = None    
    servicio: Optional[Union[str, int]] = None
    sector_operativo: Optional[Union[str, int]] = None
    dano: Optional[Union[str, int]] = None        
    fecha_registro: Optional[datetime] = None
    punto_venta: Optional[Union[str, int]] = None
    actividad: Optional[Union[str, int]] = None
    personal_diagnostico: Optional[Union[str, int]] = None


    