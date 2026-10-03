import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Target,
  TrendingDown,
  PieChart as PieIcon,
  Calendar,
  RefreshCw,
  X,
} from 'lucide-react';
import { budgetsAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import BudgetCard from '../components/BudgetCard';
import BudgetProgress from '../components/BudgetProgress';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorMessage from '../components/ErrorMessage';
import DashboardCard from '../components/DashboardCard';

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

const BudgetPage = () => {
  const { currency } = useSettings();
  const { showSuccess, showError } = useToast();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overallPercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetForm, setBudgetForm] = useState({
    category: EXPENSE_CATEGORIES[0],
    amount: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await budgetsAPI.getAll({
        month: selectedMonth,
        year: selectedYear,
      });

      if (res.data?.data) {
        setBudgets(res.data.data.budgets || []);
        if (res.data.data.summary) {
          setSummary(res.data.data.summary);
        }
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
      setError(err.message || 'Could not load budget data.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleOpenAddModal = () => {
    setEditingBudget(null);
    setBudgetForm({
      category: EXPENSE_CATEGORIES[0],
      amount: '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEditModal = (budget) => {
    setEditingBudget(budget);
    setBudgetForm({
      category: budget.category,
      amount: budget.amount,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!budgetForm.category) errs.category = 'Please select a category';
    if (!budgetForm.amount || Number(budgetForm.amount) <= 0) {
      errs.amount = 'Amount must be greater than 0';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalLoading(true);
    try {
      if (editingBudget) {
        await budgetsAPI.update(editingBudget._id, {
          category: budgetForm.category,
          amount: Number(budgetForm.amount),
          month: selectedMonth,
          year: selectedYear,
        });
        showSuccess('Budget updated successfully!');
      } else {
        await budgetsAPI.create({
          category: budgetForm.category,
          amount: Number(budgetForm.amount),
          month: selectedMonth,
          year: selectedYear,
        });
        showSuccess('Budget created successfully!');
      }
      setModalOpen(false);
      fetchBudgets();
    } catch (err) {
      showError(err.message || 'Failed to save budget');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenDelete = (budget) => {
    setBudgetToDelete(budget);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    setDeleteLoading(true);
    try {
      await budgetsAPI.delete(budgetToDelete._id);
      showSuccess('Budget removed successfully!');
      setDeleteDialogOpen(false);
      setBudgetToDelete(null);
      fetchBudgets();
    } catch (err) {
      showError(err.message || 'Failed to delete budget');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Monthly Budgets
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Set category limits, monitor spending thresholds, and avoid overspending
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month / Year Selectors */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none pr-1 py-1"
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
              className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none pr-2 py-1"
            >
              {[2024, 2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y} className="dark:bg-slate-900">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchBudgets}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Refresh budgets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchBudgets} />}

      {/* Month Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Allocated Budget"
          amount={formatCurrency(summary.totalBudget, currency)}
          icon={Target}
          variant="budget"
          subtitle={`For ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
          loading={loading}
        />
        <DashboardCard
          title="Total Spent So Far"
          amount={formatCurrency(summary.totalSpent, currency)}
          icon={TrendingDown}
          variant="expense"
          subtitle={`${summary.overallPercentage}% of total budget`}
          loading={loading}
        />
        <DashboardCard
          title="Remaining Balance"
          amount={formatCurrency(summary.totalRemaining, currency)}
          icon={PieIcon}
          variant={summary.totalRemaining <= 0 ? 'expense' : 'income'}
          subtitle={
            summary.totalRemaining <= 0
              ? 'Overall budget depleted'
              : 'Left for remainder of month'
          }
          loading={loading}
        />
      </div>

      {/* Overall Month Budget Progress Banner */}
      {summary.totalBudget > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Overall Monthly Limit Status
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {formatCurrency(summary.totalSpent, currency)} / {formatCurrency(summary.totalBudget, currency)}
            </span>
          </div>
          <BudgetProgress percentage={summary.overallPercentage} size="lg" />
        </div>
      )}

      {/* Category Budgets Grid */}
      {budgets.length === 0 && !loading ? (
        <EmptyState
          title={`No budgets set for ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
          description="Create your first category budget to keep your spending controlled."
          actionLabel="+ Create Budget"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => (
            <BudgetCard
              key={b._id}
              budget={b}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingBudget ? 'Edit Budget' : 'Create Monthly Budget'}
                </h3>
                <p className="text-xs text-slate-400">
                  {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Expense Category
                </label>
                <select
                  value={budgetForm.category}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Monthly Limit ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 500.00"
                  value={budgetForm.amount}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, amount: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    formErrors.amount
                      ? 'border-rose-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {formErrors.amount && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.amount}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={modalLoading}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Budget"
        message={`Are you sure you want to delete the budget for "${budgetToDelete?.category}"?`}
        confirmText="Delete"
        isDanger={true}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setBudgetToDelete(null);
        }}
      />
    </div>
  );
};

export default BudgetPage;
