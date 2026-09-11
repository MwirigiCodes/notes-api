import express from 'express';
import {
  signupValidation,
  loginValidation,
} from '../middleware/validations.js';
import validator from '../middleware/validations.js';

import { signup, login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signupValidation, validator, signup);
router.post('/login', loginValidation, validator, login);
router.post('/logout', logout);

export default router;
