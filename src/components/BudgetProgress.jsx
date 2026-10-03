import React from 'react';

const BudgetProgress = ({
  percentage = 0,
  showLabel = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const isExceeded = percentage > 100;
  const isWarning = percentage >= 80 && percentage <= 100;

  const colorClass = isExceeded
    ? 'bg-rose-500 dark:bg-rose-600'
    : isWarning
    ? 'bg-amber-500 dark:bg-amber-500'
    : 'bg-emerald-500 dark:bg-emerald-500';

  const trackColor = isExceeded
    ? 'bg-rose-100 dark:bg-rose-950/60'
    : isWarning
    ? 'bg-amber-100 dark:bg-amber-950/60'
    : 'bg-slate-100 dark:bg-slate-800';

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1">
          <span
            className={
              isExceeded
                ? 'text-rose-600 dark:text-rose-400'
                : isWarning
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-600 dark:text-slate-400'
            }
          >
            {isExceeded ? 'Budget Exceeded!' : isWarning ? 'Approaching Limit' : 'On Track'}
          </span>
          <span
            className={
              isExceeded
                ? 'text-rose-600 dark:text-rose-400 font-bold'
                : isWarning
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 font-bold'
            }
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden ${trackColor} ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`h-full transition-all duration-500 rounded-full ${colorClass}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetProgress;
