# src/collectors/base.py

from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Optional, Iterator
import logging

logger = logging.getLogger(__name__)

@dataclass
class NormalizedEvent:
    """The single contract between collectors and storage."""
    platform: str
    platform_event_id: str
    text: str
    author_id: str
    author_handle: Optional[str]
    created_at: datetime
    raw_metadata: dict

    def to_dict(self) -> dict:
        return asdict(self)

class BaseCollector(ABC):
    """All collectors MUST implement this interface.
    
    Contract:
    - fetch() returns NormalizedEvent objects, never raw platform objects.
    - Errors are caught and logged, never raised to caller.
    - Pagination is handled internally.
    - Rate limiting is respected.
    """
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logging.getLogger(f"collector.{name}")
    
    @abstractmethod
    def fetch(self, query: str, limit: int = 100) -> List[NormalizedEvent]:
        """Fetch events matching the query. Returns at most `limit` events."""
        pass
    
    @abstractmethod
    def health_check(self) -> bool:
        """Verify the collector's credentials and connectivity."""
        pass

    def safe_fetch(self, query: str, limit: int = 100) -> List[NormalizedEvent]:
        """Wrapper that catches errors, logs them, and returns empty list."""
        try:
            self.logger.info(f"[{self.name}] Fetching '{query}' (limit={limit})")
            events = self.fetch(query, limit)
            self.logger.info(f"[{self.name}] Got {len(events)} events")
            return events
        except Exception as e:
            self.logger.error(f"[{self.name}] Fetch failed: {e}", exc_info=True)
            return []

    def safe_health_check(self) -> bool:
        try:
            return self.health_check()
        except Exception as e:
            self.logger.error(f"[{self.name}] Health check failed: {e}", exc_info=True)
            return False