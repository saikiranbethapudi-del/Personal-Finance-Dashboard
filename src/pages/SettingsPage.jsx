import React from 'react';
import {
  DollarSign,
  Sun,
  Moon,
  Bell,
  Mail,
  AlertTriangle,
  FileText,
  Smartphone,
  Check,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { CURRENCIES } from '../utils/constants';

const SettingsPage = () => {
  const {
    currency,
    updateCurrency,
    theme,
    updateTheme,
    notifications,
    updateNotifications,
  } = useSettings();
  const { showSuccess } = useToast();

  const handleCurrencyChange = (e) => {
    updateCurrency(e.target.value);
    showSuccess(`Base currency updated to ${e.target.value}`);
  };

  const handleNotificationToggle = (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };
    updateNotifications(updated);
    showSuccess('Notification preferences saved');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your display currency, appearance theme, and notification preferences
        </p>
      </div>

      {/* Currency Preference Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Primary Currency
            </h3>
            <p className="text-xs text-slate-400">
              Select the currency used across dashboard cards, budgets, and reports
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CURRENCIES.map((c) => {
            const isSelected = currency === c.code;
            return (
              <button
                key={c.code}
                onClick={() => {
                  updateCurrency(c.code);
                  showSuccess(`Primary currency set to ${c.code}`);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-sm">{c.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-normal">
                    Symbol: {c.symbol}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Selection Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interface Theme
            </h3>
            <p className="text-xs text-slate-400">
              Choose between clean light mode or comfortable dark theme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Theme Option */}
          <button
            onClick={() => {
              updateTheme('light');
              showSuccess('Light theme activated');
            }}
            className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-50/40 text-slate-900 font-bold shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <Sun className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Light Mode</div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Crisp white and gray backgrounds for bright environments
              </p>
            </div>
            {theme === 'light' && (
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3" />
              </div>
            )}
          </button>

          {/* Dark Theme Option */}
          <button
            onClick={() => {
              updateTheme('dark');
              showSuccess('Dark theme activated');
            }}
            className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${
              theme === 'dark'
                ? 'border-emerald-500 bg-slate-800 text-white font-bold shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200">
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Dark Mode</div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Modern slate palette that reduces eye fatigue in low-light environments
              </p>
            </div>
            {theme === 'dark' && (
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-400">
              Control alerts and reminders for budgets, transactions, and monthly reports
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Alerts */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Email Notifications
                </p>
                <p className="text-xs text-slate-400">
                  Receive key account activity summaries via email
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('emailAlerts')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.emailAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.emailAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Budget Limit Alerts */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-amber-500 shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Budget Overrun Alerts
                </p>
                <p className="text-xs text-slate-400">
                  Get notified when spending reaches 80% or exceeds 100% of a category budget
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('budgetLimit')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.budgetLimit ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.budgetLimit ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Monthly Reports */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-blue-500 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Monthly Financial Summary Report
                </p>
                <p className="text-xs text-slate-400">
                  A monthly summary of total income, expenses, and savings rate
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('monthlyReports')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.monthlyReports ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.monthlyReports ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Transaction Push Alerts */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-500 shadow-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Transaction Activity Alerts
                </p>
                <p className="text-xs text-slate-400">
                  Instant confirmation whenever a new transaction is logged
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('transactionAlerts')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.transactionAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.transactionAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
