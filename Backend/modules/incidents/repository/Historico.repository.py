from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from pathlib import Path
from threading import Lock

import pandas as pd

from modules.incidents.model import IncidentRecord


def get_incidents_summary_by_month(self, year_month: str) -> dict[str, object]:
    """Obtiene resumen de incidencias para un mes completo (formato: YYYY-MM)"""
    # year_month esperado en formato "2026-05" (YYYY-MM)
    try:
        year_part, month_part = year_month.split("-")
        year = int(year_part)
        month = int(month_part)
    except (ValueError, IndexError):
        return {
            "sectores": [],
            "incidentes_por_sector": [],
            "total_sectores": 0,
            "total_incidentes": 0,
        }

    counts_by_sector: dict[str, int] = {}
    canonical_name: dict[str, str] = {}

    for record in self.to_records():
        try:
            parsed_date = _parse_datetime(record.fecha_registro)
            if (
                pd.notna(parsed_date)
                and parsed_date.year == year
                and parsed_date.month == month
            ):
                sector_value = (record.sector_operativo or "").strip()
                if not sector_value:
                    continue

                sector_key = sector_value.lower()
                canonical_name.setdefault(sector_key, sector_value)
                counts_by_sector[sector_key] = counts_by_sector.get(sector_key, 0) + 1
        except Exception:
            continue

    ordered_keys = sorted(
        counts_by_sector.keys(), key=lambda key: canonical_name[key].lower()
    )
    incidentes_por_sector = [
        {
            "sector_operativo": canonical_name[key],
            "total_incidentes": counts_by_sector[key],
        }
        for key in ordered_keys
    ]

    total_incidentes = sum(item["total_incidentes"] for item in incidentes_por_sector)
    return {
        "sectores": [item["sector_operativo"] for item in incidentes_por_sector],
        "incidentes_por_sector": incidentes_por_sector,
        "total_sectores": len(incidentes_por_sector),
        "total_incidentes": total_incidentes,
    }


def get_incidents_summary_by_date_range(
    self, fecha_inicio: str, fecha_fin: str
) -> dict[str, object]:
    """Obtiene resumen de incidencias para un rango de fechas"""
    try:
        date_inicio = _parse_datetime(fecha_inicio)
        date_fin = _parse_datetime(fecha_fin)
        if pd.isna(date_inicio) or pd.isna(date_fin):
            return {
                "sectores": [],
                "incidentes_por_sector": [],
                "total_sectores": 0,
                "total_incidentes": 0,
            }
    except Exception:
        return {
            "sectores": [],
            "incidentes_por_sector": [],
            "total_sectores": 0,
            "total_incidentes": 0,
        }

    counts_by_sector: dict[str, int] = {}
    canonical_name: dict[str, str] = {}

    for record in self.to_records():
        try:
            parsed_date = _parse_datetime(record.fecha_registro)
            if pd.notna(parsed_date) and date_inicio <= parsed_date <= date_fin:
                sector_value = (record.sector_operativo or "").strip()
                if not sector_value:
                    continue

                sector_key = sector_value.lower()
                canonical_name.setdefault(sector_key, sector_value)
                counts_by_sector[sector_key] = counts_by_sector.get(sector_key, 0) + 1
        except Exception:
            continue

    ordered_keys = sorted(
        counts_by_sector.keys(), key=lambda key: canonical_name[key].lower()
    )
    incidentes_por_sector = [
        {
            "sector_operativo": canonical_name[key],
            "total_incidentes": counts_by_sector[key],
        }
        for key in ordered_keys
    ]

    total_incidentes = sum(item["total_incidentes"] for item in incidentes_por_sector)
    return {
        "sectores": [item["sector_operativo"] for item in incidentes_por_sector],
        "incidentes_por_sector": incidentes_por_sector,
        "total_sectores": len(incidentes_por_sector),
        "total_incidentes": total_incidentes,
    }
