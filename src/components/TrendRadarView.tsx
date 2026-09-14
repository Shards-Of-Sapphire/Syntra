import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TrendRadar } from './TrendRadar';
import { TrendItem } from '../types';
import { Flame, Sparkles } from 'lucide-react';

interface TrendRadarViewProps {
  trends: TrendItem[];
}

export const TrendRadarView: React.FC<TrendRadarViewProps> = ({ trends }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      id="trend-radar-page"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <TrendRadar trends={trends} />

      {/* Emergent Hashtags & Velocity Radar Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-4 w-4 text-[#6C63FF] animate-pulse" />
            <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">Fastest-Growing Topics (Right Now)</h3>
          </div>
          <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">New topics picking up serious speed in the last 4 hours</p>

          <div className="space-y-3">
            {[
              { tag: '#SyntraV2', speed: '+142%', label: 'Viral Surge' },
              { tag: '#LatencyFreeAnalytics', speed: '+88%', label: 'Fast Rising' },
              { tag: '#RealtimeDataStack', speed: '+64%', label: 'High Interest' },
              { tag: '#SocialIntelligence2026', speed: '+47%', label: 'Gaining Traction' },
            ].map((t, i) => (
              <motion.div
                key={i}
                whileHover={shouldReduceMotion ? {} : { x: 4 }}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs border hover:border-[#6C63FF]/30 transition-all"
                style={{ background: 'color-mix(in srgb, var(--bg-app), transparent 40%)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">{t.tag}</span>
                  <span className="rounded-md bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/20 border border-[#6C63FF]/30 px-2 py-0.5 text-[10px] font-semibold text-[#6C63FF] dark:text-[#8E86FF]">
                    {t.label}
                  </span>
                </div>
                <span className="font-bold text-[#14B8A6] font-mono-numbers">{t.speed}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#6C63FF] animate-pulse" />
            <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">Topics Often Mentioned Together</h3>
          </div>
          <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">When people talk about one topic, they frequently talk about the other too</p>

          <div className="space-y-3">
            {[
              { pair: '#SyntraIntelligence ↔ #AIRevolution', correlation: '94% Linked' },
              { pair: '#NextGenAnalytics ↔ RealTimeDataAPI', correlation: '88% Linked' },
              { pair: 'SocialListening v2 ↔ DashboardUX', correlation: '79% Linked' },
              { pair: '#SyntraIntelligence ↔ PythonFastAPI', correlation: '74% Linked' },
            ].map((p, i) => (
              <motion.div
                key={i}
                whileHover={shouldReduceMotion ? {} : { x: 4 }}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs border hover:border-[#6C63FF]/30 transition-all"
                style={{ background: 'color-mix(in srgb, var(--bg-app), transparent 40%)', borderColor: 'var(--border-subtle)' }}
              >
                <span className="font-medium text-[#1C1C28] dark:text-[#EDEDF5]">{p.pair}</span>
                <span className="font-semibold text-[#6C63FF] dark:text-[#8E86FF] font-mono-numbers">{p.correlation}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
