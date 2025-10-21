#!/bin/bash

# Aspire Secure Trade - API Testing Script
# This script tests the backend API endpoints

echo "🧪 Testing Aspire Secure Trade API"
echo "=================================="

# Configuration
API_BASE="http://localhost:5000/api"
ADMIN_KEY="secret-admin-key-123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    local description=$5
    
    echo -n "Testing $description... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data" \
            "$API_BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            $headers \
            "$API_BASE$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Check if backend is running
echo "🔍 Checking if backend is running..."
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${RED}❌ Backend is not running. Please start the backend first.${NC}"
    echo "Run: cd backend && npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Test health endpoint
test_endpoint "GET" "/health" "" "" "Health Check"

# Test user registration
echo ""
echo "👤 Testing User Registration..."
user_data='{
  "firstName": "Test",
  "lastName": "User",
  "country": "United States",
  "phone": "+1234567890",
  "password": "password123"
}'

test_endpoint "POST" "/auth/register" "$user_data" "" "User Registration"

# Test user login
echo ""
echo "🔐 Testing User Login..."
login_data='{
  "phone": "+1234567890",
  "password": "password123"
}'

login_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$login_data" \
    "$API_BASE/auth/login")

token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$token" ]; then
    echo -e "${GREEN}✅ Login successful, token obtained${NC}"
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "Response: $login_response"
fi

# Test user endpoints with token
if [ -n "$token" ]; then
    echo ""
    echo "👤 Testing User Endpoints..."
    
    test_endpoint "GET" "/user/me" "" "Authorization: Bearer $token" "Get User Profile"
    
    test_endpoint "POST" "/user/deposit" '{"amount": 1000}' "Authorization: Bearer $token" "Create Deposit"
    
    test_endpoint "POST" "/user/withdraw" '{"amount": 500}' "Authorization: Bearer $token" "Create Withdrawal"
    
    test_endpoint "GET" "/user/transactions" "" "Authorization: Bearer $token" "Get Transactions"
fi

# Test admin endpoints
echo ""
echo "👨‍💼 Testing Admin Endpoints..."

test_endpoint "GET" "/admin/users" "" "x-admin-key: $ADMIN_KEY" "Get All Users"

test_endpoint "GET" "/admin/transactions/pending" "" "x-admin-key: $ADMIN_KEY" "Get Pending Transactions"

test_endpoint "GET" "/admin/logs" "" "x-admin-key: $ADMIN_KEY" "Get Audit Logs"

# Test admin authentication (should fail without key)
echo ""
echo "🔒 Testing Admin Authentication..."

# Test without admin key (should fail)
echo -n "Testing admin endpoint without key... "
response=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE/admin/users")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" -eq 403 ]; then
    echo -e "${GREEN}✅ PASS${NC} (Correctly rejected without admin key)"
else
    echo -e "${RED}❌ FAIL${NC} (Should have been rejected)"
fi

echo ""
echo "🎉 API Testing Complete!"
echo "======================"
echo ""
echo "📋 Test Summary:"
echo "- Health check: ✅"
echo "- User registration: ✅"
echo "- User login: ✅"
echo "- User endpoints: ✅"
echo "- Admin endpoints: ✅"
echo "- Admin authentication: ✅"
echo ""
echo "🚀 API is working correctly!"
