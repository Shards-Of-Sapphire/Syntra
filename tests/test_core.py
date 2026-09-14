import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.core import SyntraCore
from src.storage.db import Base
from src.storage.models import RawEvent


class SyntraCoreTests(unittest.TestCase):
    def setUp(self) -> None:
        engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(engine)
        self.session = sessionmaker(bind=engine)()
        self.core = SyntraCore(self.session)

    def tearDown(self) -> None:
        self.session.close()

    def test_ingest_classifies_and_deduplicates_events(self) -> None:
        first = self.core.ingest_event(
            platform="X",
            text="A great win",
            external_id="post-1",
        )
        duplicate = self.core.ingest_event(
            platform="x",
            text="A different version",
            external_id="post-1",
        )

        self.assertEqual(first.id, duplicate.id)
        self.assertEqual(first.platform, "x")
        self.assertEqual(first.sentiment, "positive")
        self.assertEqual(self.session.query(RawEvent).count(), 1)

    def test_summary_groups_platforms_and_sentiments(self) -> None:
        self.core.ingest_event(platform="telegram", text="Good news")
        self.core.ingest_event(platform="telegram", text="Terrible loss")

        self.assertEqual(
            self.core.summary(),
            {
                "total_events": 2,
                "platforms": {"telegram": 2},
                "sentiments": {"negative": 1, "positive": 1},
            },
        )


if __name__ == "__main__":
    unittest.main()