require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { 
  generalLimiter, 
  authLimiter, 
  adminLimiter, 
  securityHeaders, 
  mongoSanitizer, 
  xssProtection, 
  hppProtection, 
  corsOptions 
} = require('./middleware/security');
const { requestLogger, errorLogger } = require('./middleware/logging');
const { healthCheck, getMetrics, performanceMonitor, requestCounter } = require('./middleware/monitoring');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const walletRoutes = require('./routes/walletRoutes');
const depositRoutes = require('./routes/depositRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');

const app = express();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Connect to database
connectDB();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(mongoSanitizer);
app.use(xssProtection);
app.use(hppProtection);

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' })
  }));
} else {
  app.use(morgan('dev'));
}

// Request logging
app.use(requestLogger);

// Performance monitoring
app.use(performanceMonitor);

// Request counter
app.use(requestCounter);

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/admin', adminLimiter);
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// Health check endpoints
app.get('/api/health', healthCheck);
app.get('/api/metrics', getMetrics);

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
