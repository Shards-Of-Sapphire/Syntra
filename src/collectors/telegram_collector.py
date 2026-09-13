from datetime import datetime, timezone
from typing import Any

from src.collectors.base import BaseCollector, NormalizedEvent


class TelegramCollector(BaseCollector):
    """Minimal Telegram collector implementation matching the shared collector contract."""

    def __init__(self, client: Any | None = None):
        super().__init__("telegram")
        self.client = client

    def fetch(self, query: str, limit: int = 100) -> list[NormalizedEvent]:
        if not self.client or not query:
            return []
        return []

    def health_check(self) -> bool:
        return self.client is not None
