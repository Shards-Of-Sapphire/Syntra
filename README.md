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

A typical local configuration uses SQLite by default. You can override it with `DATABASE_URL` if needed.

```bash
# Windows PowerShell
$env:DATABASE_URL = "sqlite:///data/timeline.db"

# Linux/macOS
export DATABASE_URL=sqlite:///data/timeline.db
```

For live Twitter ingest, add your bearer token:

```bash
# Windows PowerShell
$env:TWITTER_BEARER_TOKEN = "your_bearer_token_here"

# Linux/macOS
export TWITTER_BEARER_TOKEN=your_bearer_token_here
```

You can also use `TWITTER_BEARER` as an alias; the project supports both.

### 4. Initialize the database

```bash
python scripts/init_db.py
```

### 5. Run the API

```bash
uvicorn api.main:app --reload
```

The API docs are available at:

- http://localhost:8000/api/docs
- http://localhost:8000/api/redoc

### 6. Run the local Flask dashboard

```bash
python webapp/app.py
```

### 7. Run the real-time Twitter stream

```bash
python scripts/collect_twitter.py --keywords "#AI" "#python" "#datascience"
```

This script listens for matching tweets and stores them through the project’s ingestion pipeline.

### 8. Run tests

```bash
pytest -q
```

## Validation status

The current test suite is passing:

```bash
pytest -q
```

Result: 16 passed.

## Roadmap and current maturity

This project is currently a working local analytics starter rather than a fully production-ready platform. The strongest implemented pieces are:

- collector abstraction and event normalization
- SQLAlchemy-backed storage and deduplication
- sentiment analysis and summary logic
- API endpoints and dashboard integration
- realtime Twitter stream ingestion

Planned next steps include:

- richer NLP sentiment models
- demographic profiling and enrichment
- topic modeling and trend detection
- stronger graph/network analytics
- deployment and production configuration

## Notes

The README reflects the actual code in this repo and the live ingestion path now available in the project.

## Sapphire team

| Member | Role | Contributions |
| --- | --- | --- |
| Roushna Khatoon | Creative Lead · Visionary | Product direction, design direction, storytelling, cross-project leadership |
| Shaik Zayed Saleem | Execution Director | Long-term planning, logic-heavy problem solving, architecture |
| Mohammed Shoaib Khan | Core Developer | Backend, logic, and reliability engineering |
| Aayat Nizam | Concept Spark · Design | Ideation, aesthetic direction, user-experience polish |

### About Sapphire

Syntra is a project built by Sapphire, a close-knit team of innovators, learners, and creators from the CS-AIML Department in Hyderabad, India.

Founded in 2024 from a single spark, Sapphire focuses on creating what does not exist yet and refining what does.

```txt
Building the Future, One Project at a Time.
```

### Vision

To grow beyond college and create meaningful work in tech, education, and multi-domain creative projects.

### Goal

To build a portfolio of impactful projects and help each team member contribute based on their strengths.

### Values

- Innovation First
- Collaboration
- Authenticity

## Connect with us

| Channel | Link |
| --- | --- |
| Website | shards-of-sapphire.github.io/Webpage |
| GitHub | github.com/Shards-Of-Sapphire |
| Email | shardsofsapphire.org@gmail.com |
| Location | Hyderabad, Telangana, India |

