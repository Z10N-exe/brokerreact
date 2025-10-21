const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: User Registration
    console.log('2. Testing User Registration...');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      country: 'United States',
      phone: '+1234567890',
      password: 'password123'
    };

    try {
      const registerResponse = await axios.post(`${API_URL}/api/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data.message);
      console.log('   User ID:', registerResponse.data.user.id);
      console.log('   Token received:', !!registerResponse.data.token);
      console.log('');
    } catch (registerError) {
      if (registerError.response?.status === 400 && 
          registerError.response?.data?.message?.includes('already exists')) {
        console.log('⚠️  User already exists (this is expected for repeated tests)');
        console.log('');
      } else {
        throw registerError;
      }
    }

    // Test 3: User Login
    console.log('3. Testing User Login...');
    const loginCredentials = {
      phone: testUser.phone,
      password: testUser.password
    };

    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, loginCredentials);
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('   User:', loginResponse.data.user.firstName, loginResponse.data.user.lastName);
    console.log('   Token received:', !!loginResponse.data.token);
    console.log('');

    // Test 4: Protected Route (using token)
    console.log('4. Testing Protected Route...');
    const token = loginResponse.data.token;
    const protectedResponse = await axios.get(`${API_URL}/api/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Protected route access successful');
    console.log('   User data retrieved:', !!protectedResponse.data.user);
    console.log('');

    console.log('🎉 All authentication tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Health check: ✅ Working');
    console.log('   - User registration: ✅ Working');
    console.log('   - User login: ✅ Working');
    console.log('   - Protected routes: ✅ Working');
    console.log('   - JWT authentication: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm start');
    }
    
    process.exit(1);
  }
}

// Run tests
testAuth();
