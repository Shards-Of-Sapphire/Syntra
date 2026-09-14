# scripts/enrich.py

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.nlp.sentiment import SentimentAnalyzer
from src.storage.db import SessionLocal
from src.storage.models import RawEvent


def main() -> None:
    analyzer = SentimentAnalyzer()
    session = SessionLocal()
    try:
        unriched = (
            session.query(RawEvent)
            .filter(RawEvent.sentiment.is_(None))
            .limit(100)
            .all()
        )

        print(f"Enriching {len(unriched)} events...")

        for event in unriched:
            result = analyzer.analyze(event.text)
            event.sentiment = result
            event.sentiment_dominant = max(result, key=result.get)

        session.commit()
        print(f"✅ Enriched {len(unriched)} events with sentiment.")
    finally:
        session.close()


if __name__ == "__main__":
    main()
