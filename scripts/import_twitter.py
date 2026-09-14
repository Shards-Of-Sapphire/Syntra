"""Import recent X/Twitter posts into the Syntra SQLAlchemy database."""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import tweepy

from src.collectors.twitter_collector import TwitterCollector
from src.collectors.base import NormalizedEvent
from src.core import SyntraCore
from src.storage.db import SessionLocal, init_db


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import recent X/Twitter posts into the Syntra database."
    )
    parser.add_argument(
        "--query",
        required=True,
        help='X search query, for example: "AI lang:en -is:retweet"',
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=100,
        help="Number of recent posts to request (1-100).",
    )
    parser.add_argument(
        "--mock-file",
        type=Path,
        help="Load normalized mock events from JSON instead of calling the X API.",
    )
    return parser.parse_args()


def load_mock_events(path: Path, limit: int) -> list[NormalizedEvent]:
    records = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        raise ValueError("Mock input must be a JSON array")

    events = []
    for record in records[:limit]:
        events.append(
            NormalizedEvent(
                platform=str(record.get("platform", "twitter")),
                platform_event_id=str(record["platform_event_id"]),
                text=str(record["text"]),
                author_id=str(record.get("author_id", "")),
                author_handle=record.get("author_handle"),
                created_at=datetime.fromisoformat(record["created_at"]),
                raw_metadata=record.get("raw_metadata", {}),
            )
        )
    return events


def main() -> None:
    args = parse_args()
    if not 1 <= args.limit <= 100:
        raise ValueError("--limit must be between 1 and 100")

    init_db()
    if args.mock_file:
        events = load_mock_events(args.mock_file, args.limit)
    else:
        token = os.getenv("TWITTER_BEARER_TOKEN") or os.getenv("TWITTER_BEARER")
        if not token:
            raise RuntimeError(
                "TWITTER_BEARER_TOKEN or TWITTER_BEARER must be set before importing."
            )
        collector = TwitterCollector(bearer_token=token)
        try:
            events = collector.fetch(args.query, limit=args.limit)
        except tweepy.errors.HTTPException as exc:
            print(
                "X API request failed. Check your plan and available API credits. "
                f"Details: {exc}",
                file=sys.stderr,
            )
            raise SystemExit(1) from exc

    session = SessionLocal()
    imported = 0
    try:
        core = SyntraCore(session)
        for event in events:
            existing = core.ingest_event(
                platform=event.platform,
                text=event.text,
                external_id=event.platform_event_id,
                author_id=event.author_id,
                author_name=event.author_handle,
                created_at=event.created_at,
                event_metadata=event.raw_metadata,
            )
            imported += 1
            print(f"Stored {existing.platform_event_id}: {event.text[:80]}")
    finally:
        session.close()

    print(f"Imported {imported} posts for query: {args.query}")


if __name__ == "__main__":
    main()