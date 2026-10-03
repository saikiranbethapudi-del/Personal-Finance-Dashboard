import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';

// @desc    Get dashboard summary data
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Current month dates
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, now.getMonth(), 1);
    const endOfMonth = new Date(currentYear, now.getMonth() + 1, 0, 23, 59, 59, 999);

    // 1. Overall Income and Expenses Aggregation
    const overallAgg = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    overallAgg.forEach((item) => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpenses = item.total;
    });

    const totalBalance = Number((totalIncome - totalExpenses).toFixed(2));
    const totalSavings = totalBalance;

    // 2. Current Month Income and Expenses Aggregation
    const monthlyAgg = await Transaction.aggregate([
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
    monthlyAgg.forEach((item) => {
      if (item._id === 'income') monthlyIncome = item.total;
      if (item._id === 'expense') monthlyExpenses = item.total;
    });

    const monthlySavings = Number((monthlyIncome - monthlyExpenses).toFixed(2));

    // 3. Current Month Budgets
    const budgets = await Budget.find({
      user: userId,
      month: currentMonth,
      year: currentYear,
    });

    const monthlyBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const remainingBudget = Math.max(0, monthlyBudget - monthlyExpenses);

    // 4. Category-wise Expenses for current month
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
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const categoryExpenses = categoryAgg.map((item) => ({
      category: item._id,
      amount: Number(item.amount.toFixed(2)),
    }));

    // 5. Recent 5 Transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalBalance,
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        totalSavings,
        monthlyIncome: Number(monthlyIncome.toFixed(2)),
        monthlyExpenses: Number(monthlyExpenses.toFixed(2)),
        monthlySavings,
        monthlyBudget: Number(monthlyBudget.toFixed(2)),
        remainingBudget: Number(remainingBudget.toFixed(2)),
        recentTransactions,
        categoryExpenses,
      },
    });
  } catch (error) {
    next(error);
  }
};
