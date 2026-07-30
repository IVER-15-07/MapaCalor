import psycopg2
import psycopg2.extras
from psycopg2 import pool

from core.config import settings

# Pool de conexiones: mínimo 1, máximo 10 conexiones simultáneas
connection_pool = psycopg2.pool.SimpleConnectionPool(
    1, 10,
    host=settings.DB_HOST,
    port=settings.DB_PORT,
    dbname=settings.DB_NAME,
    user=settings.DB_USER,
    password=settings.DB_PASSWORD
)


def get_connection():
    """Obtiene una conexión del pool."""
    return connection_pool.getconn()


def release_connection(conn):
    """Devuelve la conexión al pool para que se pueda reutilizar."""
    connection_pool.putconn(conn)


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
        release_connection(conn)