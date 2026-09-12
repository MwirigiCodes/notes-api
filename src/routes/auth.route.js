import express from 'express';

import { signup, login, logout } from '../controllers/auth.controller.js';
import {
  signupValidation,
  loginValidation,
  validator,
} from '../middleware/validations.js';

const router = express.Router();

router.post('/signup', signupValidation, validator, signup);
router.post('/login', loginValidation, validator, login);
router.post('/logout', logout);

export default router;
