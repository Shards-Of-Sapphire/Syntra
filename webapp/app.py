from collections import Counter
import re

from flask import Flask, render_template, request, jsonify  # type: ignore[import-not-found]
import sys
import os
from sqlalchemy import func, select
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.core import SyntraCore
from src.nlp.sentiment import SentimentAnalyzer
from src.storage.db import SessionLocal, init_db
from src.storage.models import RawEvent

app = Flask(__name__)
init_db()


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


def serialize_event(event):
    return {
        "id": event.id,
        "platform": event.platform,
        "platform_event_id": event.platform_event_id,
        "author_handle": event.author_handle,
        "text": event.text,
        "created_at": event.created_at.isoformat() if event.created_at else None,
        "sentiment": event.sentiment,
        "sentiment_dominant": event.sentiment_dominant,
        "metadata": event.raw_metadata or {},
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analytics')
def analytics():
    session = SessionLocal()
    try:
        events = session.query(RawEvent).order_by(RawEvent.created_at.desc()).all()
        summary = SyntraCore(session).summary()
        return render_template('analytics.html', events=events, summary=summary)
    finally:
        session.close()


@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})


@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json(silent=True) or {}
    session = SessionLocal()
    try:
        event = SyntraCore(session).ingest_event(
            platform=data.get('platform', ''),
            text=data.get('text', ''),
            external_id=data.get('external_id') or data.get('platform_event_id'),
            author_id=data.get('author_id'),
            author_name=data.get('author_name') or data.get('author_handle'),
            event_metadata=data.get('metadata') or data.get('raw_metadata'),
        )
        return jsonify({
            "id": event.id,
            "platform": event.platform,
            "text": event.text,
            "sentiment": event.sentiment,
            "sentiment_dominant": event.sentiment_dominant,
        }), 201
    except ValueError as error:
        session.rollback()
        return jsonify({"error": str(error)}), 400
    finally:
        session.close()


@app.route('/api/summary')
def summary():
    session = SessionLocal()
    try:
        return jsonify(SyntraCore(session).summary())
    finally:
        session.close()


@app.route('/api/events')
def events():
    limit = min(max(request.args.get('limit', 50, type=int), 1), 200)
    platform = request.args.get('platform')
    sentiment = request.args.get('sentiment')
    session = SessionLocal()
    try:
        query = select(RawEvent)
        if platform:
            query = query.where(RawEvent.platform == platform.lower())
        if sentiment:
            query = query.where(RawEvent.sentiment == sentiment.lower())
        query = query.order_by(RawEvent.created_at.desc()).limit(limit)
        return jsonify({"events": [serialize_event(event) for event in session.scalars(query).all()]})
    finally:
        session.close()


@app.route('/api/analytics/sentiment')
def sentiment_analytics():
    session = SessionLocal()
    try:
        distribution = {
            row[0]: row[1]
            for row in session.execute(
                select(RawEvent.sentiment, func.count(RawEvent.id))
                .where(RawEvent.sentiment.is_not(None))
                .group_by(RawEvent.sentiment)
            ).all()
        }
        return jsonify({"distribution": distribution})
    finally:
        session.close()


@app.route('/api/analytics/timeline')
def timeline():
    session = SessionLocal()
    try:
        rows = session.execute(
            select(
                func.date(RawEvent.created_at).label("date"),
                RawEvent.sentiment,
                func.count(RawEvent.id).label("count"),
            ).group_by(func.date(RawEvent.created_at), RawEvent.sentiment)
            .order_by(func.date(RawEvent.created_at))
        ).all()
        points = {}
        for date, sentiment, count in rows:
            point = points.setdefault(date, {"date": date, "positive": 0, "neutral": 0, "negative": 0})
            point[sentiment or "neutral"] = count
        return jsonify({"timeline": list(points.values())})
    finally:
        session.close()


@app.route('/api/analytics/topics')
def topics():
    limit = min(max(request.args.get('limit', 10, type=int), 1), 50)
    stop_words = {"this", "that", "with", "from", "have", "your", "about", "they", "will", "what", "when", "were", "into", "just", "the", "and", "for", "are", "but", "not", "you"}
    session = SessionLocal()
    try:
        texts = session.scalars(select(RawEvent.text)).all()
        counts = Counter(
            word for text in texts for word in re.findall(r"[a-zA-Z][a-zA-Z0-9_]{2,}", text.lower())
            if word not in stop_words
        )
        return jsonify({"topics": [{"topic": word, "count": count} for word, count in counts.most_common(limit)]})
    finally:
        session.close()

@app.route('/api/sentiment', methods=['POST'])
def get_sentiment():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '')
    if not isinstance(text, str):
        return jsonify({"error": "text must be a string"}), 400
    return jsonify(SentimentAnalyzer().analyze(text))

if __name__ == '__main__':
    app.run(debug=True)