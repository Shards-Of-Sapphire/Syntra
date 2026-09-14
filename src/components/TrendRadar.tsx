import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Flame, Search } from 'lucide-react';
import { TrendItem } from '../types';
import { GraphExplanation } from './GraphExplanation';

interface TrendRadarProps {
  trends: TrendItem[];
}

export const TrendRadar: React.FC<TrendRadarProps> = ({ trends }) => {
  const shouldReduceMotion = useReducedMotion();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(trends.map((t) => t.category)))];

  const filteredTrends = trends.filter((trend) => {
    const matchesSearch =
      trend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trend.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || trend.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <motion.div
      id="panel-trend-radar"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={shouldReduceMotion ? {} : { y: -2 }}
      className="group relative flex flex-col justify-between rounded-2xl border p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40 dark:hover:border-[#6C63FF]/50 overflow-hidden"
      style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
    >
      {/* Top subtle gradient line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#E4E4EE] dark:border-[#282838]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                Trend Radar
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/20 border border-[#6C63FF]/30 px-2 py-0.5 text-xs font-semibold text-[#6C63FF] dark:text-[#8E86FF]">
                <Flame className="h-3 w-3 text-[#6C63FF] animate-pulse" />
                Fastest Rising
              </span>
            </div>
            <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mt-0.5">
              Topics gaining speed and popularity the fastest right now
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#707085] dark:text-[#9D9DAE]" />
            <input
              type="text"
              id="input-trend-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics..."
              className="h-8 w-36 rounded-xl border border-[#E4E4EE] dark:border-[#282838] bg-[#FAFAFD] dark:bg-[#0E0E14] pl-8 pr-2.5 text-xs text-[#1C1C28] dark:text-[#EDEDF5] placeholder-[#707085] dark:placeholder-[#9D9DAE] transition-all focus:border-[#6C63FF] focus:bg-white dark:focus:bg-[#16161F] focus:outline-hidden focus:w-44 focus:shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills with smooth active gradient */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              id={`filter-trend-${cat}`}
              onClick={() => setFilterCategory(cat)}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs font-semibold'
                  : 'bg-[#FAFAFD] dark:bg-[#0E0E14] border border-[#E4E4EE] dark:border-[#282838] text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </motion.button>
          ))}
        </div>

        {/* Ranked List */}
        <div className="mt-3 divide-y divide-[#E4E4EE]/70 dark:divide-[#282838]">
          {filteredTrends.slice(0, 5).map((trend) => {
            const isPositive = trend.changePercent > 0;
            return (
              <motion.div
                key={trend.id}
                whileHover={shouldReduceMotion ? {} : { x: 4 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className="group flex items-center justify-between py-2.5 transition-colors hover:bg-gradient-to-r hover:from-[#FAFAFD] hover:to-transparent dark:hover:from-[#0E0E14]/80 dark:hover:to-transparent rounded-xl px-2 -mx-2"
              >
                {/* Rank + Topic */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold font-mono-numbers transition-transform group-hover:scale-105 ${
                      trend.rank === 1
                        ? 'bg-gradient-to-tr from-[#6C63FF]/25 to-[#14B8A6]/20 text-[#6C63FF] dark:text-[#8E86FF] border border-[#6C63FF]/40 shadow-xs'
                        : trend.rank === 2
                        ? 'bg-[#FAFAFD] dark:bg-[#0E0E14] text-[#1C1C28] dark:text-[#EDEDF5] border border-[#E4E4EE] dark:border-[#282838]'
                        : 'bg-[#FAFAFD] dark:bg-[#0E0E14] text-[#707085] dark:text-[#9D9DAE]'
                    }`}
                  >
                    {trend.rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-[#1C1C28] dark:text-[#EDEDF5] truncate group-hover:text-[#6C63FF] transition-colors">
                        {trend.name}
                      </span>
                      <span className="text-[10px] text-[#707085] dark:text-[#9D9DAE] font-medium px-1.5 py-0.2 rounded-md bg-[#FAFAFD] dark:bg-[#0E0E14] border border-[#E4E4EE] dark:border-[#282838] shrink-0">
                        {trend.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE] font-mono-numbers">
                      {trend.mentions.toLocaleString()} mentions
                    </span>
                  </div>
                </div>

                {/* Growth & Velocity */}
                <div className="text-right shrink-0 pl-3">
                  <div
                    className={`inline-flex items-center text-xs font-semibold font-mono-numbers ${
                      isPositive ? 'text-[#14B8A6]' : 'text-[#F97362]'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    {Math.abs(trend.changePercent)}%
                  </div>

                  {/* Gradient Acceleration Bar */}
                  <div className="mt-1 h-1.5 w-16 bg-[#E4E4EE] dark:bg-[#282838] rounded-full overflow-hidden ml-auto">
                    <motion.div
                      initial={shouldReduceMotion ? {} : { width: 0 }}
                      animate={{
                        width: `${Math.min(100, Math.max(20, Math.abs(trend.changePercent)))}%`,
                      }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className={`h-full rounded-full ${
                        trend.rank === 1
                          ? 'bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6]'
                          : 'bg-gradient-to-r from-[#6C63FF]/70 to-[#8E86FF]/70'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Status & Guide Trigger */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#707085] dark:text-[#9D9DAE] pt-3 border-t border-[#E4E4EE] dark:border-[#282838]">
        <div className="flex items-center gap-2">
          <span className="font-mono-numbers text-[11px]">Tracking 412 topics</span>
          <span className="text-[10px] text-[#707085] dark:text-[#9D9DAE]">• 5 categories</span>
        </div>

        <GraphExplanation
          idPrefix="trend-radar"
          title="How to Read Trending Topics"
          summary="The Trend Radar spots what people are getting excited about right now. Instead of just counting total posts, it looks at how fast a topic is growing so you can catch viral discussions early."
          points={[
            {
              title: 'Growth Speed (+%)',
              description: 'Shows how fast conversation is speeding up compared to earlier today. A big percentage means it is suddenly blowing up.',
              badge: 'Speed of Growth',
              badgeType: 'indigo',
            },
            {
              title: 'Top-Ranked Spark Plugs',
              description: 'Topics at the very top drive over 60% of related discussions. When they trend, they pull other related hashtags along with them.',
              badge: 'Key Drivers',
              badgeType: 'success',
            },
            {
              title: 'Filter by Category',
              description: 'Switch between Product, Tech, and Community so viral internet memes do not hide important feedback about your software.',
              badge: 'Filter Noise',
              badgeType: 'info',
            },
            {
              title: 'How Long Trends Last',
              description: 'Fast-rising topics usually stay hot for 18 to 36 hours before settling back down into regular, everyday conversation.',
              badge: '1–2 Day Peak',
              badgeType: 'warning',
            },
          ]}
          methodology="The system counts sudden bursts in keyword mentions, ignores automated bot spam, and highlights genuine human enthusiasm."
        />
      </div>
    </motion.div>
  );
};
