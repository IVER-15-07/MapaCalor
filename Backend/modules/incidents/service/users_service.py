import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.hash import bcrypt

from core.exceptions import AppException
from ..repository import users_repository
from ..schema.users_schema import UserRegister, UserOut, UserLogin, TokenOut

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "cambia-esto-en-produccion")
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60 * 8  # 8 horas

def registrar_admin(data: UserRegister) -> UserOut:
    if users_repository.get_by_correo(data.correo):
        raise AppException(400, "Ya existe un usuario con ese correo")
    
    if users_repository.get_by_usuario(data.usuario):
        raise AppException(400, "Ya existe ese nombre de usuario")

    rol = users_repository.get_rol_by_nombre("admin")
    if not rol:
        raise AppException(500, "Rol 'admin' no configurado")

    password_hash = bcrypt.hash(data.password)
    usuario = users_repository.create(
        nombre=data.nombre,
        usuario=data.usuario,
        correo=data.correo,
        password_hash=password_hash,
        rol_id=rol["id"],
        estado="pendiente",
    )
    return UserOut(**usuario)

def listar_pendientes() -> list[UserOut]:
    rows = users_repository.get_pendientes()
    return [UserOut(**row) for row in rows]

def _validar_super_admin(super_admin_id: int):
    admin = users_repository.get_by_id(super_admin_id)
    if not admin:
        raise AppException(404, "Super admin no encontrado")
    rol = users_repository.get_rol_by_nombre("super_admin")
    if not rol or admin["rol_id"] != rol["id"]:
        raise AppException(403, "Solo el super_admin puede aprobar o rechazar cuentas")

def aprobar_usuario(usuario_id: int, super_admin_id: int) -> UserOut:
    _validar_super_admin(super_admin_id)
    usuario = users_repository.set_estado(usuario_id, "aprobado", super_admin_id)
    if not usuario:
        raise AppException(400, "El usuario no existe o ya fue procesado")
    return UserOut(**usuario)

def rechazar_usuario(usuario_id: int, super_admin_id: int) -> UserOut:
    _validar_super_admin(super_admin_id)
    usuario = users_repository.set_estado(usuario_id, "rechazado", super_admin_id)
    if not usuario:
        raise AppException(400, "El usuario no existe o ya fue procesado")
    return UserOut(**usuario)

def _crear_token(usuario_id: int, rol_nombre: str) -> str:
    payload = {
        "sub": str(usuario_id),
        "rol": rol_nombre,
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def login(data: UserLogin) -> TokenOut:
    usuario = users_repository.get_by_correo(data.correo)
    if not usuario:
        raise AppException(401, "Credenciales inválidas")

    if not bcrypt.verify(data.password, usuario["password"]):
        raise AppException(401, "Credenciales inválidas")

    if usuario.get("estado") != "aprobado":
        raise AppException(403, f"Cuenta en estado '{usuario.get('estado')}', no puede iniciar sesión")

    if not usuario.get("es_activo"):
        raise AppException(403, "Cuenta desactivada")

    rol = users_repository.get_rol_by_id(usuario["rol_id"])
    rol_nombre = rol["nombre_rol"] if rol else "sin_rol"
    token = _crear_token(usuario["id"], rol_nombre)
    return TokenOut(access_token=token, rol=rol_nombre)