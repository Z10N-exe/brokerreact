#!/bin/bash

# Production Deployment Script for Aspire Secure Trade
set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found. Please create it with production environment variables."
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

print_status "Environment variables loaded"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p nginx/ssl
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources

# Generate SSL certificates (self-signed for development)
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    print_status "Generating SSL certificates..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=aspiretrade.com"
fi

# Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check backend health
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_status "✅ Backend is healthy"
else
    print_error "❌ Backend health check failed"
    exit 1
fi

# Check database connection
if docker-compose -f docker-compose.prod.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_status "✅ Database is healthy"
else
    print_error "❌ Database health check failed"
    exit 1
fi

# Check Redis connection
if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "✅ Redis is healthy"
else
    print_error "❌ Redis health check failed"
    exit 1
fi

# Check Nginx
if curl -f http://localhost > /dev/null 2>&1; then
    print_status "✅ Nginx is healthy"
else
    print_error "❌ Nginx health check failed"
    exit 1
fi

# Show running services
print_status "Running services:"
docker-compose -f docker-compose.prod.yml ps

# Show logs
print_status "Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

print_status "🎉 Deployment completed successfully!"
print_status "🌐 Application URLs:"
print_status "   Frontend: https://aspiretrade.com"
print_status "   Admin: https://admin.aspiretrade.com"
print_status "   API: https://aspiretrade.com/api"
print_status "   Monitoring: http://localhost:3000 (Grafana)"
print_status "   Metrics: http://localhost:9090 (Prometheus)"

print_warning "⚠️  Remember to:"
print_warning "   1. Update DNS records to point to this server"
print_warning "   2. Replace self-signed SSL certificates with real ones"
print_warning "   3. Configure firewall rules"
print_warning "   4. Set up automated backups"
print_warning "   5. Configure log rotation"
