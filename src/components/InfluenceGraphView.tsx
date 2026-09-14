import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InfluenceGraph } from './InfluenceGraph';
import { InfluenceNode, InfluenceEdge } from '../types';
import { ShieldCheck } from 'lucide-react';

interface InfluenceGraphViewProps {
  nodes: InfluenceNode[];
  edges: InfluenceEdge[];
}

export const InfluenceGraphView: React.FC<InfluenceGraphViewProps> = ({ nodes, edges }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      id="influence-graph-page"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <InfluenceGraph nodes={nodes} edges={edges} />

      {/* Key Influencer Leaderboard */}
      <div className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h3 className="text-base font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">Top Brand Champions</h3>
            <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mt-0.5">
              Influential creators with loyal followings who actively support and share your brand
            </p>
          </div>
          <span className="text-xs text-[#6C63FF] dark:text-[#8E86FF] font-semibold bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/20 border border-[#6C63FF]/30 px-2.5 py-1 rounded-xl">
            7 Top Creators
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes
            .filter((n) => n.id !== 'n-core')
            .map((node) => (
              <motion.div
                key={node.id}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : { y: -3, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 25 } }
                }
                className="flex items-center gap-3 p-3 rounded-xl border hover:border-[#6C63FF]/40 shadow-xs hover:shadow-md transition-all cursor-pointer"
                style={{ background: 'color-mix(in srgb, var(--bg-app), transparent 40%)', borderColor: 'var(--border-subtle)' }}
              >
                <img
                  src={node.avatar}
                  alt={node.name}
                  className="h-10 w-10 rounded-full object-cover border border-[#E4E4EE] dark:border-[#282838] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-[#1C1C28] dark:text-[#EDEDF5] truncate">
                      {node.name}
                    </span>
                    {node.isKeyVoice && (
                      <ShieldCheck className="h-3.5 w-3.5 text-[#6C63FF] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE] block truncate">{node.handle}</span>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-[#707085] dark:text-[#9D9DAE] font-mono-numbers">{node.reach} followers</span>
                    <span className="font-semibold text-[#14B8A6] font-mono-numbers">{node.affinity}% positive</span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};
