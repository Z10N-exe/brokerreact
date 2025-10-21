const os = require('os');
const fs = require('fs');
const path = require('path');

// System metrics collection
const getSystemMetrics = () => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    timestamp: new Date().toISOString(),
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      external: Math.round(memUsage.external / 1024 / 1024), // MB
    },
    cpu: {
      usage: process.cpuUsage(),
      loadAverage: os.loadavg(),
      uptime: process.uptime()
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024), // GB
      freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024), // GB
    }
  };
};

// Database health check
const checkDatabaseHealth = async () => {
  try {
    const mongoose = require('mongoose');
    const state = mongoose.connection.readyState;
    
    return {
      status: state === 1 ? 'connected' : 'disconnected',
      readyState: state,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
};

// Application health check
const healthCheck = async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Get system metrics
    const systemMetrics = getSystemMetrics();
    
    // Check database
    const dbHealth = await checkDatabaseHealth();
    
    // Check if logs directory exists and is writable
    const logsDir = path.join(__dirname, '../logs');
    let logsStatus = 'ok';
    try {
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      fs.accessSync(logsDir, fs.constants.W_OK);
    } catch (error) {
      logsStatus = 'error';
    }
    
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      logs: logsStatus,
      system: systemMetrics
    };
    
    // Determine overall health status
    if (dbHealth.status !== 'connected' || logsStatus === 'error') {
      health.status = 'unhealthy';
      res.status(503);
    }
    
    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

// Metrics endpoint
const getMetrics = async (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      system: getSystemMetrics(),
      database: await checkDatabaseHealth(),
      application: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get metrics',
      message: error.message
    });
  }
};

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const endMemory = process.memoryUsage();
    const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
    
    // Log slow requests
    if (duration > 1000) { // More than 1 second
      console.warn(`Slow request detected: ${req.method} ${req.url} took ${duration}ms`);
    }
    
    // Log high memory usage
    if (memoryDelta > 50 * 1024 * 1024) { // More than 50MB
      console.warn(`High memory usage detected: ${req.method} ${req.url} used ${Math.round(memoryDelta / 1024 / 1024)}MB`);
    }
  });
  
  next();
};

// Request counter
let requestCount = 0;
const requestCounter = (req, res, next) => {
  requestCount++;
  req.requestId = requestCount;
  next();
};

// Get request statistics
const getRequestStats = () => {
  return {
    totalRequests: requestCount,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  healthCheck,
  getMetrics,
  performanceMonitor,
  requestCounter,
  getRequestStats,
  getSystemMetrics,
  checkDatabaseHealth
};
