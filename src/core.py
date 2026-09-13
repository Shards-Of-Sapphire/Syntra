from datetime import datetime, timezone
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.nlp.sentiment import SentimentAnalyzer
from src.storage.models import RawEvent


class SyntraCore:
    """Application service for event ingestion and dashboard-level analytics."""

    def __init__(self, session: Session, sentiment_analyzer: SentimentAnalyzer | None = None) -> None:
        self.session = session
        self.sentiment_analyzer = sentiment_analyzer or SentimentAnalyzer()

    def ingest_event(
        self,
        *,
        platform: str,
        text: str,
        external_id: str | None = None,
        author_id: str | None = None,
        author_name: str | None = None,
        created_at: datetime | None = None,
        event_metadata: dict[str, Any] | None = None,
    ) -> RawEvent:
        if not isinstance(platform, str) or not platform.strip():
            raise ValueError("platform is required")
        if not isinstance(text, str) or not text.strip():
            raise ValueError("text is required")

        platform = platform.strip().lower()
        text = text.strip()

        if external_id:
            existing = self.session.scalar(
                select(RawEvent).where(
                    RawEvent.platform == platform,
                    RawEvent.platform_event_id == external_id,
                )
            )
            if existing:
                return existing

        result = self.sentiment_analyzer.analyze(text)
        dominant = max(result, key=result.get)
        if dominant in {"joy", "surprise"}:
            sentiment_label = "positive"
        elif dominant in {"sadness", "anger", "fear", "disgust"}:
            sentiment_label = "negative"
        else:
            sentiment_label = "neutral"

        event = RawEvent(
            platform=platform,
            platform_event_id=external_id or f"generated-{datetime.now(timezone.utc).timestamp()}",
            text=text,
            author_id=author_id,
            author_handle=author_name,
            created_at=created_at or datetime.now(timezone.utc),
            sentiment=sentiment_label,
            sentiment_dominant=dominant,
            raw_metadata=event_metadata or {},
        )
        event.compute_hash()
        self.session.add(event)
        self.session.commit()
        self.session.refresh(event)
        return event

    def summary(self) -> dict[str, Any]:
        total = self.session.scalar(select(func.count(RawEvent.id))) or 0
        platforms = {
            row[0]: row[1]
            for row in self.session.execute(
                select(RawEvent.platform, func.count(RawEvent.id)).group_by(RawEvent.platform)
            ).all()
        }
        sentiments = {
            row[0]: row[1]
            for row in self.session.execute(
                select(RawEvent.sentiment, func.count(RawEvent.id))
                .where(RawEvent.sentiment.is_not(None))
                .group_by(RawEvent.sentiment)
            ).all()
        }
        return {"total_events": total, "platforms": platforms, "sentiments": sentiments}