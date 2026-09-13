# ◆ SYNTRA

### AI-Driven Social Media Analytics Framework

**Sentiment · Demographics · Trends · Influence — Unlocked in Real Time**

[![Built by Sapphire](https://img.shields.io/badge/Built%20by-Sapphire-6C63FF?style=for-the-badge)](https://shards-of-sapphire.github.io/Webpage/)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)](#-roadmap)
[![Made in Hyderabad](https://img.shields.io/badge/Made%20in-Hyderabad%2C%20India-FF6B6B?style=for-the-badge)](#-about-sapphire)

---

*"Out-grow; Beyond, Incomprehensible to others."*

</div>

---

## ◆ What is Syntra?

**Syntra** is an AI-driven Social Media Analytics Framework that digs beneath the surface of online communities. Where most tools count likes and followers, Syntra answers the harder questions:

> **How do they feel? Who are they? What are they talking about? And who moves them?**

Syntra ingests raw, live platform data and runs it through four analytical vectors — **Sentiment**, **Demographics**, **Trends**, and **Link Analysis** — to produce deep, actionable audience intelligence.

| The Question | The Syntra Vector |
| :--- | :--- |
| How do followers *feel*? | 🧠 **Multi-Dimensional Sentiment Inference** |
| Who *are* those followers? | 👥 **Automated Demographic Profiling** |
| What topics are *captivating* them? | 📈 **Real-Time Trend & Topic Detection** |
| How do they *influence* one another? | 🕸️ **Link Analysis & Network Topology** |

Syntra fuses all four into a single, time-stamped intelligence layer — mapping the **exact chronology of a conversation** from first spark to viral wildfire.

---

## 🎯 The Mission

Social media platforms are complex ecosystems driven by **human emotion, diverse demographics, and interconnected networks**. To truly understand an online community, you must look beneath the surface.

Syntra exists to close that gap — transforming chaotic, high-velocity social data into **structured, anonymized, decision-ready intelligence**.

---

## 🧩 Core Components

### 🅐 Continuous Data Collection & Timeline Management
A multi-platform ingestion pipeline that pulls live posts, interactions, and comments — and stores them in a structured, time-stamped historical database.

- **Essentials (Must-Have):** X (formerly Twitter), Telegram
- **Desirable (Good-to-Have):** Instagram, Facebook
- **Appreciable Additions:** Reddit, YouTube (text context from video comments)

> The result: a reconstructable chronicle of any conversation, second-by-second.

---

### 🅑 Multi-Dimensional Sentiment Inference
NLP models that detect **nuanced emotion** — not just positive/negative, but *sarcasm, anxiety, excitement, support, opposition*, and more — mapped along the established data timeline.

- Fine-grained emotion classification
- Sarcasm & irony detection
- Temporal sentiment drift tracking

---

### 🅒 Automated Demographic Profiling
Models that infer **aggregate, anonymized** audience demographics from public signals:

- Age brackets
- Geographic distribution
- Language
- Professional interests
- Behavioral patterns

> 🔒 **Privacy first.** Syntra never exposes individual identities. All demographic output is aggregated and anonymized by design.

---

### 🅓 Real-Time Trend & Topic Detection
Automatic identification, ranking, and **prediction** of rising trends, viral keywords, and shifting discussions — as they emerge chronologically.

- Dynamic topic modeling
- Velocity / acceleration scoring
- Trend forecasting before it peaks

---

### 🅔 Link Analysis & Network Topology
A map of relationships among followers that reveals:

- **Nodes of high influence** (key opinion leaders)
- How a *trend* spreads from one user segment to another
- How *sentiment* propagates across the network over time

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Data Collection** | Tweepy (X API), Telethon (Telegram), Playwright (public-page fallback) |
| **NLP & Sentiment** | HuggingFace Transformers, PyTorch, Sentence-Transformers |
| **Topic Modeling** | BERTopic |
| **Network Analysis** | NetworkX, igraph |
| **Storage** | PostgreSQL / SQLite (time-partitioned timeline DB) |
| **Orchestration** | Prefect / Apache Airflow |
| **Backend API** | FastAPI |
| **Web Application** | Next.js + TypeScript |
| **Visualization** | Plotly, D3.js, PyVis |
| **Deployment** | Docker, Kubernetes, CI/CD via GitHub Actions |
| **Cloud** | AWS / GCP |

---

## 🖥️ The Syntra Web Application

Syntra ships with a **full analytics web application** — a single pane of glass for the entire intelligence pipeline.

| Module | What It Shows |
| :--- | :--- |
| **Live Feed** | Real-time stream of ingested posts and comments |
| **Sentiment Timeline** | Emotion trends over time, per topic or per audience segment |
| **Demographic Map** | Geographic heatmap of audience distribution |
| **Trend Radar** | Live ranking of rising topics, keywords, and narratives |
| **Influence Graph** | Interactive network of key opinion leaders and information flow |
| **Forecast Panel** | Predictive trajectory of emerging trends |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ (for the web application)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Shards-Of-Sapphire/Syntra.git
cd Syntra
```

### 2. Set Up the Python Environment

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a .env file from the template:

```bash
cp .env.example .env
```

Then fill in your credentials:

```env
TWITTER_BEARER=your_bearer_token
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
DATABASE_URL=sqlite:///data/timeline.db
```

### 4. Initialize the Timeline Database

```bash
python scripts/init_db.py
```

### 5. Run the Data Pipeline

```bash
make collect-twitter    # Ingest X data
make collect-telegram   # Ingest Telegram data
make analyze            # Run sentiment + topic + graph analysis
```

### 6. Launch the Web Application

```bash
make run
```

Navigate to http://localhost:3000 (web app) or http://localhost:8000 (API docs).

## 📁 Repository Structure
```
Syntra/
├── .env.example
├── .gitignore
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── requirements.txt
├── Makefile
├── docker-compose.yml
│
├── src/
│   ├── config.py
│   ├── collectors/          # Multi-platform ingestion
│   ├── storage/             # Timeline DB models
│   ├── nlp/                 # Sentiment + topics
│   ├── demographics/        # Anonymized profiling
│   └── graph/               # Link analysis & centrality
│
├── scripts/                 # Pipeline entry points
├── api/                     # FastAPI backend
├── webapp/                  # Next.js analytics dashboard
├── notebooks/               # Research & experimentation
├── deployments/             # Docker, K8s, CI/CD
├── .github/
│   └── workflows/           # GitHub Actions CI
└── docs/                    # Architecture & methodology
```

## 🔐 Ethics & Compliance

Syntra is built on a foundation of responsible data practice.

**✅ We do:**

Collect only public data through official APIs
Aggregate and anonymize all outputs
Respect platform Terms of Service and rate limits
Follow GDPR, CCPA, and India's DPDP Act
Practice data minimization and retention limits

**❌ We never:**

Scrape private messages or DMs
Expose individual identities alongside inferences
Resell or share raw user data
Profile individuals on sensitive attributes

```txt
Syntra sees audiences. Never individuals.
```

## 🗺️ Roadmap

| Phase | Goal | Status |
| --- | --- | --- |
| Phase 1 | MVP — X ingestion + sentiment inference | 🔄 In Progress |
| Phase 2 | Multi-platform — Telegram + timeline DB | ⏳ Planned |
| Phase 3 | Demographic profiling engine | ⏳ Planned |
| Phase 4 | Real-time trend detection + forecasting | ⏳ Planned |
| Phase 5 | Link analysis & influence graph | ⏳ Planned |
| Phase 6 | Web application & production deployment | ⏳ Planned |

## 👥 Credits

Syntra is designed, engineered, and maintained by the Sapphire team.

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

