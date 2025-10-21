#!/bin/bash

# Aspire Secure Trade - Build All Applications
# This script builds all applications for production

echo "🏗️  Building Aspire Secure Trade for Production"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to build application
build_app() {
    local app_name=$1
    local app_dir=$2
    
    echo "🔨 Building $app_name..."
    
    if [ ! -d "$app_dir" ]; then
        echo "❌ Directory $app_dir not found"
        return 1
    fi
    
    cd "$app_dir"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies for $app_name..."
        npm install
    fi
    
    # Build the application
    echo "🏗️  Building $app_name..."
    if npm run build; then
        echo "✅ $app_name built successfully"
    else
        echo "❌ Failed to build $app_name"
        cd ..
        return 1
    fi
    
    cd ..
    return 0
}

# Build all applications
echo "📦 Installing root dependencies..."
npm install

echo "🔨 Building applications..."

# Build frontend
build_app "Frontend" "frontend"
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Build dashboard
build_app "Dashboard" "dashboard"
if [ $? -ne 0 ]; then
    echo "❌ Dashboard build failed"
    exit 1
fi

echo ""
echo "🎉 All applications built successfully!"
echo "=============================================="
echo "📁 Frontend build:    frontend/dist/"
echo "📁 Dashboard build:   dashboard/dist/"
echo "📁 Backend source:    backend/"
echo ""
echo "🚀 Ready for deployment!"

# Create deployment package
echo "📦 Creating deployment package..."
if [ -d "dist" ]; then
    rm -rf dist
fi

mkdir -p dist/frontend
mkdir -p dist/dashboard
mkdir -p dist/backend

# Copy built applications
cp -r frontend/dist/* dist/frontend/
cp -r dashboard/dist/* dist/dashboard/
cp -r backend/* dist/backend/

# Remove node_modules from backend copy
rm -rf dist/backend/node_modules

echo "✅ Deployment package created in dist/ directory"
echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to your server"
echo "2. Deploy frontend to your hosting service"
echo "3. Deploy dashboard to your hosting service"
echo "4. Configure environment variables"
echo "5. Set up database connection"
echo ""
echo "📖 See docs/DEPLOYMENT.md for detailed instructions"
