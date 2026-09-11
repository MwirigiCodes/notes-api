import { body, validationResult } from 'express-validator';

export const signupValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('All fields are required')
    .isAlpha()
    .withMessage('First Name contains invalid characters')
    .escape(),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('All fields are required')
    .isAlpha()
    .withMessage('Last Name contains invalid characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('All fields are required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('All fields are required')
    .isStrongPassword()
    .withMessage('Please provide a strong password')
    .escape(),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('All fields are required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('All fields are required')
    .escape(),
];

const validator = (req, res, next) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    res.status(400).json({ message: results.errors.map((err) => err.msg) });
  }

  next();
};

export default validator;
