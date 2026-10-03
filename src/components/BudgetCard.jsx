import React from 'react';
import { Edit2, Trash2, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import BudgetProgress from './BudgetProgress';
import { CATEGORY_COLORS } from '../utils/constants';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { currency } = useSettings();

  const spent = budget.spent || 0;
  const amount = budget.amount || 0;
  const remaining = Math.max(0, amount - spent);
  const percentage = amount > 0 ? (spent / amount) * 100 : 0;
  const isExceeded = spent > amount;
  const isWarning = percentage >= 80 && !isExceeded;

  const categoryColor = CATEGORY_COLORS[budget.category] || '#10b981';

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        isExceeded
          ? 'border-rose-200 dark:border-rose-900/60 bg-gradient-to-b from-white to-rose-50/20 dark:from-slate-900 dark:to-rose-950/20'
          : isWarning
          ? 'border-amber-200 dark:border-amber-900/60 bg-gradient-to-b from-white to-amber-50/20 dark:from-slate-900 dark:to-amber-950/20'
          : 'border-slate-100 dark:border-slate-800'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: categoryColor }}
            />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {budget.category}
              </h3>
              <p className="text-xs text-slate-400">
                Month {budget.month}, {budget.year}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(budget)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Budget"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(budget)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Budget"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Alert Banner */}
        {isExceeded && (
          <div className="mb-4 flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>Over budget by {formatCurrency(spent - amount, currency)}</span>
          </div>
        )}

        {isWarning && (
          <div className="mb-4 flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>Approaching monthly budget threshold ({percentage.toFixed(1)}%)</span>
          </div>
        )}

        {!isExceeded && !isWarning && (
          <div className="mb-4 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>Healthy budget balance</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <BudgetProgress percentage={percentage} />
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <div>
          <span className="block text-slate-400 text-[11px] font-medium uppercase tracking-wider">
            Budget
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
            {formatCurrency(amount, currency)}
          </span>
        </div>
        <div>
          <span className="block text-slate-400 text-[11px] font-medium uppercase tracking-wider">
            Spent
          </span>
          <span
            className={`font-bold text-xs sm:text-sm ${
              isExceeded
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {formatCurrency(spent, currency)}
          </span>
        </div>
        <div>
          <span className="block text-slate-400 text-[11px] font-medium uppercase tracking-wider">
            Left
          </span>
          <span
            className={`font-bold text-xs sm:text-sm ${
              isExceeded
                ? 'text-rose-500'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isExceeded ? '$0.00' : formatCurrency(remaining, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
