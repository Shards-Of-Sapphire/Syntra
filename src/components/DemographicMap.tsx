import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Globe, Users } from 'lucide-react';
import { DemographicRegion } from '../types';
import { GraphExplanation } from './GraphExplanation';

interface DemographicMapProps {
  regions: DemographicRegion[];
}

export const DemographicMap: React.FC<DemographicMapProps> = ({ regions }) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeRegion, setActiveRegion] = useState<DemographicRegion | null>(null);
  const [metricMode, setMetricMode] = useState<'volume' | 'sentiment'>('volume');

  return (
    <motion.div
      id="panel-demographic-map"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                Global Audience Map
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/20 border border-[#6C63FF]/30 px-2 py-0.5 text-xs font-semibold text-[#6C63FF] dark:text-[#8E86FF]">
                <Globe className="h-3 w-3 text-[#6C63FF] animate-pulse" />
                World Map
              </span>
            </div>
            <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mt-0.5">
              Where in the world people are talking about your brand
            </p>
          </div>

          {/* Mode Switch */}
          <div className="flex items-center rounded-xl border border-[#E4E4EE] dark:border-[#282838] bg-[#FAFAFD] dark:bg-[#0E0E14] p-0.5 text-xs">
            <button
              type="button"
              id="btn-demographic-vol-mode"
              onClick={() => setMetricMode('volume')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer ${
                metricMode === 'volume'
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs font-semibold'
                  : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
              title="View share of total posts"
            >
              Post Count
            </button>
            <button
              type="button"
              id="btn-demographic-sent-mode"
              onClick={() => setMetricMode('sentiment')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer ${
                metricMode === 'sentiment'
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs font-semibold'
                  : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
              title="View how happy users are by country"
            >
              Audience Mood
            </button>
          </div>
        </div>

        {/* Interactive Heatmap Canvas (Stylized SVG Projection + Radar Scan) */}
        <div className="relative mt-3.5 h-48 w-full rounded-xl bg-gradient-to-b from-[#FAFAFD] to-[#F2F1F8] dark:from-[#0E0E14] dark:to-[#13131D] border border-[#E4E4EE] dark:border-[#282838] overflow-hidden flex items-center justify-center">
          {/* Subtle World Map Outline Grid */}
          <svg
            className="absolute inset-0 h-full w-full opacity-35 dark:opacity-20 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 200"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="dotGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#707085" />
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#dotGrid)" />

            {/* Stylized Landmass Silhouettes */}
            <path d="M 40,30 Q 70,25 120,40 Q 135,70 110,80 Q 70,85 50,60 Z" fill="#9897AA" opacity="0.35" />
            <path d="M 100,95 Q 130,105 125,145 Q 110,180 95,165 Q 85,120 100,95 Z" fill="#9897AA" opacity="0.35" />
            <path d="M 180,30 Q 225,25 235,55 Q 210,70 185,60 Z" fill="#9897AA" opacity="0.35" />
            <path d="M 185,75 Q 235,75 230,125 Q 210,165 190,140 Q 175,100 185,75 Z" fill="#9897AA" opacity="0.35" />
            <path d="M 240,25 Q 350,30 360,80 Q 320,110 270,95 Q 240,75 240,25 Z" fill="#9897AA" opacity="0.35" />
            <path d="M 315,125 Q 365,125 360,160 Q 325,170 315,145 Z" fill="#9897AA" opacity="0.35" />
          </svg>

          {/* World Radar Scan Sweep Line */}
          {!shouldReduceMotion && (
            <div className="absolute inset-0 animate-radar-sweep opacity-15 pointer-events-none">
              <div className="h-1/2 w-1/2 bg-gradient-to-br from-[#6C63FF] via-[#14B8A6]/40 to-transparent origin-bottom-right" />
            </div>
          )}

          {/* Regional Heatmap Hotspot Nodes */}
          {regions.map((reg) => {
            const isHovered = activeRegion?.id === reg.id;
            const size = Math.max(20, Math.round(reg.share * 1.15));
            return (
              <motion.div
                key={reg.id}
                onMouseEnter={() => setActiveRegion(reg)}
                onMouseLeave={() => setActiveRegion(null)}
                whileHover={shouldReduceMotion ? {} : { scale: 1.25 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{
                  left: `${reg.x}%`,
                  top: `${reg.y}%`,
                }}
              >
                {/* Radial Glow Heat Pulse */}
                <span
                  className={`absolute -inset-2.5 rounded-full opacity-40 ${
                    metricMode === 'sentiment' && reg.sentiment >= 80
                      ? 'bg-[#14B8A6] animate-ping'
                      : 'bg-[#6C63FF] animate-pulse'
                  }`}
                  style={{ animationDuration: '2.8s' }}
                />

                {/* Hotspot Center Disc with gradient fill */}
                <div
                  className={`relative flex items-center justify-center rounded-full border-2 border-white dark:border-[#16161F] shadow-md text-[10px] font-bold text-white transition-all ${
                    metricMode === 'sentiment'
                      ? reg.sentiment >= 80
                        ? 'bg-gradient-to-tr from-[#14B8A6] to-[#45D1C1]'
                        : 'bg-gradient-to-tr from-[#6C63FF] to-[#8E86FF]'
                      : isHovered
                      ? 'bg-gradient-to-tr from-[#5B52EE] to-[#8E86FF] ring-4 ring-[#6C63FF]/35'
                      : 'bg-gradient-to-tr from-[#6C63FF] to-[#8E86FF]'
                  }`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                >
                  {reg.code}
                </div>
              </motion.div>
            );
          })}

          {/* Floating Tooltip if Hovered */}
          {activeRegion ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute bottom-2.5 left-3 right-3 z-20 rounded-xl border border-[#6C63FF]/30 bg-white/95 dark:bg-[#16161F]/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-md flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">{activeRegion.name}</span>
                <span className="text-[#707085] dark:text-[#9D9DAE] text-[11px] ml-1.5">({activeRegion.code})</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#707085] dark:text-[#9D9DAE]">
                  Share: <strong className="text-[#6C63FF] font-mono-numbers">{activeRegion.share}%</strong>
                </span>
                <span className="text-[#707085] dark:text-[#9D9DAE]">
                  Sent: <strong className="text-[#14B8A6] font-mono-numbers">{activeRegion.sentiment}%</strong>
                </span>
                <span className="text-[#707085] dark:text-[#9D9DAE]">
                  Vol: <strong className="text-[#1C1C28] dark:text-[#EDEDF5] font-mono-numbers">{activeRegion.mentions.toLocaleString()}</strong>
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="pointer-events-none absolute bottom-2 text-[10px] text-[#707085] dark:text-[#9D9DAE] tracking-wide">
              Hover over the circles to see details for each region
            </div>
          )}
        </div>

        {/* Region Breakdown Bars with gradient fills */}
        <div className="mt-3.5 space-y-2">
          {regions.slice(0, 3).map((reg) => (
            <div key={reg.id} className="text-xs">
              <div className="flex items-center justify-between text-[#707085] dark:text-[#9D9DAE] mb-1">
                <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">{reg.name}</span>
                <span className="text-[#707085] dark:text-[#9D9DAE] font-mono-numbers">
                  {metricMode === 'volume' ? `${reg.share}%` : `${reg.sentiment}% Pos`}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#E4E4EE] dark:bg-[#282838] overflow-hidden">
                <motion.div
                  initial={shouldReduceMotion ? {} : { width: 0 }}
                  animate={{
                    width: `${metricMode === 'volume' ? reg.share * 2.2 : reg.sentiment}%`,
                  }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`h-full rounded-full ${
                    metricMode === 'sentiment'
                      ? 'bg-gradient-to-r from-[#14B8A6] to-[#45D1C1]'
                      : 'bg-gradient-to-r from-[#6C63FF] to-[#8E86FF]'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer & Guide Trigger */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#707085] dark:text-[#9D9DAE] pt-3 border-t border-[#E4E4EE] dark:border-[#282838]">
        <span className="flex items-center gap-1.5 font-mono-numbers text-[11px]">
          <Users className="h-3 w-3 text-[#6C63FF]" />
          5 Global Regions
        </span>

        <div className="flex items-center gap-3">
          <span className="text-[#707085] dark:text-[#9D9DAE] text-[11px] hidden sm:inline">
            Top: North America (38.4%)
          </span>
          <GraphExplanation
            idPrefix="demographic-map"
            title="How to Read the Global Map"
            summary="This map shows where people are talking about your brand across the world, comparing where most posts come from against how happy those users are."
            points={[
              {
                title: 'Post Count vs. Happiness',
                description: 'Switch between "Post Count" (where most posts happen) and "Audience Mood" (where people are happiest) to find your strongest regions.',
                badge: 'Easy Switch',
                badgeType: 'indigo',
              },
              {
                title: 'Circle Sizes & Glowing Rings',
                description: 'Larger circles mean more posts from that country. Glowing pulsating rings highlight cities where conversation is suddenly spiking right now.',
                badge: 'Live Hotspots',
                badgeType: 'info',
              },
              {
                title: 'Timezones & Daily Routines',
                description: 'Activity naturally rises when people wake up in their time zone. Big nighttime spikes often mean exciting breaking news or viral posts.',
                badge: 'Daily Cycle',
                badgeType: 'success',
              },
              {
                title: 'Growth Opportunities',
                description: 'Countries with very high happiness (>85%) but smaller post numbers are great candidates for new marketing campaigns.',
                badge: 'High Potential',
                badgeType: 'warning',
              },
            ]}
            methodology="We group public posts by region and country, remove spam bots, and calculate the overall happiness score for each geographic area."
          />
        </div>
      </div>
    </motion.div>
  );
};
