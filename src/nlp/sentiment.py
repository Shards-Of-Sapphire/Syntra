import re


class SentimentAnalyzer:
    """Fast, dependency-free baseline suitable for ingestion and local development."""

    EMOTION_KEYWORDS = {
        "joy": {"amazing", "awesome", "benefit", "good", "great", "happy", "hope", "love", "progress", "win", "excellent", "fantastic"},
        "sadness": {"sad", "cry", "loss", "pain", "grief", "upset", "hurt", "sorrow"},
        "anger": {"angry", "hate", "outrage", "rage", "mad", "annoyed", "furious"},
        "fear": {"fear", "scared", "unsafe", "threat", "panic", "worry", "anxious", "concern"},
        "surprise": {"wow", "unexpected", "surprised", "shock", "amazing", "sudden"},
        "disgust": {"disgust", "gross", "awful", "terrible", "nasty", "scam", "dislike"},
    }

    def analyze(self, text: str) -> dict[str, float]:
        if not isinstance(text, str):
            text = str(text or "")

        words = set(re.findall(r"[\w']+", text.lower()))
        scores = {emotion: 0.0 for emotion in self.EMOTION_KEYWORDS}

        for emotion, keywords in self.EMOTION_KEYWORDS.items():
            scores[emotion] = len(words & keywords)

        total = sum(scores.values())
        if total == 0:
            scores["neutral"] = 1.0
            return {"joy": 0.0, "sadness": 0.0, "anger": 0.0, "fear": 0.0, "surprise": 0.0, "disgust": 0.0, "neutral": 1.0}

        normalized = {emotion: count / total for emotion, count in scores.items()}
        normalized["neutral"] = 0.0
        return {k: round(v, 4) for k, v in normalized.items()}
