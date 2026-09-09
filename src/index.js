import express from 'express';
import 'dotenv/config';

import connectDB from './config/db.js';

const app = express();
const port = process.env.PORT || 3000;

// start the server after db is connected
try {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
} catch (error) {
  console.error(error.message);
}
