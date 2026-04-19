from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Importa los modelos para que SQLAlchemy registre metadata.
from app.modules.user import model  # noqa: F401,E402
