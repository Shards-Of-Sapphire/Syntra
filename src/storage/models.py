from datetime import datetime, timezone
from typing import Any

from sqlalchemy import DateTime, Float, Index, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from src.storage.db import Base, SessionLocal


def utc_now() -> datetime:
	return datetime.now(timezone.utc)


class RawEvent(Base):
	__tablename__ = "raw_events"
	__table_args__ = (
		UniqueConstraint("platform", "external_id", name="uq_raw_events_platform_external_id"),
		Index("ix_raw_events_created_at", "created_at"),
		Index("ix_raw_events_platform", "platform"),
	)

	id: Mapped[int] = mapped_column(Integer, primary_key=True)
	platform: Mapped[str] = mapped_column(String(32), nullable=False)
	external_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
	author_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
	author_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
	text: Mapped[str] = mapped_column(Text, nullable=False)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
	collected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
	sentiment: Mapped[str | None] = mapped_column(String(16), nullable=True)
	sentiment_score: Mapped[float | None] = mapped_column(Float, nullable=True)
	event_metadata: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)


class SentimentResult(Base):
	__tablename__ = "sentiment_results"

	id: Mapped[int] = mapped_column(Integer, primary_key=True)
	event_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
	label: Mapped[str] = mapped_column(String(16), nullable=False)
	score: Mapped[float] = mapped_column(Float, nullable=False)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
