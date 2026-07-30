from fastapi import APIRouter

from modules.incidents.router import router as incidents_router


router = APIRouter()

router.include_router(incidents_router, prefix="/incidents", tags=["incidents"])