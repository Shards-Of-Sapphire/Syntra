import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { SentimentDataPoint } from '../types';
import { useTheme } from '../context/ThemeContext';
import { GraphExplanation } from './GraphExplanation';

interface SentimentTimelineProps {
  data: SentimentDataPoint[];
  isLoading?: boolean;
}

export const SentimentTimeline: React.FC<SentimentTimelineProps> = ({ data }) => {
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeView, setActiveView] = useState<'net' | 'breakdown'>('net');

  // Calculate current average net sentiment
  const currentNet = data.length > 0 ? data[data.length - 1].netScore : 86;
  const avgPositive = Math.round(data.reduce((acc, d) => acc + d.positive, 0) / (data.length || 1));

  return (
    <motion.div
      id="panel-sentiment-timeline"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={shouldReduceMotion ? {} : { y: -2 }}
      className="group relative flex flex-col justify-between rounded-2xl border p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40 dark:hover:border-[#6C63FF]/50 overflow-hidden"
      style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
    >
      {/* Top subtle gradient line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header with Title and Mode Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#E4E4EE] dark:border-[#282838]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                Sentiment Timeline
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/20 border border-[#6C63FF]/30 px-2 py-0.5 text-xs font-semibold text-[#6C63FF] dark:text-[#8E86FF]">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Real-time
              </span>
            </div>
            <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mt-0.5">
              How people feel about your brand throughout the day (happy vs. unhappy comments)
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-[#E4E4EE] dark:border-[#282838] bg-[#FAFAFD] dark:bg-[#0E0E14] p-0.5 text-xs">
            <button
              type="button"
              id="btn-sentiment-net-view"
              onClick={() => setActiveView('net')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer ${
                activeView === 'net'
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs font-semibold'
                  : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
              title="Overall happiness score from 0 to 100"
            >
              Overall Mood
            </button>
            <button
              type="button"
              id="btn-sentiment-breakdown-view"
              onClick={() => setActiveView('breakdown')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer ${
                activeView === 'breakdown'
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs font-semibold'
                  : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
              title="Compare positive vs negative comments"
            >
              Happy vs. Unhappy
            </button>
          </div>
        </div>

        {/* Streamlined Stats Bar with subtle gradient fill */}
        <div className="grid grid-cols-3 gap-2 my-3.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FAFAFD] via-white to-[#FAFAFD] dark:from-[#0E0E14] dark:via-[#16161F] dark:to-[#0E0E14] border border-[#E4E4EE] dark:border-[#282838] text-xs">
          <div className="border-r border-[#E4E4EE] dark:border-[#282838] pr-2">
            <span className="text-[#707085] dark:text-[#9D9DAE] block text-[11px] font-medium">Latest Net Index</span>
            <span className="text-sm font-bold font-mono-numbers text-[#1C1C28] dark:text-[#EDEDF5] flex items-center gap-1 mt-0.5">
              {currentNet}/100
              <span className="text-[10px] font-semibold text-[#14B8A6]">(+3.4 pts)</span>
            </span>
          </div>
          <div className="border-r border-[#E4E4EE] dark:border-[#282838] px-2">
            <span className="text-[#707085] dark:text-[#9D9DAE] block text-[11px] font-medium">Avg Positive Ratio</span>
            <span className="text-sm font-bold font-mono-numbers text-[#1C1C28] dark:text-[#EDEDF5] mt-0.5 block">{avgPositive}%</span>
          </div>
          <div className="pl-2">
            <span className="text-[#707085] dark:text-[#9D9DAE] block text-[11px] font-medium">Polarity Health</span>
            <span className="text-sm font-bold text-[#6C63FF] mt-0.5 block">High Affinity</span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="netSentimentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C63FF" stopOpacity={isDark ? 0.42 : 0.24} />
                  <stop offset="50%" stopColor="#8E86FF" stopOpacity={isDark ? 0.2 : 0.1} />
                  <stop offset="85%" stopColor="#14B8A6" stopOpacity={isDark ? 0.08 : 0.03} />
                  <stop offset="100%" stopColor="#6C63FF" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity={isDark ? 0.38 : 0.22} />
                  <stop offset="60%" stopColor="#14B8A6" stopOpacity={isDark ? 0.12 : 0.05} />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#232332' : '#EEEDF5'} />

              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={{ stroke: isDark ? '#282838' : '#E4E4EE' }}
                tick={{ fill: isDark ? '#9D9DAE' : '#707085', fontSize: 11 }}
              />
              <YAxis
                domain={[50, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? '#9D9DAE' : '#707085', fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload as SentimentDataPoint;
                  return (
                    <div className="rounded-xl border border-[#E4E4EE] dark:border-[#282838] bg-white/95 dark:bg-[#16161F]/95 p-3 shadow-xl backdrop-blur-md text-xs">
                      <p className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] mb-1.5">{label}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-[#707085] dark:text-[#9D9DAE]">
                            <span className="h-2 w-2 rounded-full bg-[#6C63FF]" />
                            Net Score:
                          </span>
                          <span className="font-bold text-[#6C63FF] font-mono-numbers">
                            {item.netScore}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-[#707085] dark:text-[#9D9DAE]">
                            <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
                            Positive:
                          </span>
                          <span className="font-semibold text-[#14B8A6] font-mono-numbers">
                            {item.positive}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-[#707085] dark:text-[#9D9DAE]">
                            <span className="h-2 w-2 rounded-full bg-[#F97362]" />
                            Negative:
                          </span>
                          <span className="font-semibold text-[#F97362] font-mono-numbers">
                            {item.negative}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              {activeView === 'net' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="netScore"
                    stroke="#6C63FF"
                    strokeWidth={2.5}
                    fill="url(#netSentimentGradient)"
                    isAnimationActive={!shouldReduceMotion}
                    animationDuration={900}
                  />
                  <Line
                    type="monotone"
                    dataKey="netScore"
                    stroke="#6C63FF"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: isDark ? '#16161F' : '#ffffff', stroke: '#6C63FF', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#6C63FF', stroke: '#ffffff', strokeWidth: 2 }}
                    isAnimationActive={!shouldReduceMotion}
                    animationDuration={900}
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stroke="#14B8A6"
                    strokeWidth={2}
                    fill="url(#positiveGradient)"
                    isAnimationActive={!shouldReduceMotion}
                    animationDuration={900}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="#F97362"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    isAnimationActive={!shouldReduceMotion}
                    animationDuration={900}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend & Clean Guide Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#707085] dark:text-[#9D9DAE] pt-3 border-t border-[#E4E4EE] dark:border-[#282838]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-[#6C63FF] shadow-[0_0_6px_#6C63FF]" />
            Net Sentiment
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-[#14B8A6] shadow-[0_0_6px_#14B8A6]" />
            Positive
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-[#F97362]" />
            Negative
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE] font-mono-numbers hidden sm:inline">
            Sample: 2h
          </span>
          <GraphExplanation
            idPrefix="sentiment-timeline"
            title="Understanding the Sentiment Chart"
            summary="This chart shows how people feel about your brand right now. We convert thousands of comments into a simple 0 to 100 score: the higher the number, the happier and more supportive your audience is."
            points={[
              {
                title: 'Great Score (Above 75)',
                description: 'Scores above 75 mean most people are praising your product, sharing recommendations, and loving your updates.',
                badge: '>75 Great',
                badgeType: 'success',
              },
              {
                title: 'Going Viral for the Right Reasons',
                description: 'If post numbers spike while sentiment stays high, your news is spreading organically with lots of love. If sentiment drops while volume spikes, check for complaints.',
                badge: 'Healthy Buzz',
                badgeType: 'indigo',
              },
              {
                title: 'Happy vs. Unhappy Split',
                description: 'Click the "Happy vs. Unhappy" button at the top to see the exact percentage of positive, neutral, and negative comments side-by-side.',
                badge: 'Detailed View',
                badgeType: 'info',
              },
              {
                title: 'Warning Zone (Below 50)',
                description: 'If the score dips below 50, complaints are outweighing praise. Your team should check recent posts immediately to see what needs fixing.',
                badge: '<50 Needs Care',
                badgeType: 'warning',
              },
            ]}
            methodology="Our smart AI reads every incoming post, understands slang, humor, and sarcasm, and scores whether each message is positive, neutral, or negative."
          />
        </div>
      </div>
    </motion.div>
  );
};
