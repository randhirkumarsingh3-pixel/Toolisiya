import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// Rate limiter for login attempts
// Limits to 5 attempts per 15 minutes per IP address
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: { error: 'Too many login attempts, please try again later' },
  statusCode: 429,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
  keyGenerator: ipKeyGenerator,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts. Please try again later.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// Rate limiter for general API endpoints
// Limits to 100 requests per 15 minutes per IP address
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  statusCode: 429,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
  keyGenerator: ipKeyGenerator,
});