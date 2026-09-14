import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { MetricItem } from '../types';

interface MetricCardProps {
  metric: MetricItem;
  index: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, index }) => {
  const [displayCount, setDisplayCount] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  // Number counting animation on initial load
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayCount(metric.value);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 850; // ms
    const target = metric.value;

    const animateNumber = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(target * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayCount(target);
      }
    };

    const animFrame = requestAnimationFrame(animateNumber);
    return () => cancelAnimationFrame(animFrame);
  }, [metric.value, shouldReduceMotion]);

  const formattedValue = () => {
    if (metric.displayFormat === 'percent') {
      return `${displayCount.toFixed(1)}${metric.suffix || '%'}`;
    }
    if (metric.displayFormat === 'decimal') {
      return `${displayCount.toFixed(1)}${metric.suffix || ''}`;
    }
    if (metric.displayFormat === 'compact') {
      if (metric.value >= 1000000) {
        return `${(displayCount / 1000000).toFixed(2)}M`;
      }
      if (metric.value >= 1000) {
        return Math.round(displayCount).toLocaleString();
      }
      return Math.round(displayCount).toString();
    }
    return Math.round(displayCount).toLocaleString();
  };

  const isPositive = metric.changeType === 'increase';
  const isNeutral = metric.changeType === 'neutral';

  return (
    <motion.div
      id={`metric-card-${metric.id}`}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        shouldReduceMotion
          ? {}
          : { y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }
      }
      className="group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40 dark:hover:border-[#6C63FF]/50 overflow-hidden"
      style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
    >
      {/* Sleek top edge gradient line that glows on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Muted label above & semantic pill with gradient */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-[#707085] dark:text-[#9D9DAE] uppercase">
            {metric.label}
          </span>
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold border transition-transform duration-200 group-hover:scale-105 ${
              isNeutral
                ? 'bg-gradient-to-r from-[#F5B942]/10 to-[#F5B942]/20 text-[#F5B942] border-[#F5B942]/30'
                : isPositive
                ? 'bg-gradient-to-r from-[#14B8A6]/10 to-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/30'
                : 'bg-gradient-to-r from-[#F97362]/10 to-[#F97362]/20 text-[#F97362] border-[#F97362]/30'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : isNeutral ? (
              <Minus className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(metric.changePercent)}%
          </span>
        </div>

        {/* Bold numbers for metrics */}
        <div className="mt-3 flex items-baseline gap-1">
          {metric.prefix && (
            <span className="text-xl font-bold text-[#6C63FF] select-none font-display">
              {metric.prefix}
            </span>
          )}
          <span className="text-3xl font-extrabold tracking-tight text-[#1C1C28] dark:text-[#EDEDF5] font-display font-mono-numbers">
            {formattedValue()}
          </span>
        </div>
      </div>

      {/* Subtext and mini sparkline with animated gradient bars */}
      <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--card-border)' }}>
        <span className="text-xs text-[#707085] dark:text-[#9D9DAE] font-medium truncate max-w-[150px]">
          {metric.subtext}
        </span>

        {/* Mini trend sparkline with gradient fill */}
        <div className="flex items-end gap-1 h-4">
          {metric.trendData.slice(-6).map((val, idx, arr) => {
            const min = Math.min(...arr);
            const max = Math.max(...arr) || 1;
            const normalized = Math.max(4, Math.round(((val - min) / (max - min || 1)) * 14));
            const isLast = idx === arr.length - 1;
            return (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? {} : { height: 2 }}
                animate={{ height: `${normalized}px` }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.05 }}
                className={`w-1 rounded-t-full transition-all duration-300 ${
                  isLast
                    ? 'bg-gradient-to-t from-[#6C63FF] to-[#8E86FF] shadow-xs'
                    : 'bg-[#E4E4EE] dark:bg-[#282838] group-hover:bg-gradient-to-t group-hover:from-[#6C63FF]/50 group-hover:to-[#14B8A6]/60'
                }`}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
