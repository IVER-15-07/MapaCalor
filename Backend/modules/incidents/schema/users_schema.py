from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    nombre: str
    usuario: str
    correo: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    nombre: str
    usuario: str
    correo: EmailStr
    rol_id: int
    estado: str
    es_activo: bool
    fecha_creacion: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserApprove(BaseModel):
    super_admin_id: int

# 👉 Ahora acepta 'usuario' directamente como texto libre (str)
class UserLogin(BaseModel):
    usuario: str
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    rol: str