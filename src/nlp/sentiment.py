import re


class SentimentAnalyzer:
	"""Fast, dependency-free baseline suitable for ingestion and local development."""

	POSITIVE_WORDS = {
		"amazing", "awesome", "benefit", "good", "great", "happy", "hope", "love", "progress", "win"
	}
	NEGATIVE_WORDS = {
		"bad", "crisis", "fail", "hate", "loss", "pain", "sad", "scam", "terrible", "threat", "worry"
	}

	def analyze(self, text: str) -> dict[str, float | str]:
		words = set(re.findall(r"[\w']+", text.lower()))
		positive = len(words & self.POSITIVE_WORDS)
		negative = len(words & self.NEGATIVE_WORDS)
		score = (positive - negative) / max(positive + negative, 1)
		label = "positive" if score > 0 else "negative" if score < 0 else "neutral"
		return {"label": label, "score": round(score, 4)}
