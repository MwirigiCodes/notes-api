import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import noteRoutes from './routes/note.route.js';

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// start the server after db is connected
try {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
} catch (error) {
  console.error(error.message);
}
