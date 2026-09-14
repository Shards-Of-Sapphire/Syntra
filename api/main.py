# api/main.py

from contextlib import asynccontextmanager
from collections import Counter
from datetime import datetime, timedelta, timezone
import re
from typing import Optional, List
import logging

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

try:
    from fastapi_cache.decorator import cache
except ImportError:  # pragma: no cover
    def cache(*args, **kwargs):
        def decorator(func):
            return func
        return decorator

from src.storage.db import Base, engine, get_db
from src.storage.models import RawEvent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# Pydantic Response Models (the API contract)
# ─────────────────────────────────────────────

class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    platform: str
    text: str
    author_handle: Optional[str] = None
    created_at: datetime
    sentiment: Optional[dict | str] = None
    sentiment_dominant: Optional[str] = None
    topics: Optional[List[str]] = None

class SentimentTimelinePoint(BaseModel):
    timestamp: datetime
    platform: str
    dominant_emotion: str
    avg_confidence: float
    event_count: int

class PaginatedResponse(BaseModel):
    items: List[EventOut]
    total: int
    page: int
    page_size: int
    has_next: bool

# ─────────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("Syntra API started.")
    yield


app = FastAPI(
    title="Syntra API",
    description="AI-Driven Social Media Analytics Framework",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS — allow your Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # tighten in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


def _range_start(value: str) -> datetime:
    days = {"24h": 1, "7d": 7, "30d": 30, "90d": 90}.get(value, 1)
    return datetime.now(timezone.utc) - timedelta(days=days)


def _filtered_events(db: Session, range_name: str = "24h") -> list[RawEvent]:
    start = _range_start(range_name)
    return (
        db.query(RawEvent)
        .filter(RawEvent.created_at >= start)
        .order_by(desc(RawEvent.created_at))
        .all()
    )


def _sentiment_label(event: RawEvent) -> str:
    if isinstance(event.sentiment, str):
        return event.sentiment
    dominant = event.sentiment_dominant or "neutral"
    if dominant in {"joy", "surprise"}:
        return "positive"
    if dominant in {"sadness", "anger", "fear", "disgust"}:
        return "negative"
    return "neutral"


def _sentiment_score(event: RawEvent) -> int:
    return {"positive": 85, "neutral": 50, "negative": 20}.get(
        _sentiment_label(event), 50
    )


@app.get("/health")
async def compatibility_health():
    return await health()


@app.get("/api/metrics")
async def compatibility_metrics(range: str = Query("24h"), db: Session = Depends(get_db)):
    events = _filtered_events(db, range)
    total = len(events)
    positive = sum(_sentiment_label(event) == "positive" for event in events)
    mood = round(sum(_sentiment_score(event) for event in events) / total, 1) if total else 0
    counts = Counter(_sentiment_label(event) for event in events)
    trend_data = [counts.get(label, 0) for label in ("positive", "neutral", "negative")]
    return [
        {
            "id": "mentions", "label": "TOTAL MENTIONS", "value": total,
            "displayFormat": "compact", "changePercent": 0, "changeType": "neutral",
            "subtext": f"{total} imported events", "trendData": trend_data,
        },
        {
            "id": "sentiment", "label": "AUDIENCE MOOD (SENTIMENT)", "value": mood,
            "suffix": "%", "displayFormat": "decimal", "changePercent": 0,
            "changeType": "neutral", "subtext": f"{positive} positive events",
            "trendData": [_sentiment_score(event) for event in events[-12:]],
        },
        {
            "id": "trend", "label": "TOP TRENDING TOPIC", "value": 0,
            "prefix": "#", "suffix": " mentions", "displayFormat": "number",
            "changePercent": 0, "changeType": "neutral", "subtext": "Derived from imported text",
            "trendData": [event.id for event in events[-12:]],
        },
        {
            "id": "voices", "label": "INFLUENCERS TALKING",
            "value": len({event.author_id for event in events if event.author_id}),
            "displayFormat": "compact", "changePercent": 0, "changeType": "neutral",
            "subtext": "Unique imported authors", "trendData": trend_data,
        },
    ]


@app.get("/api/sentiment")
async def compatibility_sentiment(
    range: str = Query("24h"), db: Session = Depends(get_db)
):
    events = _filtered_events(db, range)
    buckets: dict[str, list[RawEvent]] = {}
    for event in events:
        created = event.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        bucket = created.astimezone(timezone.utc).replace(minute=0, second=0, microsecond=0)
        buckets.setdefault(bucket.isoformat(), []).append(event)

    points = []
    for timestamp, bucket_events in sorted(buckets.items()):
        count = len(bucket_events)
        positive = round(100 * sum(_sentiment_label(e) == "positive" for e in bucket_events) / count)
        negative = round(100 * sum(_sentiment_label(e) == "negative" for e in bucket_events) / count)
        neutral = max(0, 100 - positive - negative)
        points.append({
            "timestamp": timestamp, "positive": positive, "neutral": neutral,
            "negative": negative, "netScore": round(sum(_sentiment_score(e) for e in bucket_events) / count),
            "volume": count,
        })
    return points


@app.get("/api/trends")
async def compatibility_trends(range: str = Query("24h"), db: Session = Depends(get_db)):
    words = Counter(
        word.lower()
        for event in _filtered_events(db, range)
        for word in re.findall(r"[A-Za-z][A-Za-z0-9_-]{3,}", event.text)
        if word.lower() not in {"this", "that", "with", "from", "have", "your"}
    )
    return [
        {
            "id": f"trend-{index}", "rank": index, "name": name,
            "category": "Imported text", "mentions": mentions, "changePercent": 0,
            "sentiment": "neutral", "sentimentScore": 50, "velocity": "moderate",
        }
        for index, (name, mentions) in enumerate(words.most_common(10), start=1)
    ]


@app.get("/api/feed")
async def compatibility_feed(range: str = Query("24h"), db: Session = Depends(get_db)):
    feed = []
    for event in _filtered_events(db, range):
        metrics = event.raw_metadata.get("public_metrics", {}) if event.raw_metadata else {}
        likes = int(metrics.get("like_count", 0))
        reposts = int(metrics.get("retweet_count", 0))
        feed.append({
            "id": str(event.id), "author": event.author_handle or event.author_id or "Unknown",
            "handle": event.author_handle or "", "avatar": "", "verified": False,
            "platform": event.platform, "content": event.text,
            "timestamp": event.created_at.isoformat(), "sentiment": _sentiment_label(event),
            "sentimentScore": _sentiment_score(event), "likes": likes, "reposts": reposts,
            "engagementScore": min(10, round((likes + reposts) / 10, 1)),
        })
    return feed

# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@app.get("/api/v1/health")
async def health():
    """Quick connectivity check."""
    return {"status": "ok", "timestamp": datetime.now(timezone.utc)}

@app.get("/api/v1/events", response_model=PaginatedResponse)
async def list_events(
    platform: Optional[str] = None,
    sentiment: Optional[str] = None,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Paginated event listing with filters."""
    query = db.query(RawEvent)

    # Apply filters
    if platform:
        query = query.filter(RawEvent.platform == platform)
    if sentiment:
        query = query.filter(RawEvent.sentiment_dominant == sentiment)
    if start:
        query = query.filter(RawEvent.created_at >= start)
    if end:
        query = query.filter(RawEvent.created_at <= end)

    total = query.count()
    items = (
        query.order_by(desc(RawEvent.created_at))
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )

@app.get("/api/v1/events/{event_id}", response_model=EventOut)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(RawEvent).filter(RawEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.get("/api/v1/sentiment/timeline", response_model=List[SentimentTimelinePoint])
@cache(expire=300)  # cache for 5 minutes
async def sentiment_timeline(
    platform: Optional[str] = None,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    granularity: str = Query("hour", pattern="^(hour|day|week)$"),
    db: Session = Depends(get_db),
):
    """Aggregated sentiment over time. This is the heaviest query — cached."""
    # PostgreSQL date_trunc for time bucketing
    if granularity == "hour":
        bucket = func.date_trunc("hour", RawEvent.created_at)
    elif granularity == "day":
        bucket = func.date_trunc("day", RawEvent.created_at)
    else:
        bucket = func.date_trunc("week", RawEvent.created_at)

    query = db.query(
        bucket.label("timestamp"),
        RawEvent.platform,
        RawEvent.sentiment_dominant.label("dominant_emotion"),
        func.count(RawEvent.id).label("event_count"),
    ).group_by("timestamp", RawEvent.platform, RawEvent.sentiment_dominant)

    if platform:
        query = query.filter(RawEvent.platform == platform)
    if start:
        query = query.filter(RawEvent.created_at >= start)
    if end:
        query = query.filter(RawEvent.created_at <= end)

    results = query.order_by("timestamp").all()

    return [
        SentimentTimelinePoint(
            timestamp=row.timestamp,
            platform=row.platform,
            dominant_emotion=row.dominant_emotion,
            avg_confidence=0.0,  # compute from sentiment JSON if needed
            event_count=row.event_count,
        )
        for row in results
    ]

