// Production Configuration
module.exports = {
  // Database Configuration
  database: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/aspire-trade-prod',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false
    }
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your_very_secure_jwt_secret_key_here',
    adminKey: process.env.ADMIN_KEY || 'your_very_secure_admin_key_here',
    bcryptRounds: 12,
    tokenExpiry: '7d',
    refreshTokenExpiry: '30d'
  },

  // CORS Configuration
  cors: {
    origin: [
      process.env.CLIENT_URL || 'https://aspiretrade.com',
      process.env.DASHBOARD_URL || 'https://admin.aspiretrade.com'
    ],
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    authWindowMs: 15 * 60 * 1000, // 15 minutes
    authMax: 5, // 5 auth attempts per window
    adminWindowMs: 15 * 60 * 1000, // 15 minutes
    adminMax: 50 // 50 admin requests per window
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    maxFiles: 5,
    maxSize: '5m',
    datePattern: 'YYYY-MM-DD'
  },

  // Performance Configuration
  performance: {
    compression: true,
    bodyParserLimit: process.env.BODY_PARSER_LIMIT || '10mb',
    slowRequestThreshold: 1000, // 1 second
    highMemoryThreshold: 50 * 1024 * 1024 // 50MB
  },

  // Monitoring Configuration
  monitoring: {
    healthCheck: process.env.HEALTH_CHECK_ENABLED !== 'false',
    metrics: process.env.METRICS_ENABLED !== 'false',
    requestLogging: true,
    errorLogging: true
  },

  // Security Headers
  securityHeaders: {
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
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }
};
