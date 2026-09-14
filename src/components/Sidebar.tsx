import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  LayoutDashboard,
  Radio,
  Smile,
  Globe,
  TrendingUp,
  Share2,
  LineChart,
  Activity,
} from 'lucide-react';
import { NavItemId } from '../types';

interface SidebarProps {
  activeItem: NavItemId;
  onSelect: (id: NavItemId) => void;
}

interface NavItemConfig {
  id: NavItemId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live-feed', label: 'Live Feed', icon: Radio, badge: 'Live' },
  { id: 'sentiment', label: 'Sentiment', icon: Smile },
  { id: 'demographics', label: 'Demographics', icon: Globe },
  { id: 'trend-radar', label: 'Trend Radar', icon: TrendingUp },
  { id: 'influence-graph', label: 'Influence Graph', icon: Share2 },
  { id: 'forecast', label: 'Forecast', icon: LineChart, badge: 'AI' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onSelect }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside
      id="sidebar-navigation"
      className="fixed left-0 top-0 bottom-0 z-30 flex w-[180px] flex-col justify-between border-r select-none shrink-0 transition-colors duration-200"
      style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
    >
      <div>
        {/* Logo & Brand Header */}
        <div className="flex h-16 items-center px-4 border-b relative overflow-hidden" style={{ borderColor: 'var(--card-border)' }}>
          {/* Accent glow behind logo */}
          <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full blur-xl pointer-events-none" style={{ background: 'var(--accent-glow)' }} />

          <div className="flex items-center gap-2.5 relative z-10">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.08, rotate: 5 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C63FF] via-[#7E77FF] to-[#14B8A6] text-white shadow-md shadow-[#6C63FF]/30 cursor-pointer"
            >
              <Activity className="h-4 w-4" />
            </motion.div>
            <div>
              <span className="text-base font-bold font-display tracking-tight text-[#1C1C28] dark:text-[#EDEDF5] block leading-tight">
                Syntra
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-[#707085] dark:text-[#9D9DAE] block">
                Analytics
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                id={`nav-item-${item.id}`}
                onClick={() => onSelect(item.id)}
                whileHover={shouldReduceMotion ? {} : { x: 3 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className={`group relative flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#6C63FF] dark:text-[#8E86FF] font-semibold'
                    : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
                }`}
              >
                {/* Active Sliding Indicator with subtle gradient glow */}
                {isActive && (
                  <>
                  <motion.div
                    layoutId="active-nav-indicator"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 450, damping: 35 }
                    }
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6C63FF]/15 via-[#6C63FF]/10 to-[#14B8A6]/10 border border-[#6C63FF]/35 shadow-xs"
                    style={{ zIndex: 0 }}
                  />
                  {/* Accent glow behind active icon */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full blur-md pointer-events-none" style={{ background: 'var(--accent-glow)', zIndex: 0 }} />
                  </>
                )}

                <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'text-[#6C63FF] dark:text-[#8E86FF]'
                        : 'text-[#9897AA] dark:text-[#6A697E] group-hover:text-[#6C63FF]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`relative z-10 rounded-full px-1.5 py-0.2 text-[9px] font-semibold leading-none border transition-all ${
                      item.badge === 'Live'
                        ? 'bg-gradient-to-r from-[#F97362]/15 to-[#F97362]/25 text-[#F97362] border-[#F97362]/35 animate-pulse'
                        : 'bg-gradient-to-r from-[#6C63FF]/15 to-[#14B8A6]/20 text-[#6C63FF] dark:text-[#8E86FF] border-[#6C63FF]/35'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: System Status */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
        <div className="relative rounded-xl p-2.5 border text-xs overflow-hidden" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--card-border)' }}>
          {/* Subtle top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#14B8A6] to-transparent" />

          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]" />
            </span>
            <span className="text-[11px] font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">System Status</span>
          </div>
          <p className="text-[10px] text-[#707085] dark:text-[#9D9DAE] mt-1 leading-tight">
            Tracking 150k posts per second
          </p>
        </div>
      </div>
    </aside>
  );
};
