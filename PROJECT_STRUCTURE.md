# Aspire Secure Trade - Project Structure

## 📁 Complete Project Organization

```
AspireSecureTrade/
├── 📁 backend/                    # Node.js + Express + MongoDB Backend
│   ├── 📁 config/                 # Database configuration
│   │   └── 📄 db.js              # MongoDB connection setup
│   ├── 📁 controllers/           # API route controllers
│   │   ├── 📄 authController.js  # Authentication logic
│   │   ├── 📄 userController.js  # User operations
│   │   └── 📄 adminController.js # Admin operations
│   ├── 📁 middleware/            # Express middleware
│   │   ├── 📄 authMiddleware.js  # JWT & Admin auth
│   │   └── 📄 errorHandler.js   # Error handling
│   ├── 📁 models/               # MongoDB models
│   │   ├── 📄 User.js           # User schema
│   │   ├── 📄 Transaction.js   # Transaction schema
│   │   └── 📄 AuditLog.js      # Audit log schema
│   ├── 📁 routes/              # API routes
│   │   ├── 📄 authRoutes.js    # Auth endpoints
│   │   ├── 📄 userRoutes.js    # User endpoints
│   │   └── 📄 adminRoutes.js   # Admin endpoints
│   ├── 📄 server.js            # Main server file
│   ├── 📄 package.json         # Backend dependencies
│   └── 📄 .env.example         # Environment template
│
├── 📁 frontend/                 # React User Frontend
│   ├── 📁 public/              # Static assets
│   │   └── 📄 index.html       # HTML template
│   ├── 📁 src/                 # Source code
│   │   ├── 📁 components/      # Reusable components
│   │   │   ├── 📄 Navbar.jsx   # Navigation component
│   │   │   ├── 📄 Footer.jsx   # Footer component
│   │   │   └── 📄 Card.jsx     # Card component
│   │   ├── 📁 pages/           # Page components
│   │   │   ├── 📄 LandingPage.jsx    # Homepage
│   │   │   ├── 📄 Signup.jsx         # Registration
│   │   │   ├── 📄 Login.jsx          # Login
│   │   │   ├── 📄 Dashboard.jsx      # User dashboard
│   │   │   ├── 📄 Deposit.jsx        # Deposit form
│   │   │   ├── 📄 Withdraw.jsx       # Withdrawal form
│   │   │   └── 📄 Transactions.jsx   # Transaction history
│   │   ├── 📁 utils/           # Utility functions
│   │   │   └── 📄 api.js       # API client
│   │   ├── 📄 App.jsx          # Main app component
│   │   ├── 📄 main.jsx         # App entry point
│   │   └── 📄 index.css        # Global styles
│   ├── 📄 package.json         # Frontend dependencies
│   ├── 📄 vite.config.js       # Vite configuration
│   ├── 📄 tailwind.config.js   # Tailwind CSS config
│   ├── 📄 postcss.config.js    # PostCSS config
│   └── 📄 .env.example         # Environment template
│
├── 📁 dashboard/                # React Admin Dashboard
│   ├── 📁 public/              # Static assets
│   │   └── 📄 index.html       # HTML template
│   ├── 📁 src/                 # Source code
│   │   ├── 📁 components/      # Reusable components
│   │   │   ├── 📄 Sidebar.jsx  # Navigation sidebar
│   │   │   ├── 📄 Header.jsx   # Dashboard header
│   │   │   ├── 📄 Table.jsx    # Table components
│   │   │   └── 📄 Modal.jsx    # Modal component
│   │   ├── 📁 pages/           # Page components
│   │   │   ├── 📄 Overview.jsx     # Dashboard overview
│   │   │   ├── 📄 Users.jsx        # User management
│   │   │   ├── 📄 UserDetail.jsx   # User details
│   │   │   ├── 📄 Deposits.jsx    # Deposit management
│   │   │   ├── 📄 Withdrawals.jsx  # Withdrawal management
│   │   │   ├── 📄 Logs.jsx         # Audit logs
│   │   │   └── 📄 Settings.jsx    # System settings
│   │   ├── 📁 utils/           # Utility functions
│   │   │   └── 📄 api.js       # Admin API client
│   │   ├── 📄 App.jsx          # Main app component
│   │   ├── 📄 main.jsx         # App entry point
│   │   └── 📄 index.css        # Global styles
│   ├── 📄 package.json         # Dashboard dependencies
│   ├── 📄 vite.config.js       # Vite configuration
│   ├── 📄 tailwind.config.js   # Tailwind CSS config
│   ├── 📄 postcss.config.js    # PostCSS config
│   └── 📄 .env.example         # Environment template
│
├── 📁 docs/                     # Documentation
│   ├── 📄 API.md               # API documentation
│   ├── 📄 DEPLOYMENT.md        # Deployment guide
│   └── 📄 FEATURES.md          # Features overview
│
├── 📁 scripts/                  # Utility scripts
│   ├── 📄 start-dev.sh         # Development startup (Linux/Mac)
│   ├── 📄 start-dev.bat        # Development startup (Windows)
│   ├── 📄 build-all.sh         # Build all applications
│   └── 📄 test-api.sh          # API testing script
│
├── 📄 README.md                # Main project documentation
├── 📄 setup.md                 # Quick setup guide
├── 📄 PROJECT_STRUCTURE.md     # This file
├── 📄 package.json             # Root package.json
├── 📄 .gitignore              # Git ignore rules
└── 📄 LICENSE                  # Project license
```

