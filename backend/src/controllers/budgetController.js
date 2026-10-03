import { validationResult } from 'express-validator';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// @desc    Get user budgets with calculated spending and progress
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const month = parseInt(req.query.month, 10) || currentDate.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || currentDate.getFullYear();

    // Find all budgets for user in this month/year
    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    }).sort({ createdAt: -1 });

    // Calculate start and end date for that month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // Aggregate expenses for the user in this month grouped by category
    const expenseAgg = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $toLower: '$category' },
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const expenseMap = {};
    expenseAgg.forEach((item) => {
      expenseMap[item._id] = item.totalSpent;
    });

    const enrichedBudgets = budgets.map((budget) => {
      const budgetObj = budget.toObject();
      const spent = expenseMap[budget.category.toLowerCase()] || 0;
      const remaining = Math.max(0, budget.amount - spent);
      const percentageUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        ...budgetObj,
        spent: Number(spent.toFixed(2)),
        remaining: Number(remaining.toFixed(2)),
        percentageUsed: Number(percentageUsed.toFixed(1)),
        isExceeded: spent > budget.amount,
        isWarning: percentageUsed >= 80 && spent <= budget.amount,
      };
    });

    // Also calculate total monthly budget metrics
    const totalBudget = enrichedBudgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = enrichedBudgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = Math.max(0, totalBudget - totalSpent);

    res.status(200).json({
      success: true,
      data: {
        budgets: enrichedBudgets,
        month,
        year,
        summary: {
          totalBudget: Number(totalBudget.toFixed(2)),
          totalSpent: Number(totalSpent.toFixed(2)),
          totalRemaining: Number(totalRemaining.toFixed(2)),
          overallPercentage: totalBudget > 0 ? Number(((totalSpent / totalBudget) * 100).toFixed(1)) : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body. Request body cannot be empty.',
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((err) => err.msg).join(', '),
      });
    }

    const { category, amount, month, year } = req.body;
    const now = new Date();
    const budgetMonth = parseInt(month, 10) || now.getMonth() + 1;
    const budgetYear = parseInt(year, 10) || now.getFullYear();

    // Check for duplicate budget
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category: { $regex: new RegExp(`^${category.trim()}$`, 'i') },
      month: budgetMonth,
      year: budgetYear,
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: `A budget for category "${category}" already exists for ${budgetMonth}/${budgetYear}`,
      });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category: category.trim(),
      amount: Number(amount),
      month: budgetMonth,
      year: budgetYear,
    });

    if (!budget || !budget._id) {
      return res.status(500).json({
        success: false,
        message: 'Database save failed. Budget could not be saved to MongoDB.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Budget created successfully and saved to MongoDB',
      data: {
        budget,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body. Request body cannot be empty.',
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((err) => err.msg).join(', '),
      });
    }

    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found in database',
      });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this budget',
      });
    }

    const { category, amount, month, year } = req.body;

    // Check duplicate if category, month, or year is changing
    if (
      (category && category.trim().toLowerCase() !== budget.category.toLowerCase()) ||
      (month && Number(month) !== budget.month) ||
      (year && Number(year) !== budget.year)
    ) {
      const checkCat = category ? category.trim() : budget.category;
      const checkMonth = month ? Number(month) : budget.month;
      const checkYear = year ? Number(year) : budget.year;

      const duplicate = await Budget.findOne({
        _id: { $ne: budget._id },
        user: req.user._id,
        category: { $regex: new RegExp(`^${checkCat}$`, 'i') },
        month: checkMonth,
        year: checkYear,
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `A budget for category "${checkCat}" already exists for ${checkMonth}/${checkYear}`,
        });
      }
    }

    if (category !== undefined) budget.category = category.trim();
    if (amount !== undefined) budget.amount = Number(amount);
    if (month !== undefined) budget.month = Number(month);
    if (year !== undefined) budget.year = Number(year);

    const updatedBudget = await budget.save();

    if (!updatedBudget) {
      return res.status(500).json({
        success: false,
        message: 'Database save failed. Budget could not be updated in MongoDB.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully and saved to MongoDB',
      data: {
        budget: updatedBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found in database',
      });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this budget',
      });
    }

    await budget.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Budget removed successfully from MongoDB',
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    next(error);
  }
};
