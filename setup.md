# Aspire Secure Trade - Setup Instructions

## 🚀 Quick Setup Guide

Follow these steps to get the Aspire Secure Trade platform running locally.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Step 1: Clone and Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
PORT=5000
DB_URI=mongodb://localhost:27017/aspire-trade
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
ADMIN_KEY=secret-admin-key-123
CLIENT_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
```

Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

Start the backend server:
```bash
npm run dev
```

### Step 2: Setup User Frontend

Open a new terminal:
```bash
cd frontend
npm install
```

Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### Step 3: Setup Admin Dashboard

Open another new terminal:
```bash
cd dashboard
npm install
```

Create `.env` file in `dashboard/` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_ADMIN_KEY=secret-admin-key-123
```

Start the dashboard:
```bash
npm run dev
```

### Step 4: Access the Applications

- **User Frontend**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **Backend API**: http://localhost:5000

## 🔧 Environment Files

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

## 🧪 Testing the Application

### 1. Test User Registration
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in the registration form
4. Submit and verify you're redirected to dashboard

### 2. Test Admin Dashboard
1. Go to http://localhost:5174
2. You should see the admin dashboard (no login required)
3. Check the "Users" section to see registered users
4. Try adjusting a user's balance

### 3. Test Transaction Flow
1. In the user frontend, make a deposit request
2. In the admin dashboard, go to "Deposits"
3. Approve the deposit
4. Check that the user's balance updates

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change PORT in backend/.env
- **MongoDB connection failed**: Ensure MongoDB is running
- **CORS errors**: Check CLIENT_URL and DASHBOARD_URL in backend/.env

### Frontend Issues
- **API connection failed**: Check VITE_API_URL in frontend/.env
- **Build errors**: Run `npm install` again
- **Port conflicts**: Change port in vite.config.js

### Dashboard Issues
- **Admin access denied**: Check VITE_ADMIN_KEY in dashboard/.env
- **API connection failed**: Check VITE_API_URL in dashboard/.env

## 📊 Database Setup

The application will automatically create the necessary collections:
- `users` - User accounts and balances
- `transactions` - All financial transactions
- `auditlogs` - Admin action logs

## 🔐 Security Notes

- **Admin Key**: Change the ADMIN_KEY in production
- **JWT Secret**: Use a strong, random JWT_SECRET in production
- **Database**: Use MongoDB Atlas or secure local setup in production
- **HTTPS**: Always use HTTPS in production

## 🚀 Production Deployment

1. **Database**: Set up MongoDB Atlas
2. **Backend**: Deploy to Heroku, DigitalOcean, or AWS
3. **Frontend**: Deploy to Vercel, Netlify, or similar
4. **Dashboard**: Deploy to separate hosting
5. **Environment**: Update all URLs to production domains

## 📞 Support

If you encounter issues:
1. Check the console logs in each terminal
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that all ports are available (5000, 5173, 5174)

---

**Happy Trading! 🚀**
