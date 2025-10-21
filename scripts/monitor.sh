#!/bin/bash

# Monitoring Script for Aspire Secure Trade
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Check if Docker Compose is running
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    print_error "Docker Compose services are not running"
    exit 1
fi

print_header "🔍 Aspire Secure Trade - System Monitoring"
echo "=================================================="

# System Information
print_header "System Information"
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime)"
echo "Date: $(date)"
echo ""

# Docker Services Status
print_header "Docker Services Status"
docker-compose -f docker-compose.prod.yml ps
echo ""

# Service Health Checks
print_header "Service Health Checks"

# Backend Health
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_status "✅ Backend API is healthy"
else
    print_error "❌ Backend API is not responding"
fi

# Database Health
if docker-compose -f docker-compose.prod.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_status "✅ MongoDB is healthy"
else
    print_error "❌ MongoDB is not responding"
fi

# Redis Health
if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "✅ Redis is healthy"
else
    print_error "❌ Redis is not responding"
fi

# Nginx Health
if curl -f http://localhost > /dev/null 2>&1; then
    print_status "✅ Nginx is healthy"
else
    print_error "❌ Nginx is not responding"
fi

echo ""

# Resource Usage
print_header "Resource Usage"

# CPU Usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
echo "CPU Usage: ${CPU_USAGE}%"

# Memory Usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')
echo "Memory Usage: $MEMORY_USAGE"

# Disk Usage
DISK_USAGE=$(df -h / | awk 'NR==2{printf "%s", $5}')
echo "Disk Usage: $DISK_USAGE"

echo ""

# Container Resource Usage
print_header "Container Resource Usage"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
echo ""

# Application Logs
print_header "Recent Application Logs"
docker-compose -f docker-compose.prod.yml logs --tail=10 backend
echo ""

# Error Logs
print_header "Recent Error Logs"
docker-compose -f docker-compose.prod.yml logs --tail=5 backend | grep -i error || echo "No recent errors found"
echo ""

# Network Connections
print_header "Network Connections"
netstat -tuln | grep -E ':(80|443|5000|27017|6379|9090|3000)' || echo "No active connections found"
echo ""

# SSL Certificate Status
print_header "SSL Certificate Status"
if [ -f "nginx/ssl/cert.pem" ]; then
    CERT_EXPIRY=$(openssl x509 -in nginx/ssl/cert.pem -noout -dates | grep notAfter | cut -d= -f2)
    echo "Certificate expires: $CERT_EXPIRY"
else
    print_warning "SSL certificate not found"
fi
echo ""

# Backup Status
print_header "Backup Status"
if [ -d "/opt/backups/aspire-trade" ]; then
    LATEST_BACKUP=$(ls -t /opt/backups/aspire-trade/aspire_trade_backup_*.tar.gz 2>/dev/null | head -1)
    if [ ! -z "$LATEST_BACKUP" ]; then
        BACKUP_DATE=$(stat -c %y "$LATEST_BACKUP" | cut -d' ' -f1)
        echo "Latest backup: $BACKUP_DATE"
    else
        print_warning "No backups found"
    fi
else
    print_warning "Backup directory not found"
fi
echo ""

# Performance Metrics
print_header "Performance Metrics"
echo "Active connections: $(netstat -an | grep -c ESTABLISHED)"
echo "Load average: $(uptime | awk -F'load average:' '{print $2}')"
echo ""

# Recommendations
print_header "Recommendations"
if [ ! -z "$CPU_USAGE" ] && [ "$CPU_USAGE" -gt 80 ]; then
    print_warning "High CPU usage detected. Consider scaling or optimization."
fi

if [ ! -z "$MEMORY_USAGE" ] && [ "$MEMORY_USAGE" -gt 80 ]; then
    print_warning "High memory usage detected. Consider increasing memory or optimizing."
fi

if [ ! -z "$DISK_USAGE" ] && [ "$DISK_USAGE" -gt 80 ]; then
    print_warning "High disk usage detected. Consider cleanup or expansion."
fi

echo ""
print_status "✅ Monitoring completed successfully!"
