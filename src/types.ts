export type NavItemId =
  | 'overview'
  | 'live-feed'
  | 'sentiment'
  | 'demographics'
  | 'trend-radar'
  | 'influence-graph'
  | 'forecast';

export type TimeRange = '24h' | '7d' | '30d' | '90d';

export interface MetricItem {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  displayFormat: 'number' | 'compact' | 'percent' | 'decimal';
  changePercent: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  subtext: string;
  trendData: number[];
}

export interface SentimentDataPoint {
  timestamp: string;
  positive: number;
  neutral: number;
  negative: number;
  netScore: number;
  volume: number;
}

export interface TrendItem {
  id: string;
  rank: number;
  name: string;
  category: string;
  mentions: number;
  changePercent: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // 0-100
  velocity: 'very_high' | 'high' | 'moderate';
}

export interface DemographicRegion {
  id: string;
  name: string;
  code: string;
  share: number; // percentage
  mentions: number;
  growth: number;
  x: number; // coordinates for map heatmap (0-100 scale)
  y: number;
  radius: number;
  sentiment: number; // 0-100
}

export interface InfluenceNode {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  reach: string;
  affinity: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
  x: number;
  y: number;
  size: number;
  isKeyVoice?: boolean;
}

export interface InfluenceEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

export interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  verified: boolean;
  platform: 'twitter' | 'reddit' | 'tiktok' | 'linkedin' | 'youtube';
  content: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  likes: number;
  reposts: number;
  engagementScore: number;
}

export interface ForecastPoint {
  date: string;
  actualMentions?: number;
  predictedMentions: number;
  upperConfidence: number;
  lowerConfidence: number;
  predictedSentiment: number;
}
