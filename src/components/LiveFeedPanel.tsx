import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Heart,
  Repeat2,
  CheckCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import { SocialPost } from '../types';

interface LiveFeedPanelProps {
  posts: SocialPost[];
  isLoading?: boolean;
}

export const LiveFeedPanel: React.FC<LiveFeedPanelProps> = ({ posts }) => {
  const shouldReduceMotion = useReducedMotion();
  const [filterPlatform] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const filteredPosts = posts.filter((post) => {
    const matchesPlatform = filterPlatform === 'all' || post.platform === filterPlatform;
    const matchesSentiment = filterSentiment === 'all' || post.sentiment === filterSentiment;
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.handle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSentiment && matchesSearch;
  });

  return (
    <motion.div
      id="live-feed-page"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Feed Control Bar with ambient gradient */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 shadow-xs overflow-hidden" style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/[0.05] via-transparent to-[#14B8A6]/[0.04] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isLiveStreaming && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C63FF] opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isLiveStreaming ? 'bg-[#6C63FF] shadow-[0_0_8px_#6C63FF]' : 'bg-[#707085]'
                }`}
              />
            </span>
            <span className="text-sm font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">Live Post Stream</span>
          </div>
          <button
            type="button"
            id="toggle-live-streaming"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer ${
              isLiveStreaming
                ? 'border-[#14B8A6]/40 bg-gradient-to-r from-[#14B8A6]/10 to-[#14B8A6]/20 text-[#14B8A6]'
                : 'border-[#E4E4EE] dark:border-[#282838] text-[#707085] dark:text-[#9D9DAE]'
            }`}
            style={!isLiveStreaming ? { background: 'color-mix(in srgb, var(--bg-app), transparent 40%)' } : undefined}
          >
            {isLiveStreaming ? 'Streaming: ON' : 'Paused'}
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 text-xs">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#707085] dark:text-[#9D9DAE]" />
            <input
              type="text"
              id="input-feed-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts or handles..."
              className="h-8 w-44 rounded-xl border pl-8 pr-2.5 text-xs text-[#1C1C28] dark:text-[#EDEDF5] placeholder-[#707085] dark:placeholder-[#9D9DAE] focus:border-[#6C63FF] focus:outline-hidden focus:shadow-xs transition-all"
              style={{ background: 'color-mix(in srgb, var(--bg-app), transparent 40%)', borderColor: 'var(--border-subtle)' }}
            />
          </div>

          {/* Sentiment Filter */}
          <select
            id="select-feed-sentiment"
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className="h-8 rounded-xl border px-2.5 text-xs font-medium text-[#1C1C28] dark:text-[#EDEDF5] focus:border-[#6C63FF] focus:outline-hidden cursor-pointer"
            style={{ background: 'color-mix(in srgb, var(--bg-app), transparent 40%)', borderColor: 'var(--border-subtle)' }}
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive Only</option>
            <option value="neutral">Neutral Only</option>
            <option value="negative">Negative Only</option>
          </select>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={
              shouldReduceMotion
                ? {}
                : { y: -3, scale: 1.008, transition: { type: 'spring', stiffness: 400, damping: 25 } }
            }
            className="group relative rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40 dark:hover:border-[#6C63FF]/50 overflow-hidden"
            style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
          >
            {/* Top subtle gradient line on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="h-10 w-10 rounded-full object-cover border border-[#E4E4EE] dark:border-[#282838]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#1C1C28] dark:text-[#EDEDF5]">{post.author}</span>
                    {post.verified && (
                      <CheckCircle className="h-3.5 w-3.5 text-[#6C63FF] shrink-0" />
                    )}
                    <span className="text-xs text-[#707085] dark:text-[#9D9DAE]">{post.handle}</span>
                    <span className="text-xs text-[#E4E4EE] dark:text-[#282838]">•</span>
                    <span className="text-xs text-[#707085] dark:text-[#9D9DAE]">{post.timestamp}</span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-[#1C1C28] dark:text-[#EDEDF5] max-w-2xl">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Sentiment Pill with gradient */}
              <div className="shrink-0 text-right">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                    post.sentiment === 'positive'
                      ? 'bg-gradient-to-r from-[#14B8A6]/10 to-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/30'
                      : post.sentiment === 'negative'
                      ? 'bg-gradient-to-r from-[#F97362]/10 to-[#F97362]/20 text-[#F97362] border-[#F97362]/30'
                      : 'bg-gradient-to-r from-[#F5B942]/10 to-[#F5B942]/20 text-[#F5B942] border-[#F5B942]/30'
                  }`}
                >
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  {post.sentimentScore}% {post.sentiment}
                </span>
              </div>
            </div>

            {/* Post Metrics Footer */}
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-[#707085] dark:text-[#9D9DAE]" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5 font-mono-numbers hover:text-[#1C1C28] dark:hover:text-[#EDEDF5] transition-colors">
                  <Heart className="h-3.5 w-3.5 hover:text-[#F97362] transition-colors" />
                  {post.likes.toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5 font-mono-numbers hover:text-[#1C1C28] dark:hover:text-[#EDEDF5] transition-colors">
                  <Repeat2 className="h-3.5 w-3.5 hover:text-[#6C63FF] transition-colors" />
                  {post.reposts.toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5 text-[#6C63FF] font-semibold font-mono-numbers">
                  Engagement: {post.engagementScore}/10
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#707085] dark:text-[#9D9DAE] font-semibold">
                {post.platform}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
