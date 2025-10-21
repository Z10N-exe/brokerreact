# Aspire Secure Trade - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### User Authentication (JWT)
Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Admin Authentication (API Key)
Include the admin key in the x-admin-key header:
```
x-admin-key: secret-admin-key-123
```

## User Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "country": "United States",
  "phone": "+1234567890",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "phone": "+1234567890",
  "password": "password123"
}
```

### User Operations (Requires JWT)

#### Get User Profile
```http
GET /user/me
Authorization: Bearer <jwt_token>
```

#### Create Deposit Request
```http
POST /user/deposit
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 1000
}
```

#### Create Crypto Deposit Request
```http
POST /deposits
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 1000,
  "currency": "BTC",
  "transactionHash": "optional_tx_hash"
}
```

#### Create Withdrawal Request
```http
POST /user/withdraw
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 500
}
```

#### Create Crypto Withdrawal Request
```http
POST /withdrawals
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 500
}
```

#### Get User Transactions
```http
GET /user/transactions
Authorization: Bearer <jwt_token>
```

#### Get User Deposits
```http
GET /deposits/my
Authorization: Bearer <jwt_token>
```

#### Get User Withdrawals
```http
GET /withdrawals/my
Authorization: Bearer <jwt_token>
```

#### Get Wallet Addresses
```http
GET /wallets
```

## Admin Endpoints

### User Management

#### Get All Users
```http
GET /admin/users
x-admin-key: secret-admin-key-123
```

#### Get User Details
```http
GET /admin/user/:id
x-admin-key: secret-admin-key-123
```

#### Adjust User Balance
```http
POST /admin/user/:id/adjust-balance
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "amount": 1000,
  "type": "credit",
  "note": "Bonus payment"
}
```

#### Add Profit to User
```http
POST /admin/user/:id/add-profit
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "amount": 500,
  "note": "Trading profit"
}
```

#### Impersonate User
```http
POST /admin/impersonate/:id
x-admin-key: secret-admin-key-123
```

### Transaction Management

#### Get Pending Transactions
```http
GET /admin/transactions/pending
x-admin-key: secret-admin-key-123
```

#### Approve Withdrawal
```http
POST /admin/withdraw/:id/approve
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "note": "Approved after verification"
}
```

#### Reject Withdrawal
```http
POST /admin/withdraw/:id/reject
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "note": "Insufficient documentation"
}
```

#### Approve Deposit
```http
POST /admin/deposit/:id/approve
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "note": "Payment verified"
}
```

#### Reject Deposit
```http
POST /admin/deposit/:id/reject
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "note": "Payment not received"
}
```

### Audit Logs

#### Get All Deposits
```http
GET /deposits/all
x-admin-key: secret-admin-key-123
```

#### Approve Crypto Deposit
```http
POST /deposits/:id/approve
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "note": "Deposit verified"
}
```

#### Reject Crypto Deposit
```http
POST /deposits/:id/reject
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "note": "Invalid transaction"
}
```

#### Get All Withdrawals
```http
GET /withdrawals/all
x-admin-key: secret-admin-key-123
```

#### Approve Crypto Withdrawal
```http
POST /withdrawals/:id/approve
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "note": "Withdrawal processed"
}
```

#### Reject Crypto Withdrawal
```http
POST /withdrawals/:id/reject
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "note": "Insufficient funds"
}
```

#### Get Wallet Addresses
```http
GET /wallets
x-admin-key: secret-admin-key-123
```

#### Update Wallet Address
```http
POST /wallets/update
x-admin-key: secret-admin-key-123
Content-Type: application/json

{
  "currency": "BTC",
  "network": "Bitcoin",
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "adminName": "Admin"
}
```

#### Get Audit Logs
```http
GET /admin/logs
x-admin-key: secret-admin-key-123
```

## Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

### User Object
```json
{
  "id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "country": "United States",
  "phone": "+1234567890",
  "balance": 1000.00,
  "profit": 500.00,
  "withdrawalsPending": 0.00,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Transaction Object
```json
{
  "id": "transaction_id",
  "userId": "user_id",
  "type": "deposit|withdrawal|profit|adjustment",
  "amount": 1000.00,
  "status": "pending|approved|rejected",
  "adminNote": "Admin note",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Audit Log Object
```json
{
  "id": "log_id",
  "action": "approve_withdrawal|reject_withdrawal|approve_deposit|reject_deposit|add_profit|adjust_balance|impersonate_user",
  "adminName": "Admin",
  "targetUser": "user_id",
  "note": "Action description",
  "amount": 1000.00,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing rate limiting for security.

## CORS

The API is configured to accept requests from:
- Frontend: `http://localhost:5173`
- Dashboard: `http://localhost:5174`

Update these URLs in the backend `.env` file for production deployment.
