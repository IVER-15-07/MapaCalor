from fastapi import APIRouter
from modules.incidents.router.incidents_router import router as incidents_router
from modules.incidents.router.reportes_router import router as reportes_router


router = APIRouter()

router.include_router(incidents_router)
router.include_router(reportes_router)
