import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Sparkles, CheckCircle2, X } from 'lucide-react';

export interface ExplanationPoint {
  title: string;
  description: string;
  badge?: string;
  badgeType?: 'info' | 'success' | 'warning' | 'indigo';
}

interface GraphExplanationProps {
  title: string;
  summary: string;
  points: ExplanationPoint[];
  methodology?: string;
  idPrefix?: string;
}

export const GraphExplanation: React.FC<GraphExplanationProps> = ({
  title,
  summary,
  points,
  methodology,
  idPrefix = 'chart',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const getBadgeClass = (type?: 'info' | 'success' | 'warning' | 'indigo') => {
    switch (type) {
      case 'success':
        return 'bg-[#14B8A6]/10 text-[#14B8A6] border-[#14B8A6]/20';
      case 'warning':
        return 'bg-[#F5B942]/10 text-[#F5B942] border-[#F5B942]/20';
      case 'indigo':
        return 'bg-[#6C63FF]/15 text-[#6C63FF] border-[#6C63FF]/25';
      default:
        return 'bg-[#FAFAFD] dark:bg-[#0E0E14] text-[#707085] dark:text-[#9D9DAE] border-[#E4E4EE] dark:border-[#38384A]';
    }
  };

  return (
    <>
      {/* Unobtrusive, elegant inline guide trigger */}
      <button
        type="button"
        id={`btn-explain-${idPrefix}`}
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-[#707085] dark:text-[#9D9DAE] hover:text-[#6C63FF] dark:hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-colors cursor-pointer"
        title="See a simple explanation of how to read this chart"
      >
        <Info className="h-3.5 w-3.5 text-[#707085] dark:text-[#9D9DAE] group-hover:text-[#6C63FF] transition-colors" />
        <span>How to read</span>
      </button>

      {/* Elegant, clean modal dialog for deep-dive reading */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#0E0E14]/60 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border p-6 shadow-2xl"
              style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20">
                    <Info className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                      {title}
                    </h3>
                    <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE]">
                      Simple Guide • What this chart means & how to use it
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-1 text-[#707085] dark:text-[#9D9DAE] hover:bg-[#FAFAFD] dark:hover:bg-[#0E0E14] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5] transition-colors cursor-pointer"
                  title="Close guide"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Executive Summary */}
                <div className="rounded-xl p-3.5 border" style={{ background: 'color-mix(in srgb, var(--bg-app), transparent 40%)', borderColor: 'var(--border-subtle)' }}>
                  <p className="text-xs leading-relaxed text-[#1C1C28] dark:text-[#EDEDF5]">
                    {summary}
                  </p>
                </div>

                {/* Key Points Grid */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-xl border p-3 hover:border-[#6C63FF]/30 transition-colors"
                      style={{ background: 'var(--card-gradient)', borderColor: 'var(--border-subtle)' }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#6C63FF] shrink-0" />
                          <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] text-xs">
                            {pt.title}
                          </span>
                        </div>
                        {pt.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${getBadgeClass(
                              pt.badgeType
                            )}`}
                          >
                            {pt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#707085] dark:text-[#9D9DAE]">
                        {pt.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Methodology */}
                {methodology && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-[#6C63FF]/5 border border-[#6C63FF]/15 p-3 text-xs text-[#707085] dark:text-[#9D9DAE]">
                    <Sparkles className="h-4 w-4 text-[#6C63FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] block text-[11px]">
                        How this is calculated in plain English:
                      </span>
                      <p className="text-[11px] leading-relaxed mt-0.5">
                        {methodology}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-5 flex justify-end border-t border-[#E4E4EE] dark:border-[#38384A] pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-[#6C63FF] hover:bg-[#5B52EE] text-white px-4 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
