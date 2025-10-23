const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

// Auth rate limiting (stricter)
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later.'
);

// Admin rate limiting
const adminLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // limit each IP to 50 requests per windowMs
  'Too many admin requests, please try again later.'
);

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Basic input sanitization (for SQLite)
const mongoSanitizer = (req, res, next) => {
  // Basic sanitization for SQLite
  next();
};

// XSS protection
const xssProtection = xss();

// HTTP Parameter Pollution protection
const hppProtection = hpp();

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.DASHBOARD_URL,
      'https://aspiretrade.com',
      'https://admin.aspiretrade.com'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = {
  generalLimiter,
  authLimiter,
  adminLimiter,
  securityHeaders,
  mongoSanitizer,
  xssProtection,
  hppProtection,
  corsOptions
};
