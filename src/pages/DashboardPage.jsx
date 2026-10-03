import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowRight,
  Target,
  PieChart as PieIcon,
  RefreshCw,
} from 'lucide-react';
import { dashboardAPI, analyticsAPI, transactionsAPI } from '../api/api';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import DashboardCard from '../components/DashboardCard';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import BudgetProgress from '../components/BudgetProgress';
import IncomeExpenseChart from '../charts/IncomeExpenseChart';
import ExpenseCategoryChart from '../charts/ExpenseCategoryChart';
import SpendingTrendChart from '../charts/SpendingTrendChart';
import ErrorMessage from '../components/ErrorMessage';

const DashboardPage = () => {
  const { currency } = useSettings();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
    monthlyBudget: 0,
    remainingBudget: 0,
    recentTransactions: [],
    categoryExpenses: [],
  });

  const [analytics, setAnalytics] = useState({
    monthlyTrend: [],
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, analRes] = await Promise.all([
        dashboardAPI.getSummary(),
        analyticsAPI.getAnalytics(),
      ]);

      if (sumRes.data?.data) {
        setSummary(sumRes.data.data);
      }
      if (analRes.data?.data) {
        setAnalytics(analRes.data.data);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateTransaction = async (formData) => {
    setModalLoading(true);
    try {
      await transactionsAPI.create(formData);
      showSuccess('Transaction added successfully!');
      setModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      showError(err.message || 'Failed to create transaction');
    } finally {
      setModalLoading(false);
    }
  };

  const budgetPercentage =
    summary.monthlyBudget > 0
      ? (summary.monthlyExpenses / summary.monthlyBudget) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Financial Overview
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor balance, analyze spending habits, and control your monthly budget
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

      {/* 6 Key Financial Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DashboardCard
          title="Total Balance"
          amount={formatCurrency(summary.totalBalance, currency)}
          icon={Wallet}
          variant="default"
          subtitle="Net financial worth"
          loading={loading}
        />
        <DashboardCard
          title="Total Income"
          amount={formatCurrency(summary.totalIncome, currency)}
          icon={TrendingUp}
          variant="income"
          subtitle="All time income"
          loading={loading}
        />
        <DashboardCard
          title="Total Expenses"
          amount={formatCurrency(summary.totalExpenses, currency)}
          icon={TrendingDown}
          variant="expense"
          subtitle="All time spending"
          loading={loading}
        />
        <DashboardCard
          title="Total Savings"
          amount={formatCurrency(summary.totalSavings, currency)}
          icon={PiggyBank}
          variant="savings"
          subtitle="Retained capital"
          loading={loading}
        />
        <DashboardCard
          title="Monthly Budget"
          amount={formatCurrency(summary.monthlyBudget, currency)}
          icon={Target}
          variant="budget"
          subtitle="Allocated this month"
          loading={loading}
        />
        <DashboardCard
          title="Remaining Budget"
          amount={formatCurrency(summary.remainingBudget, currency)}
          icon={PieIcon}
          variant={summary.remainingBudget < 0 ? 'expense' : 'savings'}
          subtitle={
            summary.remainingBudget < 0
              ? 'Exceeded budget limit'
              : 'Available to spend'
          }
          loading={loading}
        />
      </div>

      {/* Monthly Budget Progress Card */}
      {summary.monthlyBudget > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Budget Health
              </h3>
              <p className="text-xs text-slate-400">
                Spent {formatCurrency(summary.monthlyExpenses, currency)} of{' '}
                {formatCurrency(summary.monthlyBudget, currency)}
              </p>
            </div>
            <button
              onClick={() => navigate('/budgets')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Budgets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <BudgetProgress percentage={budgetPercentage} size="lg" />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Income vs Expenses
              </h3>
              <p className="text-xs text-slate-400">Monthly breakdown over the year</p>
            </div>
          </div>
          <IncomeExpenseChart
            data={analytics.monthlyTrend}
            height={280}
          />
        </div>

        {/* Expense Category Breakdown Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Expense by Category
              </h3>
              <p className="text-xs text-slate-400">Where your money went this month</p>
            </div>
          </div>
          <ExpenseCategoryChart
            data={summary.categoryExpenses}
            height={280}
          />
        </div>
      </div>

      {/* Monthly Spending Trend Area Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Spending Trends
            </h3>
            <p className="text-xs text-slate-400">
              Trajectory of spending vs income over time
            </p>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Detailed Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <SpendingTrendChart
          data={analytics.monthlyTrend}
          height={260}
        />
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-400">
              Your latest financial activities
            </p>
          </div>
          <button
            onClick={() => navigate('/transactions')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All Transactions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TransactionTable
          transactions={summary.recentTransactions}
          onAddTransaction={() => setModalOpen(true)}
          loading={loading}
        />
      </div>

      {/* Quick Add Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTransaction}
        loading={modalLoading}
      />
    </div>
  );
};

export default DashboardPage;
