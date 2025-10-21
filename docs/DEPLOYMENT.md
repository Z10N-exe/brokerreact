# Aspire Secure Trade - Deployment Guide

## Production Deployment Checklist

### 1. Database Setup

#### MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Configure network access (whitelist your server IPs)
4. Create a database user
5. Get the connection string

#### Local MongoDB
```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### 2. Backend Deployment

#### Option A: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create aspire-trade-backend

# Set environment variables
heroku config:set PORT=5000
heroku config:set DB_URI=mongodb+srv://username:password@cluster.mongodb.net/aspire-trade
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set ADMIN_KEY=your_production_admin_key
heroku config:set CLIENT_URL=https://your-frontend-domain.com
heroku config:set DASHBOARD_URL=https://your-dashboard-domain.com

# Deploy
git push heroku main
```

#### Option B: DigitalOcean App Platform
1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy automatically on push

#### Option C: AWS EC2
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup
git clone <your-repo>
cd aspire-trade-new/backend
npm install --production

# Set environment variables
export PORT=5000
export DB_URI=mongodb+srv://...
export JWT_SECRET=your_production_jwt_secret
export ADMIN_KEY=your_production_admin_key
export CLIENT_URL=https://your-frontend-domain.com
export DASHBOARD_URL=https://your-dashboard-domain.com

# Start with PM2
pm2 start server.js --name "aspire-backend"
pm2 save
pm2 startup
```

### 3. Frontend Deployment

#### Option A: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-backend-domain.com
```

#### Option B: Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables in Netlify dashboard

#### Option C: AWS S3 + CloudFront
```bash
# Build the frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Configure CloudFront distribution
```

### 4. Dashboard Deployment

#### Option A: Vercel (Separate Project)
```bash
cd dashboard
vercel

# Set environment variables
VITE_API_URL=https://your-backend-domain.com
VITE_ADMIN_KEY=your_production_admin_key
```

#### Option B: Subdomain
Deploy to a subdomain like `admin.yourdomain.com`

### 5. Domain Configuration

#### DNS Setup
```
yourdomain.com          → Frontend (Vercel/Netlify)
admin.yourdomain.com    → Dashboard (Vercel/Netlify)
api.yourdomain.com      → Backend (Heroku/DigitalOcean)
```

#### SSL Certificates
- Vercel/Netlify: Automatic SSL
- Heroku: Automatic SSL
- Custom domains: Use Let's Encrypt or CloudFlare

### 6. Environment Variables

#### Backend (.env)
```env
PORT=5000
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/aspire-trade
JWT_SECRET=your_very_secure_jwt_secret_here
ADMIN_KEY=your_very_secure_admin_key_here
CLIENT_URL=https://yourdomain.com
DASHBOARD_URL=https://admin.yourdomain.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com
```

#### Dashboard (.env)
```env
VITE_API_URL=https://api.yourdomain.com
VITE_ADMIN_KEY=your_very_secure_admin_key_here
```

### 7. Security Checklist

- [ ] Change all default passwords and keys
- [ ] Use strong, unique JWT secrets
- [ ] Configure CORS for production domains only
- [ ] Enable HTTPS for all services
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets

### 8. Monitoring and Maintenance

#### Health Checks
```bash
# Backend health check
curl https://api.yourdomain.com/api/health

# Frontend
curl https://yourdomain.com

# Dashboard
curl https://admin.yourdomain.com
```

#### Logs
```bash
# Heroku logs
heroku logs --tail

# PM2 logs
pm2 logs aspire-backend

# MongoDB logs
# Check your MongoDB provider's logging
```

#### Database Backups
```bash
# MongoDB Atlas: Automatic backups enabled
# Local MongoDB: Set up cron jobs for backups
```

### 9. Scaling Considerations

#### Backend Scaling
- Use PM2 cluster mode: `pm2 start server.js -i max`
- Consider load balancers for multiple instances
- Use Redis for session storage
- Implement caching strategies

#### Database Scaling
- MongoDB Atlas: Auto-scaling enabled
- Consider read replicas for heavy read operations
- Implement connection pooling

#### Frontend Scaling
- CDN for static assets
- Implement service workers for offline functionality
- Use lazy loading for better performance

### 10. Backup Strategy

#### Database Backups
```bash
# MongoDB Atlas: Automatic daily backups
# Manual backup
mongodump --uri="mongodb+srv://..." --out=backup/

# Restore
mongorestore --uri="mongodb+srv://..." backup/
```

#### Code Backups
- Use Git for version control
- Regular pushes to remote repository
- Tag releases for easy rollback

### 11. Performance Optimization

#### Backend
- Enable gzip compression
- Implement caching (Redis)
- Optimize database queries
- Use connection pooling

#### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

#### Database
- Create proper indexes
- Monitor query performance
- Use aggregation pipelines efficiently

### 12. Troubleshooting

#### Common Issues
1. **CORS errors**: Check CLIENT_URL and DASHBOARD_URL
2. **Database connection**: Verify DB_URI and network access
3. **Authentication**: Check JWT_SECRET and ADMIN_KEY
4. **Build failures**: Check Node.js version compatibility

#### Debug Commands
```bash
# Check backend logs
heroku logs --tail

# Check database connection
mongosh "mongodb+srv://..."

# Test API endpoints
curl -X GET https://api.yourdomain.com/api/health
```

### 13. Maintenance Schedule

#### Daily
- Monitor error logs
- Check system health
- Verify backups

#### Weekly
- Review performance metrics
- Update dependencies
- Security audit

#### Monthly
- Full system backup
- Security updates
- Performance optimization review

---

**Remember**: Always test your deployment in a staging environment before going live!
