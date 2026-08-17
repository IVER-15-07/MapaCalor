from fastapi import APIRouter
from core.response import success_response
from modules.incidents.service.reportes_service import ReportesService

router = APIRouter(prefix="/reportes", tags=["Reportes"])


@router.get("/dashboard")
def obtener_reporte_dashboard():
    reportes = ReportesService.obtener_reporte_dashboard()
    
    return success_response(
        data=reportes, 
        mensaje="Reportes del dashboard obtenidos correctamente"
    )