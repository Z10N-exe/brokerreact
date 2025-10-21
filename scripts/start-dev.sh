#!/bin/bash

# Aspire Secure Trade - Development Startup Script
# This script starts all three applications for development

echo "🚀 Starting Aspire Secure Trade Development Environment"
echo "=================================================="

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

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using this port."
        return 1
    fi
    return 0
}

# Check required ports
echo "🔍 Checking ports..."
check_port 5000 || exit 1
check_port 5173 || exit 1
check_port 5174 || exit 1

# Install dependencies if needed
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "dashboard/node_modules" ]; then
    echo "Installing dashboard dependencies..."
    cd dashboard && npm install && cd ..
fi

# Check for environment files
echo "🔧 Checking environment configuration..."

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from template..."
    cat > backend/.env << EOF
PORT=5000
DB_URI=mongodb://localhost:27017/aspire-trade
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
ADMIN_KEY=secret-admin-key-123
CLIENT_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
EOF
    echo "✅ Backend .env created. Please update with your values."
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Creating from template..."
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000
EOF
    echo "✅ Frontend .env created."
fi

if [ ! -f "dashboard/.env" ]; then
    echo "⚠️  Dashboard .env file not found. Creating from template..."
    cat > dashboard/.env << EOF
VITE_API_URL=http://localhost:5000
VITE_ADMIN_KEY=secret-admin-key-123
EOF
    echo "✅ Dashboard .env created."
fi

# Start MongoDB if not running
echo "🗄️  Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   - On macOS: brew services start mongodb-community"
    echo "   - On Ubuntu: sudo systemctl start mongod"
    echo "   - On Windows: net start MongoDB"
    echo ""
    echo "Or use MongoDB Atlas for cloud database."
    read -p "Press Enter to continue anyway (MongoDB Atlas users) or Ctrl+C to exit..."
fi

# Start applications
echo "🚀 Starting applications..."

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend application..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Start dashboard
echo "Starting admin dashboard..."
cd dashboard
npm run dev &
DASHBOARD_PID=$!
cd ..

# Wait for applications to start
echo "⏳ Waiting for applications to start..."
sleep 5

# Check if applications are running
echo "🔍 Checking application status..."

# Check backend
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:5000"
else
    echo "❌ Backend failed to start"
fi

# Check frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:5173"
else
    echo "❌ Frontend failed to start"
fi

# Check dashboard
if curl -s http://localhost:5174 > /dev/null; then
    echo "✅ Dashboard is running on http://localhost:5174"
else
    echo "❌ Dashboard failed to start"
fi

echo ""
echo "🎉 Development environment is ready!"
echo "=================================================="
echo "📱 User Frontend:    http://localhost:5173"
echo "👨‍💼 Admin Dashboard: http://localhost:5174"
echo "🔧 Backend API:      http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill $DASHBOARD_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