## 🎯 Application Architecture

### Backend (Node.js + Express + MongoDB)
- **Port**: 5000
- **Database**: MongoDB
- **Authentication**: JWT for users, API key for admin
- **Features**: User management, transactions, admin controls

### Frontend (React + Vite + Tailwind)
- **Port**: 5173
- **Purpose**: User-facing application
- **Features**: Registration, login, dashboard, transactions

### Dashboard (React + Vite + Tailwind)
- **Port**: 5174
- **Purpose**: Admin control panel
- **Features**: User management, transaction approval, audit logs

## 🔧 Development Workflow

### 1. Environment Setup
```bash
# Install all dependencies
npm run install:all

# Or install individually
npm run install:backend
npm run install:frontend
npm run install:dashboard
```

### 2. Development
```bash
# Start all applications
npm run dev:all

# Or start individually
npm run dev:backend    # Backend API
npm run dev:frontend   # User frontend
npm run dev:dashboard  # Admin dashboard
```

### 3. Building for Production
```bash
# Build all applications
npm run build:all

# Or build individually
npm run build:frontend
npm run build:dashboard
```

## 📋 File Responsibilities

### Backend Files
- **server.js**: Main server entry point
- **config/db.js**: Database connection
- **models/**: MongoDB schemas
- **controllers/**: Business logic
- **routes/**: API endpoints
- **middleware/**: Authentication & error handling

### Frontend Files
- **App.jsx**: Main application component
- **pages/**: Individual page components
- **components/**: Reusable UI components
- **utils/api.js**: API communication
- **index.css**: Global styles

### Dashboard Files
- **App.jsx**: Main dashboard component
- **pages/**: Admin page components
- **components/**: Admin UI components
- **utils/api.js**: Admin API communication

## 🚀 Quick Start Commands

### Development
```bash
# Start all services
./scripts/start-dev.sh    # Linux/Mac
scripts/start-dev.bat     # Windows

# Or use npm scripts
npm run dev:all
```

### Testing
```bash
# Test API endpoints
./scripts/test-api.sh
```

### Building
```bash
# Build all applications
./scripts/build-all.sh
```

## 📁 Environment Files

Each application needs its own `.env` file:

### Backend (.env)
```env
PORT=5000
DB_URI=mongodb://localhost:27017/aspire-trade
JWT_SECRET=your_jwt_secret_key_here
ADMIN_KEY=secret-admin-key-123
CLIENT_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Dashboard (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_ADMIN_KEY=secret-admin-key-123
```

## 🔒 Security Considerations

- **Admin Access**: No login form, direct URL access
- **API Keys**: Admin operations require API key
- **CORS**: Configured for specific frontend URLs
- **Authentication**: JWT for users, API key for admin
- **Audit Logging**: All admin actions are logged

## 📊 Database Collections

- **users**: User accounts and balances
- **transactions**: All financial transactions
- **auditlogs**: Admin action tracking

## 🌐 Access URLs

- **User Frontend**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **Backend API**: http://localhost:5000

This structure provides a clean, organized, and maintainable codebase for the Aspire Secure Trade platform.
