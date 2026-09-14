import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
import {
  Sparkles,
  TrendingUp,
  Brain,
  Layers,
  Calendar,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  Sliders,
  Flame,
} from 'lucide-react';
import { ForecastPoint } from '../types';
import { useTheme } from '../context/ThemeContext';
import { GraphExplanation } from './GraphExplanation';

interface ForecastPanelProps {
  forecastData: ForecastPoint[];
}

interface DayExplanation {
  phase: string;
  badge: string;
  badgeType: 'indigo' | 'teal' | 'amber';
  headline: string;
  narrative: string;
  driver: string;
  recommendedAction: string;
}

const dayExplanations: Record<string, DayExplanation> = {
  'Sep 13': {
    phase: 'Where We Are Today',
    badge: 'Real Posts',
    badgeType: 'teal',
    headline: 'Current Starting Point: 148,290 Daily Posts',
    narrative:
      'This is the actual count of mentions recorded today. It serves as the solid ground truth anchor for the forecast. Conversation is steady, with healthy daily engagement coming from regular users and core fans.',
    driver: 'Everyday happy users sharing their experiences and asking questions.',
    recommendedAction: 'Check that new social channels are connecting smoothly and reply to early comments.',
  },
  'Sep 14': {
    phase: 'Word Spreading',
    badge: 'Early Wave',
    badgeType: 'indigo',
    headline: 'Newsletters & Weekly Roundups Pick Up the Story',
    narrative:
      'Daily posts are predicted to rise to 156,400 (+5.5%). People are reading weekend newsletters, email recaps, and community digest posts that mention your recent product updates.',
    driver: 'Newsletter links, forum shares on Reddit, and developers bookmarking guides.',
    recommendedAction: 'Retweet positive reviews from early readers and share quick video snippets.',
  },
  'Sep 15': {
    phase: 'Gaining Speed',
    badge: 'Fast Rise',
    badgeType: 'indigo',
    headline: 'Influencers & Creators Test Out the Features',
    narrative:
      'Conversation speeds up to 168,200 posts (+7.5%). This is the takeoff point: mid-sized tech creators and industry voices share their honest first impressions and screenshots.',
    driver: 'Short demo clips, Twitter threads from verified creators, and LinkedIn discussions.',
    recommendedAction: 'Reach out to top creators who posted, thank them, and offer help with any questions.',
  },
  'Sep 16': {
    phase: 'Peak Viral Day',
    badge: 'Biggest Surge',
    badgeType: 'teal',
    headline: 'Mainstream Tech News & Major Sites Cover You',
    narrative:
      'Expected to surge to 182,000 posts with 82% positive mood. Mainstream technology blogs and news websites publish articles, driving the biggest single-day traffic wave of the week.',
    driver: 'Mid-week peak: people spend the most time browsing and sharing social media on Tuesdays and Wednesdays.',
    recommendedAction: 'Publish your main behind-the-scenes blog post and host a live community Q&A.',
  },
  'Sep 17': {
    phase: 'Workplace Teams Join',
    badge: 'Business Wave',
    badgeType: 'indigo',
    headline: 'Managers & Companies Discuss Using Your Tool',
    narrative:
      'Conversation climbs to 194,500 posts. Discussions shift from individual tech fans to managers, software teams, and company decision-makers considering using your product for their work.',
    driver: 'LinkedIn thought-leadership posts, case studies, and team recommendation chats.',
    recommendedAction: 'Highlight customer testimonials, ease-of-use proofs, and reliability ratings.',
  },
  'Sep 18': {
    phase: 'Steady High Plateau',
    badge: 'High Volume',
    badgeType: 'amber',
    headline: 'Lots of People Using the Tool & Asking Questions',
    narrative:
      'Volume stays high at 206,000 posts. The shaded area widens [181k – 232k] because looking 5 days ahead naturally has more unknown factors. New users are trying the product and sharing tutorials.',
    driver: 'Community tutorials, user-created how-to guides, and troubleshooting tips.',
    recommendedAction: 'Post a helpful FAQ and make sure your support team is ready to answer questions quickly.',
  },
  'Sep 19': {
    phase: 'New High Baseline',
    badge: '7-Day Peak',
    badgeType: 'teal',
    headline: 'Peak at 219,800 Posts (+48% Higher Than Today)',
    narrative:
      'The 7-day wave peaks at an estimated 219,800 posts per day—nearly 50% higher than where we started. Audience mood remains happy at 84% positive, establishing a permanently higher audience for your brand.',
    driver: 'Word of mouth from thousands of new followers and international coverage.',
    recommendedAction: 'Review the week’s top-performing posts and refresh the forecast for the next 7 days.',
  },
};

