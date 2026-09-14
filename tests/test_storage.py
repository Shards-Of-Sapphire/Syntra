# tests/test_storage.py

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from src.storage.models import Base, RawEvent
from datetime import datetime, timezone

@pytest.fixture
def db_session():
    """In-memory SQLite for testing."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_store_and_retrieve_event(db_session):
    event = RawEvent(
        platform="twitter",
        platform_event_id="test_001",
        text="Hello world",
        author_id="user_123",
        created_at=datetime.now(timezone.utc),
    )
    event.compute_hash()
    db_session.add(event)
    db_session.commit()
    
    retrieved = db_session.query(RawEvent).filter_by(platform_event_id="test_001").first()
    assert retrieved is not None
    assert retrieved.text == "Hello world"
    assert retrieved.content_hash is not None

def test_deduplication_via_unique_constraint(db_session):
    """Inserting the same platform + platform_event_id twice should fail."""
    from sqlalchemy.exc import IntegrityError
    
    event1 = RawEvent(
        platform="twitter",
        platform_event_id="dup_001",
        text="First",
        author_id="user_1",
        created_at=datetime.now(timezone.utc),
    )
    event1.compute_hash()
    db_session.add(event1)
    db_session.commit()
    
    event2 = RawEvent(
        platform="twitter",
        platform_event_id="dup_001",  # same ID!
        text="Second",
        author_id="user_2",
        created_at=datetime.now(timezone.utc),
    )
    event2.compute_hash()
    db_session.add(event2)
    
    with pytest.raises(IntegrityError):
        db_session.commit()
        
    assert len(db_session.query(RawEvent).filter_by(platform_event_id="dup_001").all()) == 1