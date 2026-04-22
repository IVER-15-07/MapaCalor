from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from pathlib import Path
from threading import Lock

import pandas as pd

from modules.incidents.model import IncidentRecord


def _normalize_column_name(value: object) -> str:
	normalized = str(value).strip().lower()
	normalized = normalized.replace(" ", "_")
	normalized = normalized.replace("/", "_")
	normalized = normalized.replace("-", "_")
	return normalized


def _normalize_value(value: object) -> object:
	if value is None:
		return None
	if pd.isna(value):
		return None
	if isinstance(value, pd.Timestamp):
		return value.to_pydatetime().isoformat()
	if isinstance(value, (datetime, date)):
		return value.isoformat()
	if hasattr(value, "item"):
		try:
			return value.item()
		except Exception:
			return str(value)
	return value


def _normalize_text(value: object) -> str:
	if value is None:
		return ""
	return str(value).strip().lower()


def _parse_datetime(value: object) -> pd.Timestamp | pd.NaT:
	text_value = str(value).strip()
	if not text_value:
		return pd.NaT

	# Fechas ISO como 2026-03-20 o 2026-03-20T09:09:00 no deben usar dayfirst=True.
	is_iso_like = len(text_value) >= 10 and text_value[4] == "-" and text_value[7] == "-"
	if is_iso_like:
		return pd.to_datetime(text_value, dayfirst=False, errors="coerce")

	return pd.to_datetime(text_value, dayfirst=True, errors="coerce")


def _normalize_date_variants(value: object) -> set[str]:
	normalized_values: set[str] = set()
	if value is None:
		return normalized_values

	text_value = str(value).strip()
	if not text_value:
		return normalized_values

	normalized_values.add(text_value.lower())

	try:
		parsed_date = _parse_datetime(text_value)
	except Exception:
		parsed_date = pd.NaT

	if pd.notna(parsed_date):
		normalized_values.add(parsed_date.strftime("%Y-%m-%d"))
		normalized_values.add(parsed_date.strftime("%d/%m/%Y"))
		normalized_values.add(parsed_date.strftime("%d/%m/%Y %H:%M"))
		normalized_values.add(parsed_date.strftime("%d/%m/%Y %H:%M:%S"))

	return normalized_values


@dataclass
class ExcelIncidentRepository:
	source_path: Path | None
	sheet_name: str | None = None
	_frame: pd.DataFrame | None = None
	_loaded_mtime: float | None = None
	_lock: Lock = field(default_factory=Lock, init=False, repr=False)

	def _read_frame(self) -> pd.DataFrame:
		if self.source_path is None:
			raise FileNotFoundError("INCIDENTS_EXCEL_PATH no está configurado")
		if not self.source_path.exists():
			raise FileNotFoundError(f"No se encontró el archivo Excel en: {self.source_path}")

		read_kwargs: dict[str, object] = {}
		if self.sheet_name:
			read_kwargs["sheet_name"] = self.sheet_name
		if self.source_path.suffix.lower() == ".xls":
			read_kwargs["engine"] = "xlrd"

		frame = pd.read_excel(self.source_path, **read_kwargs)
		if isinstance(frame, dict):
			frame = next(iter(frame.values()))
		frame = frame.copy()
		frame.columns = [_normalize_column_name(column) for column in frame.columns]
		return frame

	def load(self, force: bool = False) -> pd.DataFrame:
		with self._lock:
			current_mtime = self.source_path.stat().st_mtime if self.source_path and self.source_path.exists() else None
			needs_reload = force or self._frame is None or self._loaded_mtime != current_mtime
			if needs_reload:
				self._frame = self._read_frame()
				self._loaded_mtime = current_mtime
			return self._frame.copy()

	def to_records(self, force: bool = False) -> list[IncidentRecord]:
		frame = self.load(force=force)
		records = frame.to_dict(orient="records")
		return [
			IncidentRecord.model_validate(
				{key: _normalize_value(value) for key, value in record.items()}
			)
			for record in records
		]

	def stats(self) -> dict[str, object]:
		frame = self.load()
		return {
			"rows": int(frame.shape[0]),
			"columns": list(frame.columns),
			"source_path": str(self.source_path),
			"sheet_name": self.sheet_name,
			"last_loaded": datetime.fromtimestamp(self._loaded_mtime).isoformat() if self._loaded_mtime else None,
		}

	def filter_by_sector_and_date(
		self,
		sector_operativo: str | None,
		fecha_registro: str | None,
	) -> list[IncidentRecord]:
		records = self.to_records()
		normalized_sector = _normalize_text(sector_operativo)
		normalized_date_variants = _normalize_date_variants(fecha_registro)

		if not normalized_sector and not normalized_date_variants:
			return records

		filtered_records: list[IncidentRecord] = []
		for record in records:
			sector_value = _normalize_text(record.sector_operativo)
			fecha_value = record.fecha_registro
			fecha_text = _normalize_text(fecha_value)

			sector_matches = not normalized_sector or normalized_sector in sector_value
			date_matches = False

			if not normalized_date_variants:
				date_matches = True
			else:
				if fecha_text in normalized_date_variants:
					date_matches = True
				else:
					try:
						parsed_record_date = _parse_datetime(fecha_value)
					except Exception:
						parsed_record_date = pd.NaT

					if pd.notna(parsed_record_date):
						record_date_variants = {
							parsed_record_date.strftime("%Y-%m-%d"),
							parsed_record_date.strftime("%d/%m/%Y"),
							parsed_record_date.strftime("%d/%m/%Y %H:%M"),
							parsed_record_date.strftime("%d/%m/%Y %H:%M:%S"),
						}
						date_matches = bool(record_date_variants.intersection(normalized_date_variants))

			if sector_matches and date_matches:
				filtered_records.append(record)

		return filtered_records

	def get_sectors_by_date(self, fecha_registro: str) -> list[str]:
		normalized_date_variants = _normalize_date_variants(fecha_registro)
		if not normalized_date_variants:
			return []

		sectors: list[str] = []
		seen_sectors: set[str] = set()

		for record in self.to_records():
			fecha_value = record.fecha_registro
			fecha_text = _normalize_text(fecha_value)

			date_matches = False
			if fecha_text in normalized_date_variants:
				date_matches = True
			else:
				try:
					parsed_record_date = _parse_datetime(fecha_value)
				except Exception:
					parsed_record_date = pd.NaT

				if pd.notna(parsed_record_date):
					record_date_variants = {
						parsed_record_date.strftime("%Y-%m-%d"),
						parsed_record_date.strftime("%d/%m/%Y"),
						parsed_record_date.strftime("%d/%m/%Y %H:%M"),
						parsed_record_date.strftime("%d/%m/%Y %H:%M:%S"),
					}
					date_matches = bool(record_date_variants.intersection(normalized_date_variants))

			if not date_matches:
				continue

			sector_value = (record.sector_operativo or "").strip()
			if not sector_value:
				continue

			sector_key = sector_value.lower()
			if sector_key in seen_sectors:
				continue

			seen_sectors.add(sector_key)
			sectors.append(sector_value)

		return sectors
