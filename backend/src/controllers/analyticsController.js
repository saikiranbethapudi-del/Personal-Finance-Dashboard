import Transaction from '../models/Transaction.js';

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

// @desc    Get financial analytics data
// @route   GET /api/analytics
// @access  Private
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // 1. Monthly totals for the selected month/year
    const monthlySummaryAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    monthlySummaryAgg.forEach((item) => {
      if (item._id === 'income') monthlyIncome = item.total;
      if (item._id === 'expense') monthlyExpenses = item.total;
    });

    const monthlySavings = Number((monthlyIncome - monthlyExpenses).toFixed(2));

    // 2. Income vs Expense object/array
    const incomeVsExpense = [
      { name: 'Income', value: Number(monthlyIncome.toFixed(2)), color: '#10b981' },
      { name: 'Expenses', value: Number(monthlyExpenses.toFixed(2)), color: '#ef4444' },
    ];

    // 3. Category Breakdown for selected month (expenses)
    const categoryAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const totalCategoryExpense = categoryAgg.reduce((sum, item) => sum + item.amount, 0);

    const categoryBreakdown = categoryAgg.map((item) => ({
      category: item._id,
      amount: Number(item.amount.toFixed(2)),
      count: item.count,
      percentage: totalCategoryExpense > 0 ? Number(((item.amount / totalCategoryExpense) * 100).toFixed(1)) : 0,
    }));

    // 4. Monthly Trend for the selected year (all 12 months or rolling 6 months)
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const yearTrendAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Build complete 12 months array
    const monthlyTrend = [];
    for (let m = 1; m <= 12; m++) {
      const incItem = yearTrendAgg.find(
        (i) => i._id.month === m && i._id.type === 'income'
      );
      const expItem = yearTrendAgg.find(
        (i) => i._id.month === m && i._id.type === 'expense'
      );

      const incomeVal = incItem ? Number(incItem.total.toFixed(2)) : 0;
      const expenseVal = expItem ? Number(expItem.total.toFixed(2)) : 0;

      monthlyTrend.push({
        monthNumber: m,
        month: MONTH_NAMES[m - 1],
        shortMonth: MONTH_NAMES[m - 1].substring(0, 3),
        income: incomeVal,
        expense: expenseVal,
        savings: Number((incomeVal - expenseVal).toFixed(2)),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        monthlyIncome: Number(monthlyIncome.toFixed(2)),
        monthlyExpenses: Number(monthlyExpenses.toFixed(2)),
        monthlySavings,
        incomeVsExpense,
        categoryBreakdown,
        monthlyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};
