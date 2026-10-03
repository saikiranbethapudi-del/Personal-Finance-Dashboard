import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import { CATEGORY_COLORS } from '../utils/constants';

const PALETTE = [
  '#f97316',
  '#6366f1',
  '#06b6d4',
  '#eab308',
  '#ec4899',
  '#ef4444',
  '#8b5cf6',
  '#10b981',
  '#3b82f6',
  '#14b8a6',
];

const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.payload.fill }}
          />
          <span className="font-bold text-slate-800 dark:text-slate-100">{data.name}</span>
        </div>
        <div className="text-slate-600 dark:text-slate-300 font-semibold">
          {formatCurrency(data.value, currency)}
        </div>
        {data.payload.percentage !== undefined && (
          <div className="text-slate-400 text-[11px] mt-0.5">
            {data.payload.percentage}% of total expenses
          </div>
        )}
      </div>
    );
  }
  return null;
};

const ExpenseCategoryChart = ({ data = [], height = 300, className = '' }) => {
  const { currency } = useSettings();

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No expense category data recorded yet.
      </div>
    );
  }

  // Normalize data for recharts Pie
  const chartData = data.map((item, index) => ({
    name: item.category || item.name || 'Other',
    value: item.amount !== undefined ? item.amount : item.value,
    percentage: item.percentage,
    fill: CATEGORY_COLORS[item.category] || PALETTE[index % PALETTE.length],
  }));

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseCategoryChart;
