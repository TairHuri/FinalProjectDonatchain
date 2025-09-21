// src/utils/validators.ts
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// validate create NGO
export const validateCreateNgo = [
  body('name').isString().isLength({ min: 2 }).withMessage('name must be at least 2 chars'),
  body('description').optional().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

// validate update profile
export const validateUpdateProfile = [
  body('name').optional().isString().isLength({ min: 2 }),
  body('profile.avatarUrl').optional().isURL().withMessage('avatarUrl must be a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

// validate campaign creation (simple)
export const validateCreateCampaign = [
  body('title').isString().isLength({ min: 5 }),
  body('description').isString().isLength({ min: 10 }),
  body('targetAmount').isNumeric().withMessage('targetAmount must be numeric'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
