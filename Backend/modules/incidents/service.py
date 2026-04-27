from modules.incidents.repository import ExcelIncidentRepository


def _format_date_value(value: object) -> str:
    if value is None:
        return "-"

    text = str(value).strip()
    if not text:
        return "-"

    # Si ya viene en ISO, devolvemos solo la fecha.
    if len(text) >= 10 and text[4] == "-" and text[7] == "-":
        return text[:10]

    # Si viene con formato local, mantenemos la parte de fecha.
    for separator in [" ", "T"]:
        if separator in text:
            text = text.split(separator, 1)[0]
            break

    return text


def _first_non_empty(record: dict[str, object], keys: list[str]) -> str:
    for key in keys:
        value = record.get(key)
        if value is None:
            continue
        text = str(value).strip()
        if text:
            return text
    return "-"


class IncidentService:
    def __init__(self, repository: ExcelIncidentRepository, heatmap_call_threshold: int = 30):
        self.repository = repository
        self.heatmap_call_threshold = max(1, heatmap_call_threshold)

    def get_sectors_by_date(self, fecha_registro: str) -> list[str]:
        return self.repository.get_sectors_by_date(fecha_registro)

    def get_incidents_summary_by_date(self, fecha_registro: str) -> dict[str, object]:
        return self.repository.get_incidents_summary_by_date(fecha_registro)

    def get_client_records(self, fecha_registro: str | None, limit: int) -> list[dict[str, str]]:
        if fecha_registro:
            records = self.repository.filter_by_sector_and_date(None, fecha_registro)
        else:
            records = self.repository.to_records()

        rows: list[dict[str, str]] = []
        for index, record in enumerate(records, start=1):
            raw = record.model_dump()

            rows.append(
                {
                    "id": _first_non_empty(
                        raw,
                        ["id", "id_incidente", "incidente_id", "numero_incidente", "codigo"],
                    )
                    if _first_non_empty(
                        raw,
                        ["id", "id_incidente", "incidente_id", "numero_incidente", "codigo"],
                    )
                    != "-"
                    else f"REG-{index}",
                    "cliente": _first_non_empty(
                        raw,
                        ["cliente", "nombre_cliente", "abonado", "usuario", "nombre", "razon_social"],
                    ),
                    "producto": _first_non_empty(raw, ["producto", "tipo_producto", "plan", "servicio_producto"]),
                    "servicio": _first_non_empty(
                        raw,
                        ["servicio", "tipo_servicio", "incidencia", "descripcion", "motivo"],
                    ),
                    "direccion": _first_non_empty(
                        raw,
                        ["direccion", "direccion_cliente", "domicilio", "ubicacion", "direccion_servicio"],
                    ),
                    "sector": _first_non_empty(raw, ["sector_operativo", "sector", "zona", "distrito"]),
                    "fecha": _format_date_value(
                        _first_non_empty(
                            raw,
                            ["fecha_registro", "fecha", "fecha_incidente", "fecha_reporte", "fecha_hora"],
                        )
                    ),
                }
            )

            if len(rows) >= limit:
                break

        return rows

    def _resolve_heatmap_state(self, mode: str, total_calls: int, threshold: int) -> str:
        normalized_mode = (mode or "auto").strip().lower()
        if normalized_mode == "normal":
            return "normal"
        if normalized_mode == "critical":
            return "critical"
        return "critical" if total_calls >= threshold else "normal"

    def _resolve_heat_intensity(self, calls: int, map_state: str) -> str:
        if map_state == "critical":
            if calls >= 8:
                return "critical"
            if calls >= 4:
                return "high"
            if calls >= 2:
                return "medium"
            return "low"

        if calls >= 15:
            return "critical"
        if calls >= 8:
            return "high"
        if calls >= 5:
            return "medium"
        return "low"

    def get_heatmap_state(
        self,
        fecha_registro: str,
        mode: str = "auto",
        threshold: int | None = None,
    ) -> dict[str, object]:
        summary = self.repository.get_incidents_summary_by_date(fecha_registro)
        total_calls = int(summary.get("total_incidentes", 0))
        active_threshold = max(1, threshold or self.heatmap_call_threshold)
        map_state = self._resolve_heatmap_state(mode=mode, total_calls=total_calls, threshold=active_threshold)

        points = []
        for item in summary.get("incidentes_por_sector", []):
            calls = int(item.get("total_incidentes", 0))
            points.append(
                {
                    "sector_operativo": item.get("sector_operativo", "-"),
                    "total_llamadas": calls,
                    "intensidad": self._resolve_heat_intensity(calls=calls, map_state=map_state),
                }
            )

        return {
            "fecha_registro": fecha_registro,
            "estado_mapa": map_state,
            "umbral_llamadas": active_threshold,
            "total_sectores": int(summary.get("total_sectores", 0)),
            "total_llamadas": total_calls,
            "llamadas_por_sector": points,
        }