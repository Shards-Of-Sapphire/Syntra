# tests/test_sentiment.py

import pytest
from src.nlp.sentiment import SentimentAnalyzer

@pytest.fixture(scope="session")
def analyzer():
    return SentimentAnalyzer()

def test_basic_sentiment(analyzer):
    result = analyzer.analyze("I love this new feature!")
    assert "joy" in result
    assert result["joy"] > 0.3

def test_negative_sentiment(analyzer):
    result = analyzer.analyze("This is terrible and I hate it.")
    dominant = max(result, key=result.get)
    assert dominant in ["anger", "sadness", "fear"]

def test_empty_text(analyzer):
    result = analyzer.analyze("")
    assert isinstance(result, dict)
    # Should not crash, should return uniform-ish distribution

def test_very_long_text(analyzer):
    long_text = "This is a test. " * 500
    result = analyzer.analyze(long_text)
    assert isinstance(result, dict)
    # Should be truncated, not crash
