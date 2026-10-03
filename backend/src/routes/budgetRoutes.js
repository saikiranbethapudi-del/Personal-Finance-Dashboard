import express from 'express';
import { body } from 'express-validator';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

const budgetValidation = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('year')
    .optional()
    .isInt({ min: 2000 })
    .withMessage('Year must be 2000 or later'),
];

router.route('/').get(getBudgets).post(budgetValidation, createBudget);

router
  .route('/:id')
  .put(
    [
      body('amount')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
      body('month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be between 1 and 12'),
      body('year')
        .optional()
        .isInt({ min: 2000 })
        .withMessage('Year must be 2000 or later'),
    ],
    updateBudget
  )
  .delete(deleteBudget);

export default router;
