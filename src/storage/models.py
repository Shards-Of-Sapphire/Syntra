# src/storage/models.py — enhanced

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text, Index, BigInteger
from sqlalchemy.orm import Session, declarative_base
from datetime import datetime, timezone
import hashlib


_original_session_commit = Session.commit


def _safe_session_commit(self, *args, **kwargs):
    try:
        return _original_session_commit(self, *args, **kwargs)
    except Exception:
        try:
            self.rollback()
        except Exception:
            pass
        raise


Session.commit = _safe_session_commit

Base = declarative_base()

class RawEvent(Base):
    __tablename__ = "raw_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Identity
    platform = Column(String(20), nullable=False, index=True)      # "twitter", "telegram"
    platform_event_id = Column(String(100), nullable=False)        # native ID from the platform
    content_hash = Column(String(64), nullable=False, index=True)  # SHA256 of normalized text
    
    # Content
    text = Column(Text, nullable=False)
    author_id = Column(String(100), index=True)
    author_handle = Column(String(200))  # anonymized in production
    
    # Time
    created_at = Column(DateTime(timezone=True), nullable=False, index=True)
    collected_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Enrichment (filled later by NLP pipeline)
    sentiment = Column(JSON)        # {"joy": 0.72, "anger": 0.03, ...}
    sentiment_dominant = Column(String(30), index=True)
    topics = Column(JSON)           # ["climate", "policy"]
    demographics = Column(JSON)     # {"age_bracket": "18-24", "language": "en"}
    
    # Metadata
    raw_metadata = Column(JSON)
    
    # Deduplication constraint
    __table_args__ = (
        Index("ux_platform_event_id", "platform", "platform_event_id", unique=True),
        Index("ix_created_platform", "created_at", "platform"),
    )

    def compute_hash(self):
        normalized = (self.text or "").strip().lower().encode("utf-8")
        self.content_hash = hashlib.sha256(normalized).hexdigest()
