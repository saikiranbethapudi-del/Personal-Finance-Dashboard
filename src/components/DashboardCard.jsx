import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardCard = ({
  title,
  amount,
  icon: Icon,
  subtitle,
  variant = 'default',
  trend,
  trendDirection = 'neutral', // 'up' | 'down' | 'neutral'
  loading = false,
  className = '',
}) => {
  const variantStyles = {
    default: {
      card: 'border-slate-100 dark:border-slate-800',
      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      amountColor: 'text-slate-900 dark:text-white',
    },
    income: {
      card: 'border-emerald-100 dark:border-emerald-950/50 bg-gradient-to-br from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/20',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
      amountColor: 'text-emerald-600 dark:text-emerald-400',
    },
    expense: {
      card: 'border-rose-100 dark:border-rose-950/50 bg-gradient-to-br from-white to-rose-50/20 dark:from-slate-900 dark:to-rose-950/20',
      iconBg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
      amountColor: 'text-rose-600 dark:text-rose-400',
    },
    savings: {
      card: 'border-blue-100 dark:border-blue-950/50 bg-gradient-to-br from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-950/20',
      iconBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
      amountColor: 'text-blue-600 dark:text-blue-400',
    },
    budget: {
      card: 'border-purple-100 dark:border-purple-950/50 bg-gradient-to-br from-white to-purple-50/20 dark:from-slate-900 dark:to-purple-950/20',
      iconBg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
      amountColor: 'text-purple-600 dark:text-purple-400',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${currentVariant.card} ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentVariant.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div>
        <div className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${currentVariant.amountColor}`}>
          {amount}
        </div>

        {(subtitle || trend) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {trend && (
              <span
                className={`inline-flex items-center font-semibold ${
                  trendDirection === 'up'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : trendDirection === 'down'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {trendDirection === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
                {trendDirection === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-slate-500 dark:text-slate-400">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
