from modules.incidents.repository import reportes_repository


class ReportesService:

    @staticmethod
    def obtener_reporte_dashboard():

        # 1. KPIs
        kpis_raw = reportes_repository.get_kpis()
        kpis_data = kpis_raw[0] if kpis_raw else {"total_incidencias": 0, "resueltas": 0, "pendientes": 0}
        

        # 2. Por Día
        dias_raw = reportes_repository.get_incidencias_por_dia()

        # 3. Distribución por Tipo
        tipo_raw = reportes_repository.get_distribucion_tipo()

        # 4. Tendencia Mensual
        meses_raw = reportes_repository.get_tendencia_mensual()

        # 5. Distribución por Zona
        zonas_raw = reportes_repository.get_distribucion_zona()

        return {
            "kpis": kpis_data,
            "incidencias_por_dia": dias_raw,
            "distribucion_tipo": tipo_raw,
            "tendencia_mensual": meses_raw,
            "distribucion_zona": zonas_raw,
        }
