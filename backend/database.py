import sqlite3
import os
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "municipalidad.db")


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ciudadanos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dni TEXT UNIQUE NOT NULL,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            rol TEXT NOT NULL DEFAULT 'ciudadano',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cv_analisis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ciudadano_id INTEGER,
            filename TEXT NOT NULL,
            categoria TEXT,
            confianza REAL,
            probabilidades TEXT,
            texto_muestra TEXT,
            texto_completo TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ciudadano_id) REFERENCES ciudadanos(id)
        )
    """)

    cursor.execute("PRAGMA table_info(cv_analisis)")
    cols = [row[1] for row in cursor.fetchall()]
    if "texto_completo" not in cols:
        try:
            cursor.execute("ALTER TABLE cv_analisis ADD COLUMN texto_completo TEXT")
        except Exception:
            pass

    cursor.execute("SELECT COUNT(*) FROM ciudadanos")
    if cursor.fetchone()[0] == 0:
        seed_admin(cursor)

    conn.commit()
    conn.close()


def seed_admin(cursor):
    cursor.execute("""
        INSERT INTO ciudadanos (dni, nombre, email, password, rol) VALUES
        ('12345678', 'Administrador General', 'admin@yau.gob.pe', 'admin123', 'admin')
    """)


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def query_all(sql, params=()):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        return [dict(row) for row in cursor.fetchall()]


def query_one(sql, params=()):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        row = cursor.fetchone()
        return dict(row) if row else None


def execute(sql, params=()):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        return cursor.lastrowid
