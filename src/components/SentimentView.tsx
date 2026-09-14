import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SentimentTimeline } from './SentimentTimeline';
import { SentimentDataPoint } from '../types';

interface SentimentViewProps {
  sentimentData: SentimentDataPoint[];
}

export const SentimentView: React.FC<SentimentViewProps> = ({ sentimentData }) => {
  const shouldReduceMotion = useReducedMotion();

  const drivers = [
    { word: 'Fast & responsive UI', sentiment: 'positive', score: '+96%', mentions: 18400 },
    { word: 'High accuracy clustering', sentiment: 'positive', score: '+92%', mentions: 14200 },
    { word: 'FastAPI integration ease', sentiment: 'positive', score: '+88%', mentions: 9800 },
    { word: 'Dark mode request', sentiment: 'neutral', score: '62%', mentions: 6400 },
    { word: 'Rate limit edge cases', sentiment: 'negative', score: '-18%', mentions: 2100 },
  ];

  return (
    <motion.div
      id="sentiment-page"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <SentimentTimeline data={sentimentData} />

      {/* Deep Dive Aspect Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sentiment Drivers */}
        <div className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h3 className="text-base font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5] mb-1">What People Love (and Don't)</h3>
          <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">The main topics that make people happy or unhappy about your brand</p>

          <div className="space-y-3">
            {drivers.map((d, i) => (
              <motion.div
                key={i}
                whileHover={shouldReduceMotion ? {} : { x: 3 }}
                className="flex items-center justify-between rounded-xl bg-[#FAFAFD] dark:bg-[#0E0E14] p-3 text-xs border border-[#E4E4EE] dark:border-[#282838] hover:border-[#6C63FF]/30 transition-all"
              >
                <div>
                  <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">{d.word}</span>
                  <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE] block mt-0.5 font-mono-numbers">
                    {d.mentions.toLocaleString()} posts about this
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                    d.sentiment === 'positive'
                      ? 'bg-gradient-to-r from-[#14B8A6]/10 to-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/30'
                      : d.sentiment === 'negative'
                      ? 'bg-gradient-to-r from-[#F97362]/10 to-[#F97362]/20 text-[#F97362] border-[#F97362]/30'
                      : 'bg-gradient-to-r from-[#F5B942]/10 to-[#F5B942]/20 text-[#F5B942] border-[#F5B942]/30'
                  }`}
                >
                  {d.score}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Aspect Categorization */}
        <div className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h3 className="text-base font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5] mb-1">Happiness by Category</h3>
          <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">How people feel about different parts of your product</p>

          <div className="space-y-4">
            {[
              { aspect: 'Speed & Responsiveness', score: 94, positive: '94%' },
              { aspect: 'Ease of Use for Developers', score: 89, positive: '89%' },
              { aspect: 'Design & Visual Clarity', score: 86, positive: '86%' },
              { aspect: 'Help Guides & Tutorials', score: 78, positive: '78%' },
              { aspect: 'Security & Compliance', score: 71, positive: '71%' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#1C1C28] dark:text-[#EDEDF5]">{item.aspect}</span>
                  <span className="font-semibold text-[#6C63FF] dark:text-[#8E86FF] font-mono-numbers">{item.positive} Positive</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E4E4EE] dark:bg-[#282838] overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? {} : { width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.6, delay: 0.1 * idx }}
                    className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#14B8A6]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
