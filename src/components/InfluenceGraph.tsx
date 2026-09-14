import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Share2, ShieldCheck, Zap } from 'lucide-react';
import { InfluenceNode, InfluenceEdge } from '../types';
import { GraphExplanation } from './GraphExplanation';

interface InfluenceGraphProps {
  nodes: InfluenceNode[];
  edges: InfluenceEdge[];
}

export const InfluenceGraph: React.FC<InfluenceGraphProps> = ({ nodes, edges }) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedNode, setSelectedNode] = useState<InfluenceNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<InfluenceNode | null>(null);

  const activeNode = hoveredNode || selectedNode;

  return (
    <motion.div
      id="panel-influence-graph"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
                Influence Graph
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/20 border border-[#6C63FF]/30 px-2 py-0.5 text-xs font-semibold text-[#6C63FF] dark:text-[#8E86FF]">
                <Share2 className="h-3 w-3 text-[#6C63FF] animate-pulse" />
                Community Map
              </span>
            </div>
            <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mt-0.5">
              See who is talking about your brand and how their followers spread the word
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAFAFD] dark:bg-[#0E0E14] px-2.5 py-1 font-mono-numbers text-[#707085] dark:text-[#9D9DAE] border border-[#E4E4EE] dark:border-[#282838]">
              <Zap className="h-3 w-3 text-[#6C63FF]" />
              {nodes.length} Influencers • {edges.length} Connections
            </span>
          </div>
        </div>

        {/* Network Constellation Canvas */}
        <div className="relative mt-3.5 h-64 w-full rounded-xl bg-gradient-to-b from-[#FAFAFD] to-[#F2F1F8] dark:from-[#0E0E14] dark:to-[#13131D] border border-[#E4E4EE] dark:border-[#282838] overflow-hidden select-none">
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#8E86FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="edgeActiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="50%" stopColor="#8E86FF" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>

            {/* Ambient Center Glow */}
            <circle cx="50" cy="50" r="36" fill="url(#coreGlow)" />

            {/* Edge Connecting Lines with animated data packets */}
            {edges.map((edge) => {
              const source = nodes.find((n) => n.id === edge.source);
              const target = nodes.find((n) => n.id === edge.target);
              if (!source || !target) return null;

              const isConnected =
                activeNode &&
                (activeNode.id === edge.source || activeNode.id === edge.target);

              return (
                <line
                  key={edge.id}
                  x1={`${source.x}%`}
                  y1={`${source.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={isConnected ? 'url(#edgeActiveGradient)' : '#707085'}
                  strokeWidth={isConnected ? edge.weight * 1.8 : edge.weight * 0.8}
                  strokeOpacity={isConnected ? 0.95 : 0.25}
                  strokeDasharray={isConnected ? '3 3' : '2 2'}
                  className={`transition-all duration-300 ${
                    isConnected && !shouldReduceMotion ? 'animate-stream-dash' : ''
                  }`}
                />
              );
            })}

            {/* Node Pins with Avatars */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isCore = node.id === 'n-core';
              const radius = isCore ? 6 : Math.max(3.5, Math.min(5.5, node.size * 0.45));

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-transform"
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Subtle Pulse ring for key voices */}
                  {node.isKeyVoice && !shouldReduceMotion && (
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={radius + 3.5}
                      fill="none"
                      stroke="#6C63FF"
                      strokeWidth="0.8"
                      opacity="0.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Core Node Ambient Halo */}
                  {isCore && !shouldReduceMotion && (
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={radius + 5}
                      fill="url(#coreGlow)"
                      className="animate-pulse-glow"
                    />
                  )}

                  {/* Outer Border Halo */}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={radius + 1.2}
                    fill={
                      isCore
                        ? '#6C63FF'
                        : isHovered || isSelected
                        ? '#5B52EE'
                        : '#9897AA'
                    }
                    opacity={isHovered || isSelected ? 0.95 : 0.4}
                  />

                  {/* Inner Node Base */}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={radius}
                    fill={isCore ? '#6C63FF' : '#16161F'}
                    stroke={isHovered || isSelected ? '#ffffff' : '#E4E4EE'}
                    strokeWidth="0.8"
                  />

                  {/* Tiny Label Text */}
                  <text
                    x={`${node.x}%`}
                    y={`${node.y + radius + 4.5}%`}
                    textAnchor="middle"
                    fill={isHovered || isSelected ? '#6C63FF' : '#707085'}
                    fontSize="3"
                    fontWeight={isHovered || isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none transition-colors"
                  >
                    {node.handle}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Node Detail Card Preview */}
          {activeNode ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 left-3 right-3 rounded-xl border border-[#6C63FF]/40 bg-white/95 dark:bg-[#16161F]/95 p-2.5 shadow-lg backdrop-blur-md flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeNode.avatar}
                  alt={activeNode.name}
                  className="h-8 w-8 rounded-full object-cover border border-[#6C63FF]/30 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] truncate">
                      {activeNode.name}
                    </span>
                    {activeNode.isKeyVoice && (
                      <ShieldCheck className="h-3.5 w-3.5 text-[#6C63FF] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE] block truncate">
                    {activeNode.handle} • {activeNode.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-3 shrink-0 text-right">
                <div>
                  <span className="text-[10px] text-[#707085] dark:text-[#9D9DAE] uppercase tracking-wide block">
                    Audience
                  </span>
                  <span className="font-bold text-[#1C1C28] dark:text-[#EDEDF5] text-xs font-mono-numbers">{activeNode.reach}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#707085] dark:text-[#9D9DAE] uppercase tracking-wide block">
                    Affinity
                  </span>
                  <span className="font-bold text-[#14B8A6] text-xs font-mono-numbers">
                    {activeNode.affinity}%
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="pointer-events-none absolute bottom-2 text-[10px] text-[#707085] dark:text-[#9D9DAE] tracking-wide">
              Click or hover any node to inspect amplifier resonance
            </div>
          )}
        </div>

        {/* Quick legend chips */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[#707085] dark:text-[#9D9DAE] text-[11px]">Central Hub: @SyntraAnalytics</span>
          <div className="flex items-center gap-3 text-[11px] text-[#707085] dark:text-[#9D9DAE]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#6C63FF] shadow-[0_0_6px_#6C63FF]" />
              Core Account
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full border border-[#707085] bg-white dark:bg-[#16161F]" />
              Amplifier
            </span>
          </div>
        </div>
      </div>

      {/* Footer & Guide Trigger */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#707085] dark:text-[#9D9DAE] pt-3 border-t border-[#E4E4EE] dark:border-[#282838]">
        <span className="font-mono-numbers text-[11px]">7 Top Influencers Connected</span>
        <div className="flex items-center gap-3">
          <span className="text-[#6C63FF] font-semibold text-[11px] hidden sm:inline">
            Reach Score: 94%
          </span>
          <GraphExplanation
            idPrefix="influence-graph"
            title="Understanding the Influencer Map"
            summary="This interactive map shows key creators and thought leaders talking about your brand, and how their posts spread your news to thousands of other people."
            points={[
              {
                title: 'The Big Circles (Key Voices)',
                description: 'Profiles with many connecting lines have the biggest reach. When they share your news, thousands of their followers see it.',
                badge: 'Top Creators',
                badgeType: 'indigo',
              },
              {
                title: 'Line Thickness (Bond Strength)',
                description: 'Thicker lines mean this person mentions, quotes, or replies to your account frequently.',
                badge: 'Strong Ties',
                badgeType: 'info',
              },
              {
                title: 'Verified Brand Champions',
                description: 'Creators with loyal followings who consistently speak positively about your product. These are your best partners.',
                badge: 'Brand Champion',
                badgeType: 'success',
              },
              {
                title: 'The Ripple Effect',
                description: 'When top creators post about you, their fans repost it too, spreading your news 4 times faster than posting on your own.',
                badge: '4x Spread',
                badgeType: 'warning',
              },
            ]}
            methodology="We track which accounts talk about you, measure how many people share their posts, and show you who your most effective advocates are."
          />
        </div>
      </div>
    </motion.div>
  );
};
