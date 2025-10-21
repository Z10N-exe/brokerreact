@echo off
REM Aspire Secure Trade - Development Startup Script for Windows
REM This script starts all three applications for development

echo 🚀 Starting Aspire Secure Trade Development Environment
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

REM Install root dependencies if needed
if not exist "node_modules" (
    echo Installing root dependencies...
    npm install
)

REM Install backend dependencies
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Install frontend dependencies
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

REM Install dashboard dependencies
if not exist "dashboard\node_modules" (
    echo Installing dashboard dependencies...
    cd dashboard
    npm install
    cd ..
)

echo 🔧 Checking environment configuration...

REM Check for backend .env file
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Creating from template...
    (
        echo PORT=5000
        echo DB_URI=mongodb://localhost:27017/aspire-trade
        echo JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
        echo ADMIN_KEY=secret-admin-key-123
        echo CLIENT_URL=http://localhost:5173
        echo DASHBOARD_URL=http://localhost:5174
    ) > backend\.env
    echo ✅ Backend .env created. Please update with your values.
)

REM Check for frontend .env file
if not exist "frontend\.env" (
    echo ⚠️  Frontend .env file not found. Creating from template...
    echo VITE_API_URL=http://localhost:5000 > frontend\.env
    echo ✅ Frontend .env created.
)

REM Check for dashboard .env file
if not exist "dashboard\.env" (
    echo ⚠️  Dashboard .env file not found. Creating from template...
    (
        echo VITE_API_URL=http://localhost:5000
        echo VITE_ADMIN_KEY=secret-admin-key-123
    ) > dashboard\.env
    echo ✅ Dashboard .env created.
)

echo 🗄️  Checking MongoDB...
REM Check if MongoDB is running (Windows)
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MongoDB service not found. Please ensure MongoDB is installed and running.
    echo    - Install MongoDB from https://www.mongodb.com/try/download/community
    echo    - Or use MongoDB Atlas for cloud database.
    echo.
    pause
)

echo 🚀 Starting applications...

REM Start backend
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend application...
start "Frontend App" cmd /k "cd frontend && npm run dev"

REM Start dashboard
echo Starting admin dashboard...
start "Admin Dashboard" cmd /k "cd dashboard && npm run dev"

REM Wait for applications to start
echo ⏳ Waiting for applications to start...
timeout /t 5 /nobreak >nul

echo.
echo 🎉 Development environment is ready!
echo ==================================================
echo 📱 User Frontend:    http://localhost:5173
echo 👨‍💼 Admin Dashboard: http://localhost:5174
echo 🔧 Backend API:      http://localhost:5000
echo.
echo All applications are running in separate windows.
echo Close the windows to stop the services.
echo.
pause
