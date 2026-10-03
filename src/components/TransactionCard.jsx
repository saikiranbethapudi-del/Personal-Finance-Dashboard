import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';

const TransactionCard = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const { currency } = useSettings();
  const isIncome = transaction.type === 'income';

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isIncome
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {transaction.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {transaction.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                {transaction.paymentMethod || 'Cash'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-base font-bold ${
              isIncome
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-end gap-1 mt-0.5">
            <Calendar className="w-3 h-3" />
            {formatDate(transaction.date)}
          </div>
        </div>
      </div>

      {transaction.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
          {transaction.description}
        </p>
      )}

      {(onEdit || onDelete) && (
        <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit transaction"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction)}
              className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Delete transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
