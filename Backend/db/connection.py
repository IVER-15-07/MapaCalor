import psycopg2
import psycopg2.extras
from core.config import settings

def get_connection():
    """Retorna una conexión a PostgreSQL."""
    return psycopg2.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        dbname=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD
    )

def execute_query(query: str, params=None, fetch=True):
    """
    Ejecuta una query SQL.
    fetch=True  → SELECT (retorna filas)
    fetch=False → INSERT/UPDATE/DELETE
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(query, params)
                if fetch:
                    return cur.fetchall()
    finally:
        conn.close()