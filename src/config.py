import os
from pathlib import Path

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")


def get_database_url() -> str:
    """Return the configured database URL, defaulting to local PostgreSQL."""
    configured = os.getenv("DATABASE_URL")
    if configured:
        return configured

    return "postgresql+psycopg://syntra:syntra@localhost:5432/syntra"


DATABASE_URL = get_database_url()
