# tests/test_api.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from api.main import app, get_db
from src.storage.models import Base, RawEvent
from datetime import datetime, timezone

@pytest.fixture
def client():
    """Test client with in-memory DB override."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    TestSession = sessionmaker(bind=engine)
    
    # Override the get_db dependency
    def override_get_db():
        db = TestSession()
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Seed test data
    db = TestSession()
    for i in range(5):
        event = RawEvent(
            platform="twitter",
            platform_event_id=f"test_{i}",
            text=f"Test tweet {i}",
            author_id="user_1",
            created_at=datetime.now(timezone.utc),
            sentiment={"joy": 0.7, "sadness": 0.1},
            sentiment_dominant="joy",
        )
        event.compute_hash()
        db.add(event)
    db.commit()
    db.close()
    
    yield TestClient(app)
    
    app.dependency_overrides.clear()

def test_health(client):
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"

def test_list_events(client):
    resp = client.get("/api/v1/events?page=1&page_size=3")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 5
    assert len(data["items"]) == 3
    assert data["has_next"] == True

def test_filter_by_platform(client):
    resp = client.get("/api/v1/events?platform=telegram")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 0  # all test data is twitter

def test_filter_by_sentiment(client):
    resp = client.get("/api/v1/events?sentiment=joy")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 5
    assert all(e["sentiment_dominant"] == "joy" for e in data["items"])

def test_404_on_missing_event(client):
    resp = client.get("/api/v1/events/99999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Event not found"