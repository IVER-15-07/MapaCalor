from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router import api_router
from core.config import get_settings


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    swagger_ui_parameters={"tryItOutEnabled": True},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/")
def root():
    return {
        "message": "COMTECO Excel API",
        "excel_path": str(settings.incidents_excel_path) if settings.incidents_excel_path else None,
    }