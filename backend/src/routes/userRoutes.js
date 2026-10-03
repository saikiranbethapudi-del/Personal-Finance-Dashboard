import express from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/profile')
  .get(getUserProfile)
  .put(
    [
      body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
      body('currency').optional().trim().notEmpty().withMessage('Currency cannot be empty'),
    ],
    updateUserProfile
  );

router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
  ],
  changePassword
);

export default router;
