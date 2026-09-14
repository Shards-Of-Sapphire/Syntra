# src/collectors/rate_limiter.py

import time
import random
import logging
import tweepy

logger = logging.getLogger(__name__)

class RateLimiter:
    """Generic rate limiter with exponential backoff + jitter."""
    
    def __init__(self, base_delay: float = 1.0, max_delay: float = 300.0, max_retries: int = 5):
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.max_retries = max_retries
    
    def wait(self, attempt: int):
        """Call this when you get a 429 Too Many Requests."""
        if attempt >= self.max_retries:
            raise Exception(f"Max retries ({self.max_retries}) exceeded")
        
        # Exponential backoff + random jitter (prevents thundering herd)
        delay = min(self.base_delay * (2 ** attempt), self.max_delay)
        jitter = random.uniform(0, delay * 0.1)
        total = delay + jitter
        
        logger.warning(f"Rate limited. Backing off for {total:.1f}s (attempt {attempt + 1})")
        time.sleep(total)

# Usage in TwitterCollector:
def fetch(self, query, limit=100):
    for attempt in range(self.max_retries):
        try:
            resp = self.client.search_recent_tweets(query=query, max_results=limit)
            return self._normalize(resp)
        except tweepy.TooManyRequests:
            self.rate_limiter.wait(attempt)
            continue
        except tweepy.TweepyException as e:
            logger.error(f"Twitter API error: {e}")
            return []
    return []