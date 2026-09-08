import os
from datetime import datetime, timedelta, timezone
from jose import jwt
import bcrypt

from core.exceptions import AppException
from ..repository import users_repository
from ..schema.users_schema import UserRegister, UserOut, UserLogin, TokenOut

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "cambia-esto-en-produccion")
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60 * 8  # 8 horas


def registrar_admin(data: UserRegister) -> UserOut:
    if hasattr(users_repository, "get_by_correo") and users_repository.get_by_correo(data.correo):
        raise AppException(400, "Ya existe un usuario con ese correo")
    
    if hasattr(users_repository, "get_by_usuario") and users_repository.get_by_usuario(data.usuario):
        raise AppException(400, "Ya existe ese nombre de usuario")

    rol = users_repository.get_rol_by_nombre("admin")
    if not rol:
        raise AppException(500, "Rol 'admin' no configurado")

    password_hash = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
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
        "exp": datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def login(data: UserLogin) -> TokenOut:
    identificador = (getattr(data, "usuario", None) or getattr(data, "correo", None) or "").strip()
    if not identificador:
        raise AppException(400, "Debe proporcionar un usuario o correo")

    # 1. Buscar primero por nombre de usuario
    usuario = None
    if hasattr(users_repository, "get_by_usuario"):
        usuario = users_repository.get_by_usuario(identificador)

    # 2. Si no lo encuentra, buscar por correo
    if not usuario and hasattr(users_repository, "get_by_correo"):
        usuario = users_repository.get_by_correo(identificador)

    if not usuario:
        raise AppException(401, "Credenciales inválidas")

    # 3. Verificación híbrida: acepta contraseña normal (texto plano) o hash bcrypt
    coincide = False
    stored_password = usuario.get("password") or ""

    if data.password == stored_password:
        coincide = True
    else:
        try:
            password_bytes = data.password.encode("utf-8")
            hash_bytes = stored_password.encode("utf-8")
            coincide = bcrypt.checkpw(password_bytes, hash_bytes)
        except (ValueError, TypeError):
            coincide = False

    if not coincide:
        raise AppException(401, "Credenciales inválidas")

    # 4. Validaciones de estado
    if usuario.get("estado") != "aprobado":
        raise AppException(403, f"Cuenta en estado '{usuario.get('estado')}', no puede iniciar sesión")

    if not usuario.get("es_activo"):
        raise AppException(403, "Cuenta desactivada")

    # 5. Generar y devolver el token JWT
    rol = users_repository.get_rol_by_id(usuario["rol_id"])
    rol_nombre = rol["nombre_rol"] if rol else "sin_rol"
    token = _crear_token(usuario["id"], rol_nombre)

    return TokenOut(access_token=token, rol=rol_nombre)