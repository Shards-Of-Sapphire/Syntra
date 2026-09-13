import os
from pathlib import Path

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")


def get_database_url() -> str:
    """Return the configured database URL, defaulting to a local SQLite file."""
    configured = os.getenv("DATABASE_URL")
    if configured:
        return configured

    default_path = (PROJECT_ROOT / "data" / "timeline.db").resolve()
    return f"sqlite:///{default_path.as_posix()}"


DATABASE_URL = get_database_url()
