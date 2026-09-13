"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { api, EventRecord, Summary, TimelinePoint, Topic } from "../lib/api";

const emptySummary: Summary = { total_events: 0, platforms: {}, sentiments: {} };

function formatDate(value: string | null) {
  if (!value) return "Unknown time";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function Metric({ label, value, detail, accent }: { label: string; value: string | number; detail: string; accent: string }) {
  return <article className="metric" style={{ "--accent": accent } as CSSProperties}><span className="metric-label">{label}</span><strong>{value}</strong><span className="metric-detail">{detail}</span></article>;
}

function SentimentChart({ values }: { values: Record<string, number> }) {
  const total = Object.values(values).reduce((sum, value) => sum + value, 0) || 1;
  return <div className="sentiment-chart"><div className="sentiment-stack">{["positive", "neutral", "negative"].map((key) => <span key={key} className={`segment ${key}`} style={{ width: `${((values[key] ?? 0) / total) * 100}%` }} />)}</div><div className="legend">{["positive", "neutral", "negative"].map((key) => <span key={key}><i className={`dot ${key}`} />{key}<b>{values[key] ?? 0}</b></span>)}</div></div>;
}

function TimelineChart({ points }: { points: TimelinePoint[] }) {
  const max = Math.max(...points.flatMap((point) => [point.positive, point.neutral, point.negative]), 1);
  return <div className="timeline-chart">{points.length === 0 ? <div className="empty-chart">Timeline data will appear as events arrive.</div> : points.map((point) => <div className="timeline-column" key={point.date}><div className="bars"><span className="bar positive" style={{ height: `${(point.positive / max) * 100}%` }} /><span className="bar neutral" style={{ height: `${(point.neutral / max) * 100}%` }} /><span className="bar negative" style={{ height: `${(point.negative / max) * 100}%` }} /></div><small>{point.date.slice(5)}</small></div>)}</div>;
}

export default function Dashboard() {
  const [summary, setSummary] = useState(emptySummary);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [health, nextSummary, nextEvents, nextTimeline, nextTopics] = await Promise.all([api.health(), api.summary(), api.events(), api.timeline(), api.topics()]);
      setOnline(health.status === "ok"); setSummary(nextSummary); setEvents(nextEvents.events); setTimeline(nextTimeline.timeline); setTopics(nextTopics.topics); setError("");
    } catch (reason) {
      setOnline(false); setError(reason instanceof Error ? reason.message : "The API is unavailable");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); const timer = window.setInterval(() => void refresh(), 30000); return () => window.clearInterval(timer); }, [refresh]);

  const platformCount = Object.keys(summary.platforms).length;
  const sentimentScoreMap: Record<string, number> = { positive: 1, neutral: 0, negative: -1 };
  const averageScore = events.length
    ? events.reduce((sum, event) => sum + (sentimentScoreMap[(event.sentiment as string) ?? "neutral"] ?? 0), 0) / events.length
    : 0;

  return <main className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">S</span><div><strong>SYNTRA</strong><small>audience intelligence</small></div></div><nav><a className="active" href="#overview"><span>◈</span>Overview</a><a href="#feed"><span>≡</span>Live feed</a><a href="#sentiment"><span>◒</span>Sentiment</a><a href="#trends"><span>⌁</span>Trends</a><a className="disabled" href="#demographics"><span>◎</span>Demographics</a><a className="disabled" href="#influence"><span>⌘</span>Influence</a></nav><div className="sidebar-note"><span className={`status-dot ${online ? "online" : "offline"}`} />{online ? "Pipeline connected" : "Waiting for API"}<small>Auto-refresh every 30 sec</small></div></aside>
    <section className="workspace"><header className="topbar"><div><span className="eyebrow">REAL-TIME OBSERVATORY</span><h1>Signal overview</h1></div><div className="topbar-actions"><span className="last-sync">{loading ? "Syncing..." : error ? "Sync failed" : "Live"}</span><button className="refresh-button" onClick={() => void refresh()} aria-label="Refresh dashboard">↻</button><div className="avatar">S</div></div></header>
      {error && <div className="notice"><strong>Backend unavailable.</strong> Start the Flask API on port 5000 to load live data. The interface is ready for connection.</div>}
      <div id="overview" className="metrics"><Metric label="Tracked events" value={summary.total_events.toLocaleString()} detail="all connected sources" accent="#d86b4d" /><Metric label="Active sources" value={platformCount} detail={Object.keys(summary.platforms).join(" · ") || "awaiting sources"} accent="#5b8c85" /><Metric label="Signal balance" value={averageScore >= 0 ? `+${averageScore.toFixed(2)}` : averageScore.toFixed(2)} detail="average recent score" accent="#d7a84b" /><Metric label="System status" value={online ? "Online" : "Offline"} detail={online ? "ingestion reachable" : "check API connection"} accent="#7d6fa8" /></div>
      <div className="section-grid"><section id="sentiment" className="panel timeline-panel"><div className="panel-heading"><div><span className="eyebrow">MOMENTUM</span><h2>Sentiment over time</h2></div><span className="panel-meta">daily volume</span></div><TimelineChart points={timeline} /></section><section className="panel sentiment-panel"><div className="panel-heading"><div><span className="eyebrow">COMPOSITION</span><h2>Audience mood</h2></div></div><SentimentChart values={summary.sentiments} /></section></div>
      <div className="section-grid lower"><section id="feed" className="panel feed-panel"><div className="panel-heading"><div><span className="eyebrow">STREAM</span><h2>Live feed</h2></div><span className="panel-meta">{events.length} latest events</span></div><div className="feed-list">{events.length === 0 ? <div className="empty-state">No events have been collected yet.</div> : events.slice(0, 8).map((event) => <article className="feed-item" key={event.id}><div className="platform-icon">{event.platform.slice(0, 1).toUpperCase()}</div><div className="feed-copy"><div className="feed-meta"><strong>{event.author_handle || event.author_name || event.platform}</strong><span>{formatDate(event.created_at)}</span></div><p>{event.text}</p><span className={`sentiment-pill ${event.sentiment || "neutral"}`}>{event.sentiment || "unscored"}</span></div></article>)}</div></section><section id="trends" className="panel trends-panel"><div className="panel-heading"><div><span className="eyebrow">EMERGING SIGNALS</span><h2>Topic radar</h2></div><span className="panel-meta">keyword volume</span></div><div className="topic-list">{topics.length === 0 ? <div className="empty-state">Topics will surface after the first events.</div> : topics.map((item, index) => <div className="topic-row" key={item.topic}><span className="topic-rank">0{index + 1}</span><strong>#{item.topic}</strong><span className="topic-line" /><span className="topic-count">{item.count}</span></div>)}</div><div className="planned"><span>Next modules</span><p>Demographics and influence graphs unlock when their aggregate models are connected.</p></div></section></div>
    </section>
  </main>;
}
