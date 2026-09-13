# src/storage/ingestion_log.py

from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, Integer, String

from src.storage.db import SessionLocal
from src.storage.models import Base


class IngestionLog(Base):
    __tablename__ = "ingestion_logs"

    id = Column(Integer, primary_key=True)
    collector = Column(String, nullable=False)
    query = Column(String)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime)
    events_fetched = Column(Integer, default=0)
    events_stored = Column(Integer, default=0)
    events_duplicated = Column(Integer, default=0)
    errors = Column(Integer, default=0)
    error_details = Column(JSON)
    status = Column(String, default="running")  # running, completed, failed


# After every collection run:
def log_ingestion(collector_name, query, fetched, stored, duplicated, errors, error_details=None):
    if SessionLocal is None:
        raise RuntimeError("Database session factory is unavailable; ensure src.storage.db is configured")

    session = SessionLocal()
    try:
        log = IngestionLog(
            collector=collector_name,
            query=query,
            events_fetched=fetched,
            events_stored=stored,
            events_duplicated=duplicated,
            errors=errors,
            error_details=error_details or [],
            completed_at=datetime.now(timezone.utc),
            status="completed" if errors == 0 else "partial",
        )
        session.add(log)
        session.commit()
    finally:
        session.close()
