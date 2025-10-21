# Authentication System Guide

## Overview
The Aspire Secure Trade authentication system has been completely modernized with a beautiful, responsive design that matches the landing page aesthetic. The system includes secure user registration, login, and session management.

## Features

### ✅ **Modern UI/UX Design**
- **Dark theme** with gradient backgrounds matching the landing page
- **Responsive design** that works on all devices
- **Smooth animations** and hover effects
- **Professional styling** with consistent branding

### ✅ **Enhanced Security**
- **JWT token authentication** with 7-day expiration
- **Password hashing** using bcryptjs
- **Input validation** on both frontend and backend
- **Rate limiting** for authentication endpoints
- **XSS and injection protection**

### ✅ **User Experience**
- **Real-time validation** with helpful error messages
- **Loading states** with animated spinners
- **Success feedback** with smooth transitions
- **Password visibility toggle**
- **Remember me functionality**
- **Forgot password link** (ready for implementation)

## Authentication Flow

### 1. **User Registration**
```
POST /api/auth/register
```
**Required Fields:**
- `firstName` (string, required)
- `lastName` (string, required)
- `email` (string, optional, validated)
- `country` (string, required)
- `phone` (string, required, unique)
- `password` (string, min 6 characters)

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "country": "United States",
    "phone": "+1234567890",
    "balance": 0,
    "profit": 0,
    "withdrawalsPending": 0
  }
}
```

### 2. **User Login**
```
POST /api/auth/login
```
**Required Fields:**
- `phone` (string, required)
- `password` (string, required)

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "country": "United States",
    "phone": "+1234567890",
    "balance": 0,
    "profit": 0,
    "withdrawalsPending": 0
  }
}
```

### 3. **Protected Routes**
All protected routes require the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Frontend Components

### **Signup Page** (`/signup`)
- **Modern form design** with icon inputs
- **Real-time validation** for all fields
- **Email field** (optional but validated)
- **Password strength indicators**
- **Terms and conditions checkbox**
- **Age verification checkbox**
- **Success/error messaging**

### **Login Page** (`/login`)
- **Clean, focused design**
- **Phone number and password fields**
- **Remember me checkbox**
- **Forgot password link**
- **Trust signals** (SSL, Secure Login badges)
- **Success/error messaging**

## Backend Architecture

### **Models**
- **User Model** (`backend/models/User.js`)
  - Email field (optional, unique)
  - Phone field (required, unique)
  - Password hashing middleware
  - Password comparison method

### **Controllers**
- **Auth Controller** (`backend/controllers/authController.js`)
  - Registration with duplicate checking
  - Login with credential validation
  - JWT token generation
  - User data sanitization

### **Routes**
- **Auth Routes** (`backend/routes/authRoutes.js`)
  - Input validation middleware
  - Rate limiting
  - Error handling

### **Middleware**
- **JWT Authentication** (`backend/middleware/authMiddleware.js`)
- **Rate Limiting** for auth endpoints
- **Input Validation** with express-validator
- **Security Headers** and XSS protection

## Testing

### **Automated Testing**
Run the authentication test suite:
```bash
npm run test:auth
```

This will test:
- ✅ Health check endpoint
- ✅ User registration
- ✅ User login
- ✅ Protected route access
- ✅ JWT token validation

### **Manual Testing**
1. **Start the development environment:**
   ```bash
   npm run start:dev
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

3. **Test the flow:**
   - Navigate to `/signup`
   - Create a new account
   - Login with credentials
   - Access protected routes

## Security Features

### **Password Security**
- Minimum 6 characters required
- Bcrypt hashing with salt rounds
- Password comparison using secure methods

### **Token Security**
- JWT tokens with 7-day expiration
- Secure token storage in localStorage
- Automatic token refresh on API calls

### **Input Validation**
- Frontend validation with regex patterns
- Backend validation with express-validator
- XSS protection and sanitization
- SQL injection prevention

### **Rate Limiting**
- Authentication endpoints protected
- IP-based rate limiting
- Brute force protection

## Error Handling

### **Frontend Errors**
- Real-time validation feedback
- Clear error messages
- Loading states during API calls
- Network error handling

### **Backend Errors**
- Detailed error messages
- Proper HTTP status codes
- Error logging and monitoring
- Graceful failure handling

## Future Enhancements

### **Planned Features**
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Social login integration
- [ ] Account lockout after failed attempts
- [ ] Session management improvements

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development environment
npm run start:dev

# Test authentication
npm run test:auth

# Start individual services
npm run dev:backend
npm run dev:frontend

# Build for production
npm run build:all
```

## Troubleshooting

### **Common Issues**
1. **Connection refused**: Ensure backend server is running
2. **Invalid token**: Check JWT secret configuration
3. **Database errors**: Verify MongoDB connection
4. **Validation errors**: Check input format requirements

### **Debug Mode**
Enable debug logging by setting:
```bash
DEBUG=aspire-trade:* npm run dev:backend
```

## Support
For authentication-related issues, check:
1. Browser console for frontend errors
2. Backend logs for server errors
3. Network tab for API request/response details
4. Database connection status
