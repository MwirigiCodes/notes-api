import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: (req, res) => {
    res
      .status(429)
      .json({ message: 'Too many requests. Please try again later.' });
  },
});

export default limiter;
