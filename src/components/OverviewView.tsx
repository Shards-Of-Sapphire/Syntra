import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MetricCard } from './MetricCard';
import { SentimentTimeline } from './SentimentTimeline';
import { TrendRadar } from './TrendRadar';
import { DemographicMap } from './DemographicMap';
import { InfluenceGraph } from './InfluenceGraph';
import { VelocityAlertSystem } from './VelocityAlertSystem';
import { MetricCardSkeleton, PanelSkeleton } from './SkeletonLoader';
import {
  MetricItem,
  SentimentDataPoint,
  TrendItem,
  DemographicRegion,
  InfluenceNode,
  InfluenceEdge,
} from '../types';

interface OverviewViewProps {
  metrics: MetricItem[];
  sentimentData: SentimentDataPoint[];
  trends: TrendItem[];
  demographics: DemographicRegion[];
  influenceNodes: InfluenceNode[];
  influenceEdges: InfluenceEdge[];
  isLoading?: boolean;
  onNavigateToRadar?: (trendId?: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  sentimentData,
  trends,
  demographics,
  influenceNodes,
  influenceEdges,
  isLoading = false,
  onNavigateToRadar,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      id="overview-content"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Real-time Velocity Surveillance & Notification System */}
      <section aria-label="Real-time Velocity Alert System">
        <VelocityAlertSystem
          trends={trends}
          onNavigateToRadar={onNavigateToRadar}
        />
      </section>

      {/* 4 Metric Cards in a Row */}
      <section aria-label="Key Performance Metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
          ) : (
            metrics.map((metric, idx) => (
              <MetricCard key={metric.id} metric={metric} index={idx} />
            ))
          )}
        </div>
      </section>

      {/* Row 1: Side-by-Side Sentiment Timeline & Trend Radar */}
      <section aria-label="Sentiment and Trend Radar" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isLoading ? (
          <>
            <PanelSkeleton height="h-96" />
            <PanelSkeleton height="h-96" />
          </>
        ) : (
          <>
            <SentimentTimeline data={sentimentData} />
            <TrendRadar trends={trends} />
          </>
        )}
      </section>

      {/* Row 2: Side-by-Side Demographic Map & Influence Graph */}
      <section aria-label="Demographics and Influence Topology" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isLoading ? (
          <>
            <PanelSkeleton height="h-96" />
            <PanelSkeleton height="h-96" />
          </>
        ) : (
          <>
            <DemographicMap regions={demographics} />
            <InfluenceGraph nodes={influenceNodes} edges={influenceEdges} />
          </>
        )}
      </section>
    </motion.div>
  );
};
