from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from api.router import router
from core.config import settings
from core.exceptions import AppException, app_exception_handler, validation_exception_handler

app = FastAPI(title="COMTECO API", version="1.0.0")

# ── CORS ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Handlers de errores ───────────────────────────
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# ── Rutas ─────────────────────────────────────────
app.include_router(router)