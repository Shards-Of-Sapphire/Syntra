import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Bell,
  Sliders,
  X,
  Volume2,
  VolumeX,
  Zap,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { TrendItem } from '../types';

export interface VelocityAlert {
  id: string;
  trendId: string;
  trendName: string;
  category: string;
  previousVelocity: number;
  currentVelocity: number;
  threshold: number;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  timestamp: string;
  isRead: boolean;
  severity: 'critical' | 'warning' | 'info';
}

interface VelocityAlertSystemProps {
  trends: TrendItem[];
  onNavigateToRadar?: (trendId?: string) => void;
}

export const VelocityAlertSystem: React.FC<VelocityAlertSystemProps> = ({
  trends,
  onNavigateToRadar,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [threshold, setThreshold] = useState<number>(50);
  const [selectedTrendFilter, setSelectedTrendFilter] = useState<string>('all');
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<VelocityAlert | null>(null);

  const thresholdSelectId = useId();
  const thresholdSliderId = useId();

  const [alerts, setAlerts] = useState<VelocityAlert[]>(() => {
    const initial: VelocityAlert[] = [];
    trends.forEach((t) => {
      if (t.changePercent >= 50) {
        initial.push({
          id: `alert-${t.id}-${Date.now() - 120000}`,
          trendId: t.id,
          trendName: t.name,
          category: t.category,
          previousVelocity: 42.0,
          currentVelocity: t.changePercent,
          threshold: 50,
          mentions: t.mentions,
          sentiment: t.sentiment,
          sentimentScore: t.sentimentScore,
          timestamp: '2m ago',
          isRead: false,
          severity: 'critical',
        });
      }
    });
    return initial;
  });

  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  const playAlertChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // Audio context policy
    }
  };

  const triggerNewAlert = (trend: TrendItem, customVelocity?: number) => {
    const velocity = customVelocity ?? trend.changePercent;
    const newAlert: VelocityAlert = {
      id: `alert-${trend.id}-${Date.now()}`,
      trendId: trend.id,
      trendName: trend.name,
      category: trend.category,
      previousVelocity: Math.max(10, Math.round((velocity - 18) * 10) / 10),
      currentVelocity: Math.round(velocity * 10) / 10,
      threshold,
      mentions: trend.mentions + Math.floor(Math.random() * 850),
      sentiment: trend.sentiment,
      sentimentScore: trend.sentimentScore,
      timestamp: 'Just now',
      isRead: false,
      severity: velocity >= threshold * 1.5 ? 'critical' : 'warning',
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);
    setActiveNotification(newAlert);
    playAlertChime();

    setTimeout(() => {
      setActiveNotification((curr) => (curr?.id === newAlert.id ? null : curr));
    }, 6500);
  };

  useEffect(() => {
    if (!isMonitoring || trends.length === 0) return;

    const interval = setInterval(() => {
      let targetCandidates = trends;
      if (selectedTrendFilter !== 'all') {
        targetCandidates = trends.filter((t) => t.id === selectedTrendFilter);
      }
      if (targetCandidates.length === 0) return;

      const randomTrend = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
      const simulatedSurge = randomTrend.changePercent + (Math.random() * 22 - 6);

      if (simulatedSurge >= threshold) {
        const recentAlert = alertsRef.current.find(
          (a) => a.trendId === randomTrend.id && Date.now() - parseInt(a.id.split('-')[2] || '0') < 30000
        );
        if (!recentAlert) {
          triggerNewAlert(randomTrend, simulatedSurge);
        }
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isMonitoring, threshold, selectedTrendFilter, trends]);

  const handleSimulateSpike = () => {
    const candidate =
      selectedTrendFilter !== 'all'
        ? trends.find((t) => t.id === selectedTrendFilter) || trends[0]
        : trends[Math.floor(Math.random() * trends.length)];

    if (!candidate) return;
    const spikeVelocity = Math.max(threshold + 16.5, 74.8);
    triggerNewAlert(candidate, spikeVelocity);
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    if (activeNotification?.id === id) {
      setActiveNotification(null);
    }
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div id="velocity-alert-system-container" className="space-y-3">
      {/* Primary Alert Banner with Ambient Gradient and Radar Effect */}
      <div className="relative rounded-2xl border p-3.5 sm:p-4 shadow-xs transition-colors overflow-hidden" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
        {/* Ambient background gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/[0.05] via-transparent to-[#14B8A6]/[0.04] pointer-events-none" />
        {/* Subtle top edge gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF]/40 via-[#8E86FF]/60 to-[#14B8A6]/40" />

        <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: System Status with Live Radar Sweep */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C63FF]/20 to-[#14B8A6]/10 text-[#6C63FF] shrink-0 border border-[#6C63FF]/30 overflow-hidden shadow-xs">
              <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ background: 'var(--accent-glow)' }} />
              <Zap className="h-4.5 w-4.5 fill-[#6C63FF]/20 relative z-10" />

              {/* Animated Radar Sweep Cone */}
              {isMonitoring && !shouldReduceMotion && (
                <div className="absolute inset-0 animate-radar-sweep pointer-events-none">
                  <div className="h-1/2 w-1/2 bg-gradient-to-br from-[#6C63FF]/40 to-transparent origin-bottom-right" />
                </div>
              )}

              {/* Status Ping Dot */}
              {isMonitoring && (
                <span className="absolute top-1 right-1 flex h-2 w-2 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                  Real-Time Trend Alerts
                </h3>
                <span
                  className={`rounded-full px-2 py-0.2 text-[10px] font-semibold border transition-all ${
                    isMonitoring
                      ? 'bg-gradient-to-r from-[#14B8A6]/10 to-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/30'
                      : 'bg-[#707085]/10 text-[#707085] dark:text-[#9D9DAE] border-[#E4E4EE] dark:border-[#282838]'
                  }`}
                >
                  {isMonitoring ? 'Active' : 'Paused'}
                </span>
              </div>
              <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mt-0.5">
                Notify me whenever a topic starts growing faster than{' '}
                <strong className="text-[#6C63FF] font-semibold font-mono-numbers">+{threshold}%</strong>
                {selectedTrendFilter !== 'all' ? (
                  <>
                    {' '}for{' '}
                    <strong className="text-[#1C1C28] dark:text-[#EDEDF5]">
                      {trends.find((t) => t.id === selectedTrendFilter)?.name || 'selected trend'}
                    </strong>
                  </>
                ) : (
                  ' across all topics'
                )}
              </p>
            </div>
          </div>

          {/* Right: Presets, Dropdown Filter, and Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Threshold Presets with smooth gradient */}
            <div className="flex items-center rounded-xl p-0.5 border" style={{ background: 'var(--bg-app)', borderColor: 'var(--card-border)' }}>
              <span className="px-2 text-[10px] font-medium text-[#707085] dark:text-[#9D9DAE] hidden sm:inline">
                Limit:
              </span>
              {[30, 50, 75, 100].map((val) => (
                <motion.button
                  key={val}
                  type="button"
                  onClick={() => setThreshold(val)}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    threshold === val
                      ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs'
                      : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
                  }`}
                >
                  +{val}%
                </motion.button>
              ))}
            </div>

            {/* Target Trend Filter */}
            <div className="relative">
              <label htmlFor={thresholdSelectId} className="sr-only">Target Trend Filter</label>
              <select
                id={thresholdSelectId}
                value={selectedTrendFilter}
                onChange={(e) => setSelectedTrendFilter(e.target.value)}
                className="h-8 rounded-xl border px-2.5 text-xs font-medium text-[var(--text-body)] focus:outline-hidden focus:border-[#6C63FF] transition-all cursor-pointer max-w-[130px] sm:max-w-none truncate"
                style={{ background: 'var(--bg-app)', borderColor: 'var(--card-border)' }}
              >
                <option value="all">All Topics</option>
                {trends.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Simulate Spike Button with fiery gradient & pulse */}
            <motion.button
              type="button"
              id="btn-simulate-surge"
              onClick={handleSimulateSpike}
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="flex h-8 items-center gap-1.5 rounded-xl text-white px-3 text-xs font-semibold shadow-md shadow-[#6C63FF]/25 hover:shadow-[#6C63FF]/40 active:scale-95 transition-all cursor-pointer btn-primary-gradient"
              title="Simulate a viral engagement spike exceeding the threshold"
            >
              <Flame className="h-3.5 w-3.5 animate-pulse" />
              <span>Simulate Spike</span>
            </motion.button>

            {/* Fine-Tuning Slider Settings */}
            <motion.button
              type="button"
              id="btn-alert-settings"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isSettingsOpen
                  ? 'border-[#6C63FF] bg-[#6C63FF]/15 text-[#6C63FF]'
                  : 'border-[#E4E4EE] dark:border-[#282838] bg-[#FAFAFD] dark:bg-[#0E0E14] text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
              title="Tune threshold parameters"
            >
              <Sliders className="h-3.5 w-3.5" />
            </motion.button>

            {/* View All Alerts Drawer Button */}
            <motion.button
              type="button"
              id="btn-open-alert-drawer"
              onClick={() => setIsDrawerOpen(true)}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="relative flex h-8 items-center gap-1.5 rounded-xl border border-[#E4E4EE] dark:border-[#282838] bg-[#FAFAFD] dark:bg-[#0E0E14] px-2.5 text-xs font-medium text-[#1C1C28] dark:text-[#EDEDF5] hover:border-[#6C63FF] transition-all cursor-pointer"
              title="Open alert history drawer"
            >
              <Bell className="h-3.5 w-3.5 text-[#6C63FF]" />
              <span className="font-semibold font-mono-numbers">{alerts.length}</span>
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#F97362] to-[#F5B942] px-1 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Collapsible Fine-Tuning Slider Settings */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 overflow-hidden border-t border-[#E4E4EE] dark:border-[#282838] pt-3"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center text-xs">
                <div className="sm:col-span-2">
                  <div className="flex justify-between mb-1.5">
                    <label htmlFor={thresholdSliderId} className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">
                      Alert Trigger Speed:
                    </label>
                    <span className="font-mono-numbers font-bold text-[#6C63FF]">
                      +{threshold}% growth
                    </span>
                  </div>
                  <input
                    id={thresholdSliderId}
                    type="range"
                    min="15"
                    max="150"
                    step="5"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E4E4EE] dark:bg-[#282838] rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
                  />
                  <div className="flex justify-between text-[10px] text-[#707085] dark:text-[#9D9DAE] mt-1 font-mono-numbers">
                    <span>+15% (Early Notice)</span>
                    <span>+50% (Fast Growing)</span>
                    <span>+150% (Viral Breakout)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-medium transition-all cursor-pointer ${
                      soundEnabled
                        ? 'border-[#6C63FF] bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/20 text-[#6C63FF]'
                        : 'border-[#E4E4EE] dark:border-[#282838] text-[#707085] dark:text-[#9D9DAE]'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                    <span>{soundEnabled ? 'Chime On' : 'Muted'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMonitoring(!isMonitoring)}
                    className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-medium transition-all cursor-pointer ${
                      isMonitoring
                        ? 'border-[#14B8A6] bg-gradient-to-r from-[#14B8A6]/10 to-[#14B8A6]/20 text-[#14B8A6]'
                        : 'border-[#F97362] bg-gradient-to-r from-[#F97362]/10 to-[#F97362]/20 text-[#F97362]'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>{isMonitoring ? 'Monitoring' : 'Paused'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-time Alert Toast with Shimmer and Gradient */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative rounded-2xl border border-[#6C63FF]/40 p-3 shadow-xl overflow-hidden"
            style={{ background: 'var(--card-gradient)' }}
          >
            {/* Ambient left gradient stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#6C63FF] via-[#F97362] to-[#14B8A6]" />

            <div className="flex items-center justify-between gap-3 pl-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#F97362]/20 to-[#F5B942]/20 text-[#F97362] shrink-0 border border-[#F97362]/30 shadow-xs">
                  <Flame className="h-4.5 w-4.5 animate-pulse" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6C63FF]">
                      Velocity Spike
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-[#6C63FF]/15 to-[#F97362]/20 text-[#6C63FF] dark:text-[#8E86FF] border border-[#6C63FF]/30 px-2 py-0.2 text-[10px] font-bold font-mono-numbers">
                      +{activeNotification.currentVelocity}%
                    </span>
                    <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE]">
                      (Exceeded +{activeNotification.threshold}% limit)
                    </span>
                  </div>

                  <p className="text-xs text-[#1C1C28] dark:text-[#EDEDF5] mt-0.5">
                    <strong className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">
                      {activeNotification.trendName}
                    </strong>{' '}
                    is surging at {activeNotification.mentions.toLocaleString()} mentions/hr in{' '}
                    <span className="text-[#707085] dark:text-[#9D9DAE]">
                      {activeNotification.category}
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onNavigateToRadar && (
                  <motion.button
                    type="button"
                    onClick={() => {
                      onNavigateToRadar(activeNotification.trendId);
                      setActiveNotification(null);
                    }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white px-2.5 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </motion.button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveNotification(null)}
                  className="rounded-lg p-1.5 text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5] transition-colors cursor-pointer"
                  aria-label="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Drawer: Full History of Velocity Alerts */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E4E4EE] dark:border-[#282838] px-5 py-4 bg-gradient-to-r from-[#FAFAFD] to-[#FAFAFD]/60 dark:from-[#0E0E14] dark:to-[#0E0E14]/60">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C63FF]/20 to-[#14B8A6]/20 text-[#6C63FF] border border-[#6C63FF]/30">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                      Velocity Alerts Stream
                    </h2>
                    <p className="text-[11px] text-[#707085] dark:text-[#9D9DAE]">
                      Log of trends that crossed velocity threshold (+{threshold}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-[#6C63FF] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="rounded-lg p-1.5 text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5] hover:bg-[#E4E4EE]/50 dark:hover:bg-[#282838]/50 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Alert List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {alerts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#707085] dark:text-[#9D9DAE]">
                    No velocity thresholds breached yet. Active threshold is +{threshold}%.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-xl border p-3 text-xs transition-all ${
                        alert.isRead
                          ? 'border-[#E4E4EE] dark:border-[#282838] bg-[#FAFAFD]/60 dark:bg-[#0E0E14]/60'
                          : 'border-[#6C63FF]/30 bg-gradient-to-r from-[#6C63FF]/10 to-transparent shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[#1C1C28] dark:text-[#EDEDF5] text-sm">
                              {alert.trendName}
                            </span>
                            <span className="rounded-full bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/25 text-[#6C63FF] border border-[#6C63FF]/30 px-2 py-0.2 text-[10px] font-bold font-mono-numbers">
                              +{alert.currentVelocity}%
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.2 text-[10px] font-semibold border ${
                                alert.sentiment === 'positive'
                                  ? 'bg-gradient-to-r from-[#14B8A6]/10 to-[#14B8A6]/25 text-[#14B8A6] border-[#14B8A6]/30'
                                  : alert.sentiment === 'negative'
                                  ? 'bg-gradient-to-r from-[#F97362]/10 to-[#F97362]/25 text-[#F97362] border-[#F97362]/30'
                                  : 'bg-gradient-to-r from-[#F5B942]/10 to-[#F5B942]/25 text-[#F5B942] border-[#F5B942]/30'
                              }`}
                            >
                              {alert.sentimentScore}% {alert.sentiment}
                            </span>
                            <span className="text-[10px] text-[#707085] dark:text-[#9D9DAE]">
                              {alert.timestamp}
                            </span>
                          </div>

                          <p className="text-[#707085] dark:text-[#9D9DAE] text-[11px] leading-relaxed">
                            Category: <strong className="text-[#1C1C28] dark:text-[#EDEDF5]">{alert.category}</strong> •
                            Hourly Mentions:{' '}
                            <strong className="text-[#1C1C28] dark:text-[#EDEDF5] font-mono-numbers">
                              {alert.mentions.toLocaleString()}
                            </strong>{' '}
                            • Baseline was +{alert.previousVelocity}%
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {onNavigateToRadar && (
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateToRadar(alert.trendId);
                                setIsDrawerOpen(false);
                              }}
                              className="rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white px-2.5 py-1 text-xs font-semibold hover:brightness-110 transition-all cursor-pointer shadow-xs"
                            >
                              View Radar
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => dismissAlert(alert.id)}
                            className="p-1 text-[#707085] dark:text-[#9D9DAE] hover:text-[#F97362] transition-colors cursor-pointer"
                            title="Dismiss this alert"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[#E4E4EE] dark:border-[#282838] px-5 py-3 bg-[#FAFAFD] dark:bg-[#0E0E14] flex items-center justify-between text-xs text-[#707085] dark:text-[#9D9DAE]">
                <span>Retention: Last 20 notifications</span>
                <button
                  type="button"
                  onClick={() => setAlerts([])}
                  className="text-[#F97362] hover:underline cursor-pointer"
                >
                  Clear all alerts
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
