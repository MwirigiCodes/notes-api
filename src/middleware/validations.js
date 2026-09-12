import { body, validationResult } from 'express-validator';

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

const requiredMessage = 'All fields are required';

export const signupValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage(requiredMessage)
    .isLength({ min: 2, max: 50 })
    .withMessage('First Name must be between 2 and 50 characters')
    .matches(nameRegex)
    .withMessage('First Name contains invalid characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage(requiredMessage)
    .isLength({ min: 2, max: 50 })
    .withMessage('Last Name must be between 2 and 50 characters')
    .matches(nameRegex)
    .withMessage('Last Name contains invalid characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage(requiredMessage)
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage(requiredMessage)
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Please provide a strong password'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(requiredMessage)
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage(requiredMessage)
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export const validator = (req, res, next) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: results.array().map((err) => err.msg),
    });
  }

  return next();
};

export default validator;
