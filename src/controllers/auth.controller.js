import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import { generateTokens } from '../lib/tokens.js';

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ email });

    if (exists) return res.status(400).json({ message: 'Invalid creditials' });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // gen access & refresh tokens
    generateTokens(res, user);

    res.status(201).json({ message: 'Signed up successfully' });
  } catch (error) {
    console.log('Error in signup controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid creditials' });

    // comapare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid creditials' });

    // gen access & refresh tokens
    generateTokens(res, user);

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    console.log('Error in login controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in signup controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
