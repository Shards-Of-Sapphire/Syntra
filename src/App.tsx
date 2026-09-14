import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { LiveFeedPanel } from './components/LiveFeedPanel';
import { SentimentView } from './components/SentimentView';
import { DemographicsView } from './components/DemographicsView';
import { TrendRadarView } from './components/TrendRadarView';
import { InfluenceGraphView } from './components/InfluenceGraphView';
import { ForecastPanel } from './components/ForecastPanel';
import { syntraApi } from './services/api';
import {
  NavItemId,
  TimeRange,
  MetricItem,
  SentimentDataPoint,
  TrendItem,
  DemographicRegion,
  InfluenceNode,
  InfluenceEdge,
  SocialPost,
  ForecastPoint,
} from './types';
import {
  mockMetrics,
  mockSentimentTimeline,
  mockTrends,
  mockDemographics,
  mockInfluenceNodes,
  mockInfluenceEdges,
  mockSocialPosts,
  mockForecastData,
} from './mockData';

export default function App() {
  // Navigation State with URL Hash Sync for routing
  const [activeTab, setActiveTab] = useState<NavItemId>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const validTabs: NavItemId[] = [
      'overview',
      'live-feed',
      'sentiment',
      'demographics',
      'trend-radar',
      'influence-graph',
      'forecast',
    ];
    return validTabs.includes(hash as NavItemId) ? (hash as NavItemId) : 'overview';
  });

  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Data states
  const [metrics, setMetrics] = useState<MetricItem[]>(mockMetrics);
  const [sentimentData, setSentimentData] = useState<SentimentDataPoint[]>(mockSentimentTimeline);
  const [trends, setTrends] = useState<TrendItem[]>(mockTrends);
  const [demographics, setDemographics] = useState<DemographicRegion[]>(mockDemographics);
  const [influenceNodes, setInfluenceNodes] = useState<InfluenceNode[]>(mockInfluenceNodes);
  const [influenceEdges, setInfluenceEdges] = useState<InfluenceEdge[]>(mockInfluenceEdges);
  const [feedPosts, setFeedPosts] = useState<SocialPost[]>(mockSocialPosts);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>(mockForecastData);

  // Sync hash with route
  const handleNavSelect = (tab: NavItemId) => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const validTabs: NavItemId[] = [
        'overview',
        'live-feed',
        'sentiment',
        'demographics',
        'trend-radar',
        'influence-graph',
        'forecast',
      ];
      if (validTabs.includes(hash as NavItemId)) {
        setActiveTab(hash as NavItemId);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check backend health and load data
  const loadData = useCallback(async (range: TimeRange) => {
    setIsRefreshing(true);
    try {
      const health = await syntraApi.checkBackendHealth();
      setIsBackendConnected(health.connected);

      const [m, s, t, d, inf, feed, fc] = await Promise.all([
        syntraApi.getMetrics(range),
        syntraApi.getSentimentTimeline(range),
        syntraApi.getTrends(),
        syntraApi.getDemographics(),
        syntraApi.getInfluenceGraph(),
        syntraApi.getLiveFeed(),
        syntraApi.getForecast(),
      ]);

      setMetrics(m);
      setSentimentData(s);
      setTrends(t);
      setDemographics(d);
      setInfluenceNodes(inf.nodes);
      setInfluenceEdges(inf.edges);
      setFeedPosts(feed);
      setForecastData(fc);
    } catch (err) {
      console.error('Failed loading Syntra dataset:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  }, []);

  useEffect(() => {
    loadData(timeRange);
  }, [timeRange, loadData]);

  // Page title mapping
  const pageTitles: Record<NavItemId, string> = {
    overview: 'Overview',
    'live-feed': 'Live Feed',
    sentiment: 'Sentiment Intelligence',
    demographics: 'Demographics & Audience',
    'trend-radar': 'Trend Radar',
    'influence-graph': 'Influence Topology',
    forecast: 'Predictive Forecast',
  };

  return (
    <div
      className="relative min-h-screen text-[var(--text-body)] flex font-sans antialiased selection:bg-[#6C63FF] selection:text-white"
      style={{ background: 'var(--bg-gradient)', backgroundAttachment: 'fixed' }}
    >
      {/* Ambient background light highlights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full blur-3xl" style={{ background: 'var(--accent-glow)' }} />
        <div className="absolute top-1/2 -left-20 h-96 w-96 rounded-full bg-[#14B8A6]/5 dark:bg-[#14B8A6]/5 blur-3xl" />
      </div>

      {/* Fixed Left Sidebar (180px wide) */}
      <Sidebar activeItem={activeTab} onSelect={handleNavSelect} />

      {/* Main Content Area (offset by 180px for the fixed sidebar) */}
      <div className="flex flex-1 flex-col ml-[180px] min-w-0">

        {/* Top Bar */}
        <TopBar
          pageTitle={pageTitles[activeTab]}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onRefresh={() => loadData(timeRange)}
          isRefreshing={isRefreshing}
          isBackendConnected={isBackendConnected}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <OverviewView
                key="overview-view"
                metrics={metrics}
                sentimentData={sentimentData}
                trends={trends}
                demographics={demographics}
                influenceNodes={influenceNodes}
                influenceEdges={influenceEdges}
                isLoading={isLoading}
                onNavigateToRadar={() => handleNavSelect('trend-radar')}
              />
            )}

            {activeTab === 'live-feed' && (
              <LiveFeedPanel
                key="live-feed-view"
                posts={feedPosts}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'sentiment' && (
              <SentimentView
                key="sentiment-view"
                sentimentData={sentimentData}
              />
            )}

            {activeTab === 'demographics' && (
              <DemographicsView
                key="demographics-view"
                regions={demographics}
              />
            )}

            {activeTab === 'trend-radar' && (
              <TrendRadarView
                key="trend-radar-view"
                trends={trends}
              />
            )}

            {activeTab === 'influence-graph' && (
              <InfluenceGraphView
                key="influence-graph-view"
                nodes={influenceNodes}
                edges={influenceEdges}
              />
            )}

            {activeTab === 'forecast' && (
              <ForecastPanel
                key="forecast-view"
                forecastData={forecastData}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
