from dataclasses import dataclass, field
from pathlib import Path
import os


def _parse_csv_env(name: str, default: str) -> list[str]:
	raw_value = os.getenv(name, default)
	values = [value.strip() for value in raw_value.split(",")]
	return [value for value in values if value]


@dataclass(frozen=True)
class Settings:
	app_name: str = "COMTECO Excel API"
	api_prefix: str = "/api"
	incidents_excel_path: Path | None = Path("C:/Users/ASUS/Desktop/COMTECO/smarflex.xls")
	incidents_excel_sheet_name: str | None = os.getenv("INCIDENTS_EXCEL_SHEET_NAME") or None
	cors_origins: list[str] = field(default_factory=lambda: _parse_csv_env("CORS_ORIGINS", "http://localhost:5173"))


def get_settings() -> Settings:
	return Settings()
