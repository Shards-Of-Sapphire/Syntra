# Syntra

Syntra is a Python-based social media analytics framework for collecting, normalizing, storing, and querying event data from public social platforms. The project is organized around reusable collectors, SQLAlchemy models, analytics logic, and a small API/dashboard layer for local inspection and experimentation.

## What the project does

At the current stage, the repo implements the following core capabilities:

- Twitter/X ingestion using Tweepy
- Telegram collector stubs and normalization interfaces
- Shared event normalization model for platform data
- SQLAlchemy storage layer with deduplication-safe SQLite support
- Sentiment inference using a lightweight keyword-based analyzer
- Event ingestion and summary analytics in a reusable core service
- FastAPI endpoints for health checks and event queries
- A Flask dashboard and API for local analytics visualization
- A Next.js frontend scaffold in the webapp directory

## Current architecture

The codebase is split into a few clear layers:

- src/collectors/: collector implementations and shared normalization contract
- src/storage/: database session setup and SQLAlchemy models
- src/core.py: application/service layer for ingestion, deduplication, and summary stats
- src/nlp/sentiment.py: sentiment classification logic
- api/main.py: FastAPI application with event endpoints
- webapp/app.py: Flask app for local dashboard and analytics endpoints
- webapp/: Next.js frontend structure and static assets
- scripts/: ingestion and setup scripts

## Implemented features

### Data collection

- Basic Twitter collector for recent tweet search
- Telegram collector skeleton consistent with the shared collector contract
- Normalized platform event objects with platform ID, author, timestamp, and metadata
- Safe fetch wrappers that catch collector errors and return empty results instead of crashing

### Storage and data model

- SQLAlchemy declarative model for raw events
- Deduplication on platform + platform_event_id
- SQLite compatibility configuration for threaded FastAPI/test usage
- File-based default database path under the project data directory

### Analytics and NLP

- Lightweight sentiment analyzer based on keyword scoring
- Event summary generation by platform and sentiment
- Query support for filtered event listing and timeline-style aggregation in the API

### Application layer

- FastAPI endpoints for:
  - health
  - paginated event listing
  - single event lookup
  - sentiment timeline aggregation
- Flask endpoints for:
  - health
  - new event creation
  - event list retrieval
  - analytics summaries
  - topic counts and timeline reporting

## Technology stack

The repo currently uses the following technologies:

- Python 3.11+ / 3.14 compatibility fixes included
- FastAPI for backend API
- Flask for dashboard-style local web app
- SQLAlchemy ORM for database access
- SQLite for local storage and tests
- Tweepy for X/Twitter integration
- Telethon for Telegram support scaffolding
- Playwright for browser-based collection scenarios
- Pydantic for API models
- pytest for automated checks
- Next.js + TypeScript frontend scaffold
- dotenv for environment configuration

## Project structure

```text
Syntra/
├── api/
│   ├── database.py
│   └── main.py
├── data/
├── scripts/
│   ├── collect_telegram.py
│   ├── collect_twitter.py
│   ├── enrich.py
│   └── init_db.py
├── src/
│   ├── collectors/
│   ├── config.py
│   ├── core.py
│   ├── demographics/
│   ├── graph/
│   ├── nlp/
│   ├── storage/
│   └── __init__.py
├── tests/
│   ├── test_api.py
│   ├── test_collector.py
│   ├── test_core.py
│   └── test_storage.py
├── webapp/
│   ├── app.py
│   ├── app/
│   ├── lib/
│   ├── static/
│   └── templates/
├── imghdr.py
├── requirements.txt
├── README.md
├── Makefile
├── LICENSE.md
├── CONTRIBUTING.md
└── .env.example
```

## Setup

### 1. Create a virtual environment

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

A typical local configuration uses a SQLite database by default. The project also supports an override with the DATABASE_URL environment variable.

Example:

```bash
export DATABASE_URL=sqlite:///data/timeline.db
```

### 4. Initialize the database

```bash
python scripts/init_db.py
```

### 5. Run the API

```bash
uvicorn api.main:app --reload
```

The API documentation is available at:

- http://localhost:8000/api/docs
- http://localhost:8000/api/redoc

### 6. Run the Flask dashboard

```bash
python webapp/app.py
```

### 7. Run tests

```bash
pytest -q
```

## Validation status

The current test suite is passing in the repository after dependency and compatibility fixes:

```bash
pytest -q
```

Result: 16 passed.

## Roadmap and current maturity

This project is currently a working local analytics starter rather than a fully production-ready social intelligence platform. The strongest implemented pieces are:

- collector abstraction and event normalization
- SQLAlchemy-backed storage and deduplication
- sentiment analysis and summary logic
- API endpoints and dashboard integration

Planned next steps include:

- richer NLP sentiment models
- demographic profiling and enrichment
- topic modeling and trend detection
- stronger graph/network analytics
- deployment and production configuration

## Notes

The README was deliberately aligned to the actual code in this repo so that it reflects the implemented state accurately rather than the broader original vision alone.

| Member | Role | Contributions |
| --- | --- | --- |
| Roushna Khatoon | Creative Lead · Visionary | Product direction, design direction, storytelling, cross-project leadership |
| Shaik Zayed Saleem | Execution Director | Long-term planning, logic-heavy problem solving, architecture |
| Mohammed Shoaib Khan | Core Developer | Backend, logic, and reliability engineering |
| Aayat Nizam | Concept Spark · Design | Ideation, aesthetic direction, user-experience polish |

### ◆ About Sapphire

Syntra is a product of Sapphire — a close-knit team of innovators, learners, and creators from the CS-AIML Department in Hyderabad, India.

Founded in 2024 from a single spark, Sapphire has grown into a movement that builds what doesn't exist yet — and refines what does.

```txt
Building the Future, One Project at a Time.
```

 🧭 Our Vision To grow beyond college and create a meaningful venture in tech, education, and multi-domain creative projects — avoiding traditional corporate routes, and building a strong identity through hackathons, workshops, and events.

🎯 Our Goal Build a portfolio of impactful projects and create opportunities for each member to contribute based on their strengths and grow together.

💠 Our Values

🚀 Innovation First — We build what doesn't exist yet.
🤝 Collaboration — Every member's strength is a piece of the Sapphire whole.
💡 Authenticity — No corporate masks, just real people building real things.

## 📬 Connect With Us

| Channel | Link |
| --- | --- |
| 🌐 Website | shards-of-sapphire.github.io/Webpage |
| 💻 GitHub | github.com/Shards-Of-Sapphire |
| 📧 Email | shardsofsapphire.org@gmail.com |
| 📍 Location | Hyderabad, Telangana, India |

