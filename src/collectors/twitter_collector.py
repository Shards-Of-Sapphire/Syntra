import os
from datetime import datetime, timezone
from typing import Any, Iterable

import tweepy

from src.collectors.base import BaseCollector, NormalizedEvent
from src.core import SyntraCore
from src.storage.db import SessionLocal


class TwitterCollector(BaseCollector):
    """Fetch recent tweets for a query and normalize them into the project contract."""

    def __init__(self, client: tweepy.Client | None = None, bearer_token: str | None = None):
        super().__init__("twitter")
        token = bearer_token or os.getenv("TWITTER_BEARER_TOKEN") or os.getenv("TWITTER_BEARER")
        self.client = client or tweepy.Client(token, wait_on_rate_limit=True)

    def fetch(self, query: str, limit: int = 100) -> list[NormalizedEvent]:
        if not query:
            return []

        response = self.client.search_recent_tweets(
            query=query,
            max_results=min(limit, 100),
            tweet_fields=["created_at", "author_id", "public_metrics"],
        )

        data = getattr(response, "data", None) or []
        return [self._normalize_tweet(tweet) for tweet in data]

    def _normalize_tweet(self, tweet: Any) -> NormalizedEvent:
        created_at = getattr(tweet, "created_at", None) or datetime.now(timezone.utc)
        return NormalizedEvent(
            platform="twitter",
            platform_event_id=str(tweet.id),
            text=tweet.text,
            author_id=str(getattr(tweet, "author_id", "")),
            author_handle=None,
            created_at=created_at,
            raw_metadata={
                "public_metrics": getattr(tweet, "public_metrics", {}) or {},
            },
        )

    def health_check(self) -> bool:
        try:
            self.client.get_me()
            return True
        except Exception:
            return False


class TwitterStreamCollector(BaseCollector):
    """Realtime Twitter stream writer using Tweepy StreamingClient."""

    def __init__(self, client: tweepy.StreamingClient | None = None, bearer_token: str | None = None):
        super().__init__("twitter_stream")
        token = bearer_token or os.getenv("TWITTER_BEARER_TOKEN") or os.getenv("TWITTER_BEARER")
        self.client = client or tweepy.StreamingClient(token)
        self.keywords: list[str] = []
        self.client.on_tweet = self._handle_tweet

    def add_keywords(self, keywords: Iterable[str]) -> None:
        self.keywords = [str(keyword).strip() for keyword in keywords if str(keyword).strip()]

    def fetch(self, query: str, limit: int = 100) -> list[NormalizedEvent]:
        return []

    def health_check(self) -> bool:
        return bool(self.client)

    def _normalize_tweet(self, tweet: Any) -> NormalizedEvent:
        created_at = getattr(tweet, "created_at", None) or datetime.now(timezone.utc)
        return NormalizedEvent(
            platform="twitter",
            platform_event_id=str(tweet.id),
            text=tweet.text,
            author_id=str(getattr(tweet, "author_id", "")),
            author_handle=None,
            created_at=created_at,
            raw_metadata={
                "public_metrics": getattr(tweet, "public_metrics", {}) or {},
            },
        )

    def _handle_tweet(self, tweet: Any) -> None:
        if not getattr(tweet, "text", None):
            return

        normalized = self._normalize_tweet(tweet)
        session = SessionLocal()
        try:
            core = SyntraCore(session)
            core.ingest_event(
                platform=normalized.platform,
                text=normalized.text,
                external_id=normalized.platform_event_id,
                author_id=normalized.author_id,
                created_at=normalized.created_at,
                event_metadata=normalized.raw_metadata,
            )
            self.logger.info("Stored tweet %s", normalized.platform_event_id)
        except Exception as exc:  # pragma: no cover - runtime only
            self.logger.exception("Failed to ingest streamed tweet: %s", exc)
        finally:
            session.close()

    def stream(self, keywords: Iterable[str] | None = None, *, timeout: float | None = None) -> None:
        if keywords is not None:
            self.add_keywords(keywords)

        if not self.keywords:
            raise ValueError("At least one search keyword is required for the Twitter stream")

        rules = [tweepy.StreamRule(keyword) for keyword in self.keywords]
        existing = self.client.get_rules().data or []
        existing_rules = {rule.value for rule in existing}
        for rule in rules:
            if rule.value not in existing_rules:
                self.client.add_rules(rule)

        self.client.filter(
            tweet_fields=["created_at", "author_id", "public_metrics"],
            expansions=["author_id"],
            track=self.keywords,
            timeout=timeout,
        )

