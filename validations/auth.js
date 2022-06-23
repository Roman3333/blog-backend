import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 9 }),
  body('fullName').isLength({ min: 2 }),
  body('avatarUrl').optional().isURL(),
];
