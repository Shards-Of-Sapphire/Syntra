import {
  mockMetrics,
  mockSentimentTimeline,
  mockTrends,
  mockDemographics,
  mockInfluenceNodes,
  mockInfluenceEdges,
  mockSocialPosts,
  mockForecastData,
} from '../mockData';
import {
  MetricItem,
  SentimentDataPoint,
  TrendItem,
  DemographicRegion,
  InfluenceNode,
  InfluenceEdge,
  SocialPost,
  ForecastPoint,
  TimeRange,
} from '../types';

const FASTAPI_BASE_URL = 'http://localhost:8000';

class SyntraApiService {
  private isConnectedToFastApi: boolean = false;
  private hasCheckedConnection: boolean = false;

  async checkBackendHealth(): Promise<{ connected: boolean; message: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${FASTAPI_BASE_URL}/health`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.isConnectedToFastApi = true;
        this.hasCheckedConnection = true;
        return { connected: true, message: 'Connected to FastAPI backend (localhost:8000)' };
      }
    } catch {
      // Expected when FastAPI is not running locally yet
    }

    this.isConnectedToFastApi = false;
    this.hasCheckedConnection = true;
    return { connected: false, message: 'Using Syntra mock dataset (FastAPI standby at localhost:8000)' };
  }

  isFastApiActive(): boolean {
    return this.isConnectedToFastApi;
  }

  async getMetrics(range: TimeRange): Promise<MetricItem[]> {
    if (this.isConnectedToFastApi) {
      try {
        const res = await fetch(`${FASTAPI_BASE_URL}/api/metrics?range=${range}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('FastAPI metrics fetch failed, fallback to mock data', err);
      }
    }
    // Scale mock values slightly based on range for realistic feel
    const multiplier = range === '24h' ? 1 : range === '7d' ? 6.8 : range === '30d' ? 28.5 : 82.0;
    return mockMetrics.map((m) => {
      if (m.id === 'mentions') {
        return { ...m, value: Math.round(m.value * (multiplier === 1 ? 1 : multiplier * 0.95)) };
      }
      return m;
    });
  }

  async getSentimentTimeline(range: TimeRange): Promise<SentimentDataPoint[]> {
    if (this.isConnectedToFastApi) {
      try {
        const res = await fetch(`${FASTAPI_BASE_URL}/api/sentiment?range=${range}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('FastAPI sentiment fetch failed, fallback to mock data', err);
      }
    }
    return mockSentimentTimeline;
  }

  async getTrends(): Promise<TrendItem[]> {
    if (this.isConnectedToFastApi) {
      try {
        const res = await fetch(`${FASTAPI_BASE_URL}/api/trends`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('FastAPI trends fetch failed, fallback to mock data', err);
      }
    }
    return mockTrends;
  }

  async getDemographics(): Promise<DemographicRegion[]> {
    if (this.isConnectedToFastApi) {
      try {
        const res = await fetch(`${FASTAPI_BASE_URL}/api/demographics`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('FastAPI demographics fetch failed, fallback to mock data', err);
      }
    }
    return mockDemographics;
  }

  async getInfluenceGraph(): Promise<{ nodes: InfluenceNode[]; edges: InfluenceEdge[] }> {
    if (this.isConnectedToFastApi) {
      try {
        const res = await fetch(`${FASTAPI_BASE_URL}/api/influence`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('FastAPI influence fetch failed, fallback to mock data', err);
      }
    }
    return { nodes: mockInfluenceNodes, edges: mockInfluenceEdges };
  }

  async getLiveFeed(): Promise<SocialPost[]> {
    if (this.isConnectedToFastApi) {
      try {
        const res = await fetch(`${FASTAPI_BASE_URL}/api/feed`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('FastAPI feed fetch failed, fallback to mock data', err);
      }
    }
    return mockSocialPosts;
  }

  async getForecast(): Promise<ForecastPoint[]> {
    if (this.isConnectedToFastApi) {
      try {
        const res = await fetch(`${FASTAPI_BASE_URL}/api/forecast`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('FastAPI forecast fetch failed, fallback to mock data', err);
      }
    }
    return mockForecastData;
  }
}

export const syntraApi = new SyntraApiService();
