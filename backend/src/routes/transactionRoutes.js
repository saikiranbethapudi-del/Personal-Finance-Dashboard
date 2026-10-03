import express from 'express';
import { body } from 'express-validator';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All transaction routes are protected
router.use(protect);

const transactionValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either "income" or "expense"'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid ISO date (YYYY-MM-DD)'),
];

router
  .route('/')
  .get(getTransactions)
  .post(transactionValidation, createTransaction);

router
  .route('/:id')
  .put(
    [
      body('amount')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
      body('type')
        .optional()
        .isIn(['income', 'expense'])
        .withMessage('Type must be either "income" or "expense"'),
      body('date')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid ISO date (YYYY-MM-DD)'),
    ],
    updateTransaction
  )
  .delete(deleteTransaction);

export default router;
