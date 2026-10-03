import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Budget must belong to a user'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide a budget amount'],
      min: [0.01, 'Budget amount must be greater than 0'],
    },
    month: {
      type: Number,
      required: [true, 'Please specify the month (1-12)'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Please specify the year'],
      min: [2000, 'Year must be 2000 or later'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate budgets for the same user + category + month + year
budgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

budgetSchema.index({ user: 1, month: 1, year: 1 });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
