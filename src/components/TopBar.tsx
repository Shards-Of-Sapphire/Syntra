import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Calendar,
  ChevronDown,
  RefreshCw,
  Sun,
  Moon,
  Server,
  CheckCircle2,
} from 'lucide-react';
import { TimeRange } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  pageTitle: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  isBackendConnected?: boolean;
}

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
];

export const TopBar: React.FC<TopBarProps> = ({
  pageTitle,
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isRefreshing = false,
  isBackendConnected = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const currentLabel = TIME_RANGES.find((r) => r.value === timeRange)?.label || 'Last 24h';

  return (
    <header
      id="topbar-container"
      className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b px-6 backdrop-blur-md transition-colors duration-200"
      style={{ background: 'color-mix(in srgb, var(--bg-card) 90%, transparent)', borderColor: 'var(--card-border)' }}
    >
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold font-display text-[#1C1C28] dark:text-[#EDEDF5] tracking-tight">
            {pageTitle}
          </h1>
          <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-[#E4E4EE] dark:border-[#282838]" />
          <span className="hidden sm:inline-block text-xs font-medium text-[#707085] dark:text-[#9D9DAE]">
            Real-Time Dashboard
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Backend Indicator Badge */}
        <div
          title={
            isBackendConnected
              ? 'FastAPI connected at localhost:8000'
              : 'Standby for FastAPI at localhost:8000 (Mock stream active)'
          }
          className="hidden md:flex items-center gap-1.5 rounded-xl border bg-[var(--bg-app)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <Server className="h-3 w-3 text-[#9897AA] dark:text-[#6A697E]" />
          <span>FastAPI:</span>
          <span className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isBackendConnected
                  ? 'bg-[#14B8A6] shadow-[0_0_8px_#14B8A6]'
                  : 'bg-[#6C63FF] shadow-[0_0_8px_#6C63FF]'
              }`}
            />
            <span
              className={`font-semibold ${
                isBackendConnected ? 'text-[#14B8A6]' : 'text-[#6C63FF]'
              }`}
            >
              {isBackendConnected ? 'Active' : 'Standby'}
            </span>
          </span>
        </div>

        {/* Time-Range Dropdown */}
        <div className="relative">
          <motion.button
            type="button"
            id="btn-time-range-dropdown"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium text-[var(--text-body)] transition-all hover:border-[#6C63FF]/50 hover:shadow-xs cursor-pointer"
            style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
          >
            <Calendar className="h-3.5 w-3.5 text-[#6C63FF]" />
            <span>{currentLabel}</span>
            <ChevronDown
              className={`h-3 w-3 text-[#707085] dark:text-[#9D9DAE] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </motion.button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-1.5 w-40 z-50 rounded-xl border p-1 shadow-xl text-xs"
                style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
              >
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => {
                      onTimeRangeChange(range.value);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      timeRange === range.value
                        ? 'bg-gradient-to-r from-[#6C63FF]/15 to-[#14B8A6]/15 text-[#6C63FF] font-semibold'
                        : 'text-[#707085] dark:text-[#9D9DAE] hover:bg-[#FAFAFD] dark:hover:bg-[#0E0E14] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
                    }`}
                  >
                    <span>{range.label}</span>
                    {timeRange === range.value && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#6C63FF]" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </div>

        {/* Refresh Action */}
        <motion.button
          type="button"
          id="btn-refresh-dashboard"
          onClick={onRefresh}
          disabled={isRefreshing}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.92, rotate: 90 }}
          className="flex h-8 w-8 items-center justify-center rounded-xl border text-[var(--text-muted)] transition-all hover:border-[#6C63FF] hover:text-[#6C63FF] hover:shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
          style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
          title="Refresh data"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[#6C63FF]' : ''}`}
          />
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          type="button"
          id="btn-toggle-dark-mode"
          onClick={toggleTheme}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="group relative flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium text-[var(--text-body)] transition-all hover:border-[#6C63FF]/60 hover:shadow-xs cursor-pointer"
          style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-3.5 w-3.5 text-[#F5B942] transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline text-xs font-semibold">Light</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-[#6C63FF] transition-transform duration-300 group-hover:-rotate-45" />
              <span className="hidden sm:inline text-xs font-semibold">Dark</span>
            </>
          )}
        </motion.button>
      </div>
    </header>
  );
};