export const ForecastPanel: React.FC<ForecastPanelProps> = ({ forecastData }) => {
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [scenario, setScenario] = useState<'base' | 'bullish' | 'conservative'>('base');
  const [selectedDayDate, setSelectedDayDate] = useState<string>('Sep 16');
  const [activeTab, setActiveTab] = useState<'drivers' | 'roadmap' | 'methodology'>('drivers');

  const adjustedData = forecastData.map((d) => {
    const mult = scenario === 'bullish' ? 1.15 : scenario === 'conservative' ? 0.88 : 1.0;
    return {
      ...d,
      predictedMentions: Math.round(d.predictedMentions * mult),
      upperConfidence: Math.round(d.upperConfidence * mult),
      lowerConfidence: Math.round(d.lowerConfidence * mult),
    };
  });

  const activeDay = dayExplanations[selectedDayDate] || dayExplanations['Sep 16'];
  const activePoint = adjustedData.find((d) => d.date === selectedDayDate) || adjustedData[3];

  const scenarioMeta = {
    base: {
      name: 'Expected Trend (Most Likely)',
      probability: '62% Chance',
      badgeClass: 'bg-[#6C63FF]/15 text-[#6C63FF] border-[#6C63FF]/30',
      summary:
        'What will likely happen if your current steady momentum, word-of-mouth, and regular posting schedule continue normally without unexpected interruptions.',
      drivers: 'Happy user recommendations, newsletter mentions, and regular community growth.',
      peakEstimate: '219,800 posts / day (+48% higher than today)',
      action: 'Stick to your planned posting calendar and keep engaging with commenters on social media.',
    },
    bullish: {
      name: 'High-Growth Surge (Best Case)',
      probability: '24% Chance',
      badgeClass: 'bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/30',
      summary:
        'What happens if a major tech news outlet features your product or a famous influencer shares a viral demo video that reaches a huge new audience.',
      drivers: 'Front-page press coverage, viral demo videos, and trending on X and Reddit simultaneously.',
      peakEstimate: '252,770 posts / day (+71% higher than today)',
      action: 'Make sure your servers can handle heavy website traffic and have team members ready to reply to inbounds.',
    },
    conservative: {
      name: 'Slower Growth (Cautious Case)',
      probability: '14% Chance',
      badgeClass: 'bg-[#F5B942]/15 text-[#F5B942] border-[#F5B942]/30',
      summary:
        'What happens if a busy news cycle distracts readers, weekend engagement dips more than usual, or people take longer to read your announcements.',
      drivers: 'Other big industry news taking the spotlight, or slower social activity over the weekend.',
      peakEstimate: '193,420 posts / day (+30% higher than today)',
      action: 'Share extra customer tips, run a quick poll or giveaway, and highlight your top product benefits.',
    },
  }[scenario];

  return (
    <motion.div
      id="forecast-page"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. MAIN FORECAST CHART & SCENARIO SELECTOR
      ───────────────────────────────────────────────────────────── */}
      <div
        className="group relative rounded-2xl border p-5 sm:p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40"
        style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div
          className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                7-Day AI Future Forecast
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#6C63FF]/15 to-[#8E86FF]/20 border border-[#6C63FF]/30 px-2 py-0.5 text-xs font-semibold text-[#6C63FF] dark:text-[#8E86FF]">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Smart AI Prediction
              </span>
            </div>
            <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mt-0.5">
              See where your mentions and audience engagement are heading over the next 7 days, with simple explanations for why
            </p>
          </div>

          {/* Scenario Selector */}
          <div
            className="flex items-center rounded-xl border p-0.5 text-xs"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'color-mix(in srgb, var(--bg-app), transparent 40%)',
            }}
          >
            <button
              type="button"
              id="forecast-scenario-conservative"
              onClick={() => setScenario('conservative')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer ${
                scenario === 'conservative'
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs font-semibold'
                  : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
              title="Cautious slower-growth estimate"
            >
              Cautious
            </button>
            <button
              type="button"
              id="forecast-scenario-base"
              onClick={() => setScenario('base')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer ${
                scenario === 'base'
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs font-semibold'
                  : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
              title="Most likely expected trend"
            >
              Most Likely
            </button>
            <button
              type="button"
              id="forecast-scenario-bullish"
              onClick={() => setScenario('bullish')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer ${
                scenario === 'bullish'
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs font-semibold'
                  : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5]'
              }`}
              title="Best case high-growth surge"
            >
              High Growth
            </button>
          </div>
        </div>

        {/* Forecast Chart with rich multi-stop gradient */}
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={adjustedData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              onClick={(e) => {
                if (e && e.activeLabel) {
                  setSelectedDayDate(e.activeLabel);
                }
              }}
            >
              <defs>
                <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C63FF" stopOpacity={isDark ? 0.42 : 0.26} />
                  <stop offset="60%" stopColor="#8E86FF" stopOpacity={isDark ? 0.18 : 0.1} />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#232332' : '#EEEDF5'}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: isDark ? '#282838' : '#E4E4EE' }}
                tick={{ fill: isDark ? '#9D9DAE' : '#707085', fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? '#9D9DAE' : '#707085', fontSize: 11 }}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload as ForecastPoint;
                  return (
                    <div
                      className="rounded-xl border p-3 shadow-xl backdrop-blur-md text-xs"
                      style={{
                        background: 'color-mix(in srgb, var(--bg-card), transparent 5%)',
                        borderColor: 'var(--card-border)',
                      }}
                    >
                      <p className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] mb-1">
                        {label} — Click to read explanation
                      </p>
                      <p className="text-[#707085] dark:text-[#9D9DAE]">
                        Expected Posts:{' '}
                        <strong className="text-[#6C63FF] font-mono-numbers">
                          {d.predictedMentions.toLocaleString()}
                        </strong>
                      </p>
                      <p className="text-[#707085] dark:text-[#9D9DAE] text-[11px] font-mono-numbers mt-0.5">
                        Expected Range: {d.lowerConfidence.toLocaleString()} to {d.upperConfidence.toLocaleString()}
                      </p>
                      <p className="text-[#14B8A6] text-[11px] font-mono-numbers mt-0.5">
                        Audience Mood: {d.predictedSentiment.toFixed(1)}% Positive
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="upperConfidence"
                stroke="transparent"
                fill="url(#forecastBand)"
                isAnimationActive={!shouldReduceMotion}
                animationDuration={900}
              />
              <Line
                type="monotone"
                dataKey="predictedMentions"
                stroke="#6C63FF"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{
                  r: 4,
                  fill: isDark ? '#16161F' : '#ffffff',
                  stroke: '#6C63FF',
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6, fill: '#6C63FF', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={!shouldReduceMotion}
                animationDuration={900}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ── Dynamic Scenario Interpretation Banner ── */}
        <div
          className="mt-4 rounded-xl border p-3.5 transition-all"
          style={{
            background: 'color-mix(in srgb, var(--bg-app), transparent 30%)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                Scenario: {scenarioMeta.name}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${scenarioMeta.badgeClass}`}
              >
                {scenarioMeta.probability}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#6C63FF] font-mono-numbers">
              Estimated Peak: {scenarioMeta.peakEstimate}
            </span>
          </div>
          <p className="text-xs text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
            {scenarioMeta.summary}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-[#707085] dark:text-[#9D9DAE]">
            <div>
              <strong className="text-[#1C1C28] dark:text-[#EDEDF5]">What causes this:</strong>{' '}
              {scenarioMeta.drivers}
            </div>
            <div>
              <strong className="text-[#1C1C28] dark:text-[#EDEDF5]">What to do:</strong>{' '}
              {scenarioMeta.action}
            </div>
          </div>
        </div>

        {/* Key Model Signals */}
        <div
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t pt-4 text-xs"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            className="rounded-xl bg-gradient-to-b from-[#FAFAFD] to-white dark:from-[#12142A] dark:to-[#1B1E3C] p-3 border transition-all"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <span className="text-[#707085] dark:text-[#9D9DAE] block font-medium text-[11px]">
              Expected Daily Peak
            </span>
            <span className="text-sm font-bold font-mono-numbers text-[#1C1C28] dark:text-[#EDEDF5] mt-0.5 block">
              {adjustedData[adjustedData.length - 1].predictedMentions.toLocaleString()} posts / day
            </span>
            <span className="text-[11px] text-[#14B8A6] font-semibold">
              +{Math.round(((adjustedData[adjustedData.length - 1].predictedMentions - adjustedData[0].predictedMentions) / adjustedData[0].predictedMentions) * 100)}% more conversation than today
            </span>
          </motion.div>

          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            className="rounded-xl bg-gradient-to-b from-[#FAFAFD] to-white dark:from-[#12142A] dark:to-[#1B1E3C] p-3 border transition-all"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <span className="text-[#707085] dark:text-[#9D9DAE] block font-medium text-[11px]">
              Prediction Accuracy
            </span>
            <span className="text-sm font-bold font-mono-numbers text-[#1C1C28] dark:text-[#EDEDF5] mt-0.5 block">
              95% High Confidence
            </span>
            <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE] font-medium">
              Learned from 14 million past social posts
            </span>
          </motion.div>

          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            className="rounded-xl bg-gradient-to-b from-[#FAFAFD] to-white dark:from-[#12142A] dark:to-[#1B1E3C] p-3 border transition-all"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <span className="text-[#707085] dark:text-[#9D9DAE] block font-medium text-[11px]">
              Audience Mood
            </span>
            <span className="text-sm font-bold font-mono-numbers text-[#6C63FF] mt-0.5 block">
              84% Happy & Supportive
            </span>
            <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE] font-medium">
              Very low risk of negative backlash
            </span>
          </motion.div>
        </div>

        {/* Footer info & guide */}
        <div
          className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-[#707085] dark:text-[#9D9DAE]"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <span className="text-[11px]">AI Future Forecaster • Updated 4 minutes ago</span>
          <GraphExplanation
            idPrefix="forecast-panel"
            title="Understanding the 7-Day Forecast Chart"
            summary="This forecast predicts how many people will talk about your brand over the next 7 days. It combines historical posting habits, day-of-the-week peaks, and recent audience happiness to give your team a clear look ahead."
            points={[
              {
                title: 'Dashed Line (Expected Posts)',
                description:
                  'The most likely number of posts per day. It accounts for regular weekly routines (like busy weekdays vs. quieter weekends).',
                badge: 'Expected Line',
                badgeType: 'indigo',
              },
              {
                title: 'Shaded Band (Expected Range)',
                description:
                  'The likely range of posts. Just like a weather forecast, looking 1 day ahead is very certain, while looking 7 days ahead has a wider range of possibilities.',
                badge: '95% Certainty Area',
                badgeType: 'info',
              },
              {
                title: '3 Growth Scenarios',
                description:
                  'Click between Most Likely, High Growth, and Cautious above to test what happens during a big press launch or a slow weekend.',
                badge: 'Easy Scenarios',
                badgeType: 'success',
              },
              {
                title: 'High Accuracy Score (95%)',
                description:
                  'Our model matches actual real-world posting patterns with 95% accuracy, giving you dependable numbers for planning.',
                badge: '95% Tested Fit',
                badgeType: 'warning',
              },
            ]}
            methodology="The AI studies your past 30 days of data, checks which days are usually busiest, looks at whether comments are mostly happy, and updates its forecast every 4 hours."
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EXPLANATORY NAVIGATION TABS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('drivers')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'drivers'
                ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs'
                : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5] hover:bg-[#6C63FF]/10'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Why Numbers Move (Key Drivers)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs'
                : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5] hover:bg-[#6C63FF]/10'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Day-by-Day Story (What to Expect)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('methodology')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'methodology'
                ? 'bg-gradient-to-r from-[#6C63FF] to-[#7D75FF] text-white shadow-xs'
                : 'text-[#707085] dark:text-[#9D9DAE] hover:text-[#1C1C28] dark:hover:text-[#EDEDF5] hover:bg-[#6C63FF]/10'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>How the AI Works (Simple Explanation)</span>
          </button>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-[#707085] dark:text-[#9D9DAE]">
          Plain English Insights
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB CONTENT 1: FACTOR ATTRIBUTION & NARRATIVE DRIVERS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'drivers' && (
        <motion.div
          key="tab-drivers"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
          className="space-y-6"
        >
          {/* Top Driver Breakdown Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Catalyst Attribution */}
            <div
              className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40"
              style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-[#6C63FF] animate-pulse" />
                <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                  What's Pushing Your Numbers Up
                </h3>
              </div>
              <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">
                The biggest real-world reasons why people are talking about your product this week
              </p>

              <div className="space-y-3.5">
                {[
                  {
                    title: 'New Product Announcements & Release Notes',
                    attribution: '+38.5% boost',
                    impact: 'Biggest Factor',
                    color: 'text-[#14B8A6]',
                    progress: 88,
                    desc: 'Your recent feature releases and speed improvements have excited developers. People are sharing screenshots and star ratings.',
                  },
                  {
                    title: 'Word-of-Mouth Spreading Across Platforms',
                    attribution: '+26.2% boost',
                    impact: 'Strong Factor',
                    color: 'text-[#6C63FF]',
                    progress: 68,
                    desc: 'Conversations that started on niche forums like Reddit are moving over to X and LinkedIn as everyday professionals discover your brand.',
                  },
                  {
                    title: 'Mid-Week Social Media Rush (Tue–Thu)',
                    attribution: '+19.4% boost',
                    impact: 'Weekly Habit',
                    color: 'text-[#8E86FF]',
                    progress: 52,
                    desc: 'People browse and share work tools twice as much in the middle of the week compared to Mondays and weekends.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-3.5 border transition-all hover:border-[#6C63FF]/30"
                    style={{
                      background: 'color-mix(in srgb, var(--bg-app), transparent 40%)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">
                        {item.title}
                      </span>
                      <span className={`text-xs font-bold font-mono-numbers ${item.color}`}>
                        {item.attribution}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#707085] dark:text-[#9D9DAE] leading-relaxed mb-2">
                      {item.desc}
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-[#E4E4EE] dark:bg-[#282838] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#14B8A6]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors & Dampeners */}
            <div
              className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40"
              style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-1">
                <Compass className="h-4 w-4 text-[#F5B942]" />
                <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                  Things That Could Slow Down Growth
                </h3>
              </div>
              <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">
                Natural slowdowns to watch out for so your team can keep excitement high
              </p>

              <div className="space-y-3.5">
                {[
                  {
                    title: 'News Getting Older (Audience Fatigue)',
                    attribution: '-8.8% drag',
                    level: 'Keep Fresh',
                    color: 'text-[#F97362]',
                    progress: 32,
                    desc: 'After 4 to 5 days, people want something new to talk about. Sharing customer stories or tips keeps the buzz going.',
                  },
                  {
                    title: 'Weekend Social Dip',
                    attribution: '-5.2% drag',
                    level: 'Normal Routine',
                    color: 'text-[#F5B942]',
                    progress: 22,
                    desc: 'People naturally spend less time talking about software tools on Saturdays and Sundays while relaxing with family.',
                  },
                  {
                    title: 'Customer Questions & Feedback',
                    attribution: '±4.5% swing',
                    level: 'Watch Closely',
                    color: 'text-[#707085] dark:text-[#9D9DAE]',
                    progress: 18,
                    desc: 'Your sentiment is very high (+84%), but helping users who have support questions keeps complaints from building up.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-3.5 border transition-all hover:border-[#6C63FF]/30"
                    style={{
                      background: 'color-mix(in srgb, var(--bg-app), transparent 40%)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">
                        {item.title}
                      </span>
                      <span className={`text-xs font-bold font-mono-numbers ${item.color}`}>
                        {item.attribution}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#707085] dark:text-[#9D9DAE] leading-relaxed mb-2">
                      {item.desc}
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-[#E4E4EE] dark:bg-[#282838] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#F5B942] to-[#F97362]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Executive Takeaways */}
          <div
            className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40"
            style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-[#6C63FF]" />
              <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                Recommended Next Steps for Your Team
              </h3>
            </div>
            <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mb-4">
              Simple, actionable tips based on what the forecast shows
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="rounded-xl border p-4 transition-all hover:border-[#6C63FF]/40"
                style={{
                  background: 'color-mix(in srgb, var(--bg-app), transparent 40%)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6C63FF]/15 text-[#6C63FF]">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#1C1C28] dark:text-[#EDEDF5]">
                    Best Time to Post
                  </span>
                </div>
                <p className="text-xs text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
                  Post your biggest updates on <strong>Tuesday or Wednesday morning (Sep 15–16)</strong> to catch the highest social traffic before the weekend slowdown.
                </p>
              </div>

              <div
                className="rounded-xl border p-4 transition-all hover:border-[#6C63FF]/40"
                style={{
                  background: 'color-mix(in srgb, var(--bg-app), transparent 40%)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14B8A6]/15 text-[#14B8A6]">
                    <Target className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#1C1C28] dark:text-[#EDEDF5]">
                    Support Readiness
                  </span>
                </div>
                <p className="text-xs text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
                  Have team members on standby on <strong>Thursday and Friday (Sep 17–18)</strong> to answer questions from new corporate teams checking out your product.
                </p>
              </div>

              <div
                className="rounded-xl border p-4 transition-all hover:border-[#6C63FF]/40"
                style={{
                  background: 'color-mix(in srgb, var(--bg-app), transparent 40%)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5B942]/15 text-[#F5B942]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#1C1C28] dark:text-[#EDEDF5]">
                    Mood Safety Line
                  </span>
                </div>
                <p className="text-xs text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
                  Keep an eye out if audience happiness drops <strong>below 76%</strong>. If it does, check user comments to see if a bug or confusing feature needs clarifying.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. TAB CONTENT 2: DAY-BY-DAY MILESTONE ROADMAP
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'roadmap' && (
        <motion.div
          key="tab-roadmap"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
          className="space-y-6"
        >
          {/* Day Selector Chips */}
          <div
            className="group relative rounded-2xl border p-5 sm:p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40"
            style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                  Day-by-Day Forecast Breakdown
                </h3>
                <p className="text-xs text-[#707085] dark:text-[#9D9DAE] mt-0.5">
                  Click on any date to read a plain English explanation of what is expected to happen
                </p>
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-[#6C63FF] bg-[#6C63FF]/10 px-2.5 py-1 rounded-xl">
                Click Any Day to Read
              </span>
            </div>

            {/* Date Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {adjustedData.map((d) => {
                const isSelected = d.date === selectedDayDate;
                const meta = dayExplanations[d.date];
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDayDate(d.date)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-[#6C63FF] bg-[#6C63FF]/10 ring-2 ring-[#6C63FF]/30'
                        : 'border-[#E4E4EE] dark:border-[#282838] hover:border-[#6C63FF]/40'
                    }`}
                    style={{
                      background: isSelected
                        ? undefined
                        : 'color-mix(in srgb, var(--bg-app), transparent 50%)',
                    }}
                  >
                    <span className="text-xs font-bold text-[#1C1C28] dark:text-[#EDEDF5]">
                      {d.date}
                    </span>
                    <span className="text-[11px] font-semibold text-[#6C63FF] font-mono-numbers mt-0.5">
                      {(d.predictedMentions / 1000).toFixed(0)}k posts
                    </span>
                    <span className="text-[10px] text-[#707085] dark:text-[#9D9DAE] truncate w-full mt-1">
                      {meta?.phase || 'Expected'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Day Inspection Card */}
            <div
              className="mt-5 rounded-xl border p-5 transition-all"
              style={{
                background: 'color-mix(in srgb, var(--bg-app), transparent 30%)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b mb-3.5" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#8E86FF] text-white font-bold text-xs shadow-xs">
                    {selectedDayDate.split(' ')[1]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                        {selectedDayDate}: {activeDay.headline}
                      </h4>
                      <span className="rounded-full bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30 px-2 py-0.5 text-[10px] font-semibold">
                        {activeDay.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#707085] dark:text-[#9D9DAE]">
                      Stage: {activeDay.phase}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono-numbers">
                  <div>
                    <span className="text-[#707085] dark:text-[#9D9DAE] block text-[10px]">Expected Posts</span>
                    <span className="text-sm font-bold text-[#6C63FF]">
                      {activePoint.predictedMentions.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#707085] dark:text-[#9D9DAE] block text-[10px]">Likely Range</span>
                    <span className="text-xs font-semibold text-[#1C1C28] dark:text-[#EDEDF5]">
                      {activePoint.lowerConfidence.toLocaleString()} – {activePoint.upperConfidence.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#707085] dark:text-[#9D9DAE] block text-[10px]">Audience Mood</span>
                    <span className="text-xs font-semibold text-[#14B8A6]">
                      {activePoint.predictedSentiment.toFixed(1)}% Positive
                    </span>
                  </div>
                </div>
              </div>

              {/* Day Narrative Explanation */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] block mb-1">
                    What will happen on this day:
                  </span>
                  <p className="text-xs text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
                    {activeDay.narrative}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div
                    className="rounded-lg p-3 border"
                    style={{
                      background: 'color-mix(in srgb, var(--bg-card), transparent 20%)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] block text-[11px] mb-1">
                      Main Driver:
                    </span>
                    <p className="text-[11px] text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
                      {activeDay.driver}
                    </p>
                  </div>

                  <div
                    className="rounded-lg p-3 border"
                    style={{
                      background: 'color-mix(in srgb, var(--bg-card), transparent 20%)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] block text-[11px] mb-1">
                      What your team should do:
                    </span>
                    <p className="text-[11px] text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
                      {activeDay.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. TAB CONTENT 3: BSTS METHODOLOGY & MODEL DIAGNOSTICS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'methodology' && (
        <motion.div
          key="tab-methodology"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Component 1 */}
            <div
              className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40"
              style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-[#6C63FF]" />
                <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                  How the AI Spots Patterns
                </h3>
              </div>
              <p className="text-xs text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
                The forecaster breaks down your social data into 3 simple pieces:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-[#707085] dark:text-[#9D9DAE]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                  <span><strong>Overall Growth Trend:</strong> Sees if interest is climbing, steady, or slowing down.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                  <span><strong>Day of the Week:</strong> Automatically learns that Tuesdays are busy and Sundays are calm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                  <span><strong>Audience Mood:</strong> Happy posts usually mean conversation will grow even faster.</span>
                </li>
              </ul>
            </div>

            {/* Component 2 */}
            <div
              className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40"
              style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-[#8E86FF]" />
                <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                  Why the Shaded Area Widens
                </h3>
              </div>
              <p className="text-xs text-[#707085] dark:text-[#9D9DAE] leading-relaxed">
                Just like a 7-day weather report, predictions get wider further in the future:
              </p>
              <div className="mt-3 space-y-2.5 text-xs text-[#707085] dark:text-[#9D9DAE]">
                <div className="rounded-lg p-2.5 border" style={{ borderColor: 'var(--border-subtle)', background: 'color-mix(in srgb, var(--bg-app), transparent 40%)' }}>
                  <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] block text-[11px]">Tomorrow is Very Certain:</span>
                  <p className="text-[11px] mt-0.5 leading-relaxed">
                    Short-term predictions have only a small ±4% margin of error because today's momentum carries directly into tomorrow.
                  </p>
                </div>
                <div className="rounded-lg p-2.5 border" style={{ borderColor: 'var(--border-subtle)', background: 'color-mix(in srgb, var(--bg-app), transparent 40%)' }}>
                  <span className="font-semibold text-[#1C1C28] dark:text-[#EDEDF5] block text-[11px]">Next Week Has More Surprises:</span>
                  <p className="text-[11px] mt-0.5 leading-relaxed">
                    By Day 7, unexpected real-world news or viral reposts could happen, so the model shows a wider ±13% safety band.
                  </p>
                </div>
              </div>
            </div>

            {/* Component 3: Diagnostics */}
            <div
              className="group relative rounded-2xl border p-6 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#6C63FF]/40"
              style={{ background: 'var(--card-gradient)', borderColor: 'var(--card-border)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#8E86FF] to-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="h-4 w-4 text-[#14B8A6]" />
                <h3 className="text-sm font-semibold font-display text-[#1C1C28] dark:text-[#EDEDF5]">
                  How Well It Works
                </h3>
              </div>
              <p className="text-xs text-[#707085] dark:text-[#9D9DAE] leading-relaxed mb-3">
                Simple scorecards showing how dependable these predictions are:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[#707085] dark:text-[#9D9DAE]">Accuracy Rating</span>
                  <span className="font-bold text-[#14B8A6] font-mono-numbers">95% (High Reliability)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[#707085] dark:text-[#9D9DAE]">Average Margin of Error</span>
                  <span className="font-bold text-[#6C63FF] font-mono-numbers">Just 3.8%</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[#707085] dark:text-[#9D9DAE]">Historical Data Studied</span>
                  <span className="font-bold text-[#1C1C28] dark:text-[#EDEDF5] font-mono-numbers">14 Million Posts</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-[#707085] dark:text-[#9D9DAE]">How Often It Updates</span>
                  <span className="font-bold text-[#6C63FF] font-mono-numbers">Every 4 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
