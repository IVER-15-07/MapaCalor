from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Rol:
    id: Optional[int] = None
    nombre_rol: Optional[str] = None
    descripcion: Optional[str] = None
    es_activo: Optional[bool] = None

@dataclass
class Usuario:
    id: Optional[int] = None
    nombre: Optional[str] = None
    usuario: Optional[str] = None
    correo: Optional[str] = None
    password: Optional[str] = None
    rol_id: Optional[int] = None
    estado: Optional[str] = None
    es_activo: Optional[bool] = None
    aprobado_por_usuario_id: Optional[int] = None
    fecha_aprobacion: Optional[datetime] = None
    fecha_creacion: Optional[datetime] = None
    fecha_actualizacion: Optional[datetime] = None