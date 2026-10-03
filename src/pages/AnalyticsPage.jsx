import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calendar,
  RefreshCw,
  PieChart as PieIcon,
  BarChart2,
  Activity,
} from 'lucide-react';
import { analyticsAPI } from '../api/api';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import DashboardCard from '../components/DashboardCard';
import IncomeExpenseChart from '../charts/IncomeExpenseChart';
import ExpenseCategoryChart from '../charts/ExpenseCategoryChart';
import SpendingTrendChart from '../charts/SpendingTrendChart';
import ErrorMessage from '../components/ErrorMessage';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const AnalyticsPage = () => {
  const { currency } = useSettings();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [data, setData] = useState({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
    incomeVsExpense: [],
    categoryBreakdown: [],
    monthlyTrend: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsAPI.getAnalytics({
        month: selectedMonth,
        year: selectedYear,
      });

      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err.message || 'Could not fetch analytics data.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const savingsRate =
    data.monthlyIncome > 0
      ? ((data.monthlySavings / data.monthlyIncome) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header with Month/Year Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Financial Analytics
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deep dive into your cash flows, category spending habits, and annual trends
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <Calendar className="w-4 h-4 text-slate-400 ml-1.5" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none pr-1"
            >
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx + 1} className="dark:bg-slate-900">
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none pr-2"
            >
              {[2024, 2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y} className="dark:bg-slate-900">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAnalytics} />}

      {/* Key Monthly Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Monthly Income"
          amount={formatCurrency(data.monthlyIncome, currency)}
          icon={TrendingUp}
          variant="income"
          subtitle={`${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
          loading={loading}
        />
        <DashboardCard
          title="Monthly Expenses"
          amount={formatCurrency(data.monthlyExpenses, currency)}
          icon={TrendingDown}
          variant="expense"
          subtitle={`${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
          loading={loading}
        />
        <DashboardCard
          title="Monthly Net Savings"
          amount={formatCurrency(data.monthlySavings, currency)}
          icon={PiggyBank}
          variant={data.monthlySavings < 0 ? 'expense' : 'savings'}
          subtitle={
            data.monthlySavings < 0
              ? 'Negative cash flow'
              : 'Surplus saved'
          }
          loading={loading}
        />
        <DashboardCard
          title="Savings Rate"
          amount={`${savingsRate}%`}
          icon={Activity}
          variant="default"
          subtitle="Proportion of income saved"
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Annual Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Comparison ({selectedYear})
                </h3>
                <p className="text-xs text-slate-400">Income vs. Expense across all months</p>
              </div>
            </div>
          </div>
          <IncomeExpenseChart data={data.monthlyTrend} height={300} />
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Expenses by Category ({MONTH_NAMES[selectedMonth - 1]})
                </h3>
                <p className="text-xs text-slate-400">Distribution of expenditures</p>
              </div>
            </div>
          </div>
          <ExpenseCategoryChart data={data.categoryBreakdown} height={300} />
        </div>
      </div>

      {/* Annual Cashflow Trend Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Full Year Spending & Income Trajectory ({selectedYear})
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing cumulative trends and cashflow peaks
              </p>
            </div>
          </div>
        </div>
        <SpendingTrendChart data={data.monthlyTrend} height={320} />
      </div>

      {/* Category Breakdown Breakdown Table */}
      {data.categoryBreakdown && data.categoryBreakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Category Spending Details ({MONTH_NAMES[selectedMonth - 1]} {selectedYear})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Transactions</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.categoryBreakdown.map((item) => (
                  <tr key={item.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500">
                      {item.count}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.amount, currency)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
