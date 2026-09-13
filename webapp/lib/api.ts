export type Summary = {
  total_events: number;
  platforms: Record<string, number>;
  sentiments: Record<string, number>;
};

export type EventRecord = {
  id: number;
  platform: string;
  external_id: string | null;
  author_name: string | null;
  text: string;
  created_at: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  sentiment_score: number | null;
  metadata: Record<string, unknown>;
};

export type TimelinePoint = {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
};

export type Topic = { topic: string; count: number };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>("/api/health"),
  summary: () => request<Summary>("/api/summary"),
  events: (limit = 50) => request<{ events: EventRecord[] }>(`/api/events?limit=${limit}`),
  sentiment: () => request<{ distribution: Record<string, number> }>("/api/analytics/sentiment"),
  timeline: () => request<{ timeline: TimelinePoint[] }>("/api/analytics/timeline"),
  topics: (limit = 8) => request<{ topics: Topic[] }>(`/api/analytics/topics?limit=${limit}`)
};
