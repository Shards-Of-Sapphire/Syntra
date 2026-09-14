import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-slate-200/70 dark:bg-slate-800 ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-slate-700/40 to-transparent animate-shimmer"
        style={{
          animationDuration: '1.8s',
          animationIterationCount: 'infinite',
        }}
      />
    </div>
  );
};

export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <Skeleton className="h-3.5 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
};

export const PanelSkeleton: React.FC<{ height?: string }> = ({ height = 'h-80' }) => {
  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 ${height} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-3 my-auto">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <Skeleton className="h-8 w-28" />
    </div>
  );
};
