#!/bin/bash

# Database Backup Script for Aspire Secure Trade
set -e

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

# Configuration
BACKUP_DIR="/opt/backups/aspire-trade"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="aspire_trade_backup_${DATE}.tar.gz"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

print_status "Starting backup process..."

# Create database backup
print_status "Creating database backup..."
docker-compose -f docker-compose.prod.yml exec -T mongodb mongodump \
    --db aspire_trade \
    --archive > "$BACKUP_DIR/mongodb_backup_${DATE}.archive"

# Create application backup
print_status "Creating application backup..."
tar -czf "$BACKUP_DIR/app_backup_${DATE}.tar.gz" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=logs \
    --exclude=dist \
    .

# Create logs backup
print_status "Creating logs backup..."
if [ -d "logs" ]; then
    tar -czf "$BACKUP_DIR/logs_backup_${DATE}.tar.gz" logs/
fi

# Create combined backup
print_status "Creating combined backup..."
cd "$BACKUP_DIR"
tar -czf "$BACKUP_FILE" \
    mongodb_backup_${DATE}.archive \
    app_backup_${DATE}.tar.gz \
    logs_backup_${DATE}.tar.gz

# Clean up individual backups
rm -f mongodb_backup_${DATE}.archive
rm -f app_backup_${DATE}.tar.gz
rm -f logs_backup_${DATE}.tar.gz

# Remove old backups
print_status "Cleaning up old backups..."
find "$BACKUP_DIR" -name "aspire_trade_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)

print_status "✅ Backup completed successfully!"
print_status "📁 Backup file: $BACKUP_DIR/$BACKUP_FILE"
print_status "📊 Backup size: $BACKUP_SIZE"
print_status "🗑️  Old backups cleaned up (retention: $RETENTION_DAYS days)"

# Optional: Upload to cloud storage
if [ ! -z "$AWS_S3_BUCKET" ]; then
    print_status "Uploading backup to S3..."
    aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "s3://$AWS_S3_BUCKET/backups/"
    print_status "✅ Backup uploaded to S3"
fi

# Optional: Send notification
if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ Aspire Trade backup completed: $BACKUP_FILE ($BACKUP_SIZE)\"}" \
        "$SLACK_WEBHOOK_URL"
fi
