import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';

// @desc    Get user transactions with filtering, search, pagination, and sorting
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      search,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Build query scoped strictly to authenticated user
    const query = { user: req.user._id };

    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { paymentMethod: searchRegex },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(total / limitNumber) || 1;

    res.status(200).json({
      success: true,
      data: {
        transactions,
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
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
        errors: errors.array(),
      });
    }

    const { title, amount, type, category, date, paymentMethod, description } =
      req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      title: title.trim(),
      amount: Number(amount),
      type,
      category: category.trim(),
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod ? paymentMethod.trim() : 'Cash',
      description: description ? description.trim() : '',
    });

    if (!transaction || !transaction._id) {
      return res.status(500).json({
        success: false,
        message: 'Database save failed. Transaction could not be saved to MongoDB.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully and saved to MongoDB',
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
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

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found in database',
      });
    }

    // Ensure transaction belongs to authenticated user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction',
      });
    }

    const { title, amount, type, category, date, paymentMethod, description } =
      req.body;

    if (title !== undefined) transaction.title = title.trim();
    if (amount !== undefined) transaction.amount = Number(amount);
    if (type !== undefined) transaction.type = type;
    if (category !== undefined) transaction.category = category.trim();
    if (date !== undefined) transaction.date = new Date(date);
    if (paymentMethod !== undefined) transaction.paymentMethod = paymentMethod.trim();
    if (description !== undefined) transaction.description = description.trim();

    const updatedTransaction = await transaction.save();

    if (!updatedTransaction) {
      return res.status(500).json({
        success: false,
        message: 'Database save failed. Transaction could not be updated in MongoDB.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully and saved to MongoDB',
      data: {
        transaction: updatedTransaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found in database',
      });
    }

    // Ensure transaction belongs to authenticated user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction',
      });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Transaction removed successfully from MongoDB',
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    next(error);
  }
};
