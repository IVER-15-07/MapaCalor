from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

# ── Excepción personalizada ──────────────────────
class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail

# ── Handler para tu excepción ────────────────────
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "ok": False,
            "status": exc.status_code,
            "mensaje": exc.detail,
            "data": None
        }
    )

# ── Handler para errores de validación Pydantic ──
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "ok": False,
            "status": 422,
            "mensaje": "Error de validación en los datos enviados",
            "data": exc.errors()
        }
    )