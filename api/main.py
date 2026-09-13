# api/main.py

from contextlib import asynccontextmanager
from typing import Optional, List
from datetime import datetime, timezone
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

