import os
from pathlib import Path

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")


def get_database_url() -> str:
	"""Return the configured database URL, defaulting to a local SQLite file."""
	return os.getenv("DATABASE_URL", "sqlite:///data/timeline.db")
