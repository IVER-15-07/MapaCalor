from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    nombre_usuario: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    nombre_usuario: str
    email: EmailStr
    rol_id: int
    estado: str
    es_activo: bool
    fecha_creacion: Optional[datetime] = None

class UserApprove(BaseModel):
    super_admin_id: int

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    rol: str
