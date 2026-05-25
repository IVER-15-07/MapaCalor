from typing import Any

def success_response(data: Any, mensaje: str = "OK", status: int = 200):
    return {
        "ok": True,
        "status": status,
        "mensaje": mensaje,
        "data": data
    }

def error_response(mensaje: str, status: int = 400):
    return {
        "ok": False,
        "status": status,
        "mensaje": mensaje,
        "data": None
    }