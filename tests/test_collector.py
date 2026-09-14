# tests/test_collector.py

import pytest
from unittest.mock import Mock, patch
from src.collectors.twitter_collector import TwitterCollector
from src.collectors.base import NormalizedEvent

@pytest.fixture
def mock_twitter_response():
    """Mock tweet data that looks like real Tweepy response."""
    tweet = Mock()
    tweet.id = "1234567890"
    tweet.text = "AI is transforming everything!"
    tweet.author_id = "98765"
    tweet.created_at = Mock()
    tweet.created_at.isoformat.return_value = "2024-09-13T10:00:00+00:00"
    tweet.public_metrics = {"retweet_count": 10, "like_count": 50}
    
    resp = Mock()
    resp.data = [tweet]
    return resp

@patch("src.collectors.twitter_collector.tweepy.Client")
def test_twitter_fetch_returns_normalized(mock_client_class, mock_twitter_response):
    mock_client = mock_client_class.return_value
    mock_client.search_recent_tweets.return_value = mock_twitter_response
    
    collector = TwitterCollector()
    events = collector.fetch("#AI", limit=1)
    
    assert len(events) == 1
    assert isinstance(events[0], NormalizedEvent)
    assert events[0].platform == "twitter"
    assert events[0].text == "AI is transforming everything!"
    assert events[0].platform_event_id == "1234567890"

@patch("src.collectors.twitter_collector.tweepy.Client")
def test_twitter_fetch_handles_empty_response(mock_client_class):
    mock_client = mock_client_class.return_value
    empty_resp = Mock()
    empty_resp.data = None
    mock_client.search_recent_tweets.return_value = empty_resp
    
    collector = TwitterCollector()
    events = collector.fetch("#NonExistentHashtag", limit=10)
    
    assert events == []

@patch("src.collectors.twitter_collector.tweepy.Client")
def test_safe_fetch_catches_errors(mock_client_class):
    mock_client = mock_client_class.return_value
    mock_client.search_recent_tweets.side_effect = Exception("API down")
    
    collector = TwitterCollector()
    events = collector.safe_fetch("#AI", limit=10)
    
    # safe_fetch should catch the error and return []
    assert events == []
