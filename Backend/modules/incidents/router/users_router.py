from fastapi import APIRouter
from core.response import success_response
from ..schema.users_schema import UserRegister, UserApprove, UserLogin
from ..service import users_service

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register")
def registrar_admin(data: UserRegister):
    usuario = users_service.registrar_admin(data)
    return success_response(data=usuario, mensaje="Registro enviado, pendiente de aprobación")

@router.get("/pending")
def listar_pendientes():
    usuarios = users_service.listar_pendientes()
    return success_response(data=usuarios, mensaje="Usuarios pendientes obtenidos correctamente")

@router.post("/{usuario_id}/approve")
def aprobar(usuario_id: int, data: UserApprove):
    usuario = users_service.aprobar_usuario(usuario_id, data.super_admin_id)
    return success_response(data=usuario, mensaje="Usuario aprobado correctamente")

@router.post("/{usuario_id}/reject")
def rechazar(usuario_id: int, data: UserApprove):
    usuario = users_service.rechazar_usuario(usuario_id, data.super_admin_id)
    return success_response(data=usuario, mensaje="Usuario rechazado correctamente")

@router.post("/login")
def login(data: UserLogin):
    token = users_service.login(data)
    return success_response(data=token, mensaje="Login exitoso")