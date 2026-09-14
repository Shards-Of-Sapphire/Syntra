import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DemographicMap } from './DemographicMap';
import { DemographicRegion } from '../types';

interface DemographicsViewProps {
  regions: DemographicRegion[];
}

export const DemographicsView: React.FC<DemographicsViewProps> = ({ regions }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      id="demographics-page"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <DemographicMap regions={regions} />

      {/* Cohort & Device Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Age Cohort */}
        <div className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5] mb-1">Audience Age Groups</h3>
          <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">Which age brackets talk about your brand the most</p>
          <div className="space-y-3">
            {[
              { age: '18 - 24', pct: 24 },
              { age: '25 - 34', pct: 48 },
              { age: '35 - 44', pct: 18 },
              { age: '45+', pct: 10 },
            ].map((cohort, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-[#1C1C28] dark:text-[#EDEDF5]">{cohort.age} years</span>
                  <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] font-mono-numbers">{cohort.pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#E4E4EE] dark:bg-[#282838] overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? {} : { width: 0 }}
                    animate={{ width: `${cohort.pct * 2}%` }}
                    transition={{ duration: 0.6, delay: 0.1 * i }}
                    className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8E86FF]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Languages */}
        <div className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5] mb-1">Top Languages</h3>
          <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">Most common languages used in user posts</p>
          <div className="space-y-3">
            {[
              { lang: 'English (US/UK)', pct: '62%' },
              { lang: 'Spanish (ES/LATAM)', pct: '14%' },
              { lang: 'German (DE)', pct: '9%' },
              { lang: 'Japanese (JP)', pct: '8%' },
              { lang: 'French (FR)', pct: '7%' },
            ].map((l, i) => (
              <motion.div
                key={i}
                whileHover={shouldReduceMotion ? {} : { x: 3 }}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs border hover:border-[#6C63FF]/30 transition-all"
                style={{ background: 'color-mix(in srgb, var(--bg-app), transparent 40%)', borderColor: 'var(--border-subtle)' }}
              >
                <span className="font-medium text-[#1C1C28] dark:text-[#EDEDF5]">{l.lang}</span>
                <span className="font-semibold text-[#6C63FF] dark:text-[#8E86FF] font-mono-numbers">{l.pct}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Device & Client Origin */}
        <div className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5] mb-1">Devices People Use</h3>
          <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">Where people are creating and posting from</p>
          <div className="space-y-3">
            {[
              { origin: 'Phones & Tablets (Mobile)', pct: '56%' },
              { origin: 'Laptops & Computers (Desktop)', pct: '34%' },
              { origin: 'Automated Tools & Feeds', pct: '10%' },
            ].map((o, i) => (
              <motion.div
                key={i}
                whileHover={shouldReduceMotion ? {} : { x: 3 }}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs border hover:border-[#6C63FF]/30 transition-all"
                style={{ background: 'color-mix(in srgb, var(--bg-app), transparent 40%)', borderColor: 'var(--border-subtle)' }}
              >
                <span className="font-medium text-[#1C1C28] dark:text-[#EDEDF5]">{o.origin}</span>
                <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] font-mono-numbers">{o.pct}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
