from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from src.config import PROJECT_ROOT, get_database_url


def _ensure_sqlite_directory(database_url: str) -> None:
	if not database_url.startswith("sqlite:///") or database_url == "sqlite:///:memory:":
		return
	database_path = Path(database_url.removeprefix("sqlite:///"))
	if not database_path.is_absolute():
		database_path = PROJECT_ROOT / database_path
	database_path.parent.mkdir(parents=True, exist_ok=True)


DATABASE_URL = get_database_url()
_ensure_sqlite_directory(DATABASE_URL)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


class Base(DeclarativeBase):
	pass


def get_db() -> Generator[Session, None, None]:
	session = SessionLocal()
	try:
		yield session
	finally:
		session.close()


def init_db() -> None:
	from src.storage import models  # noqa: F401

	Base.metadata.create_all(bind=engine)
