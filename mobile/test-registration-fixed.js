// Updated test script to verify registration functionality with proper validation
// Run this with: node test-registration-fixed.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test student registration with proper validation
const testStudentRegistration = async () => {
  try {
    console.log('Testing student registration...');
    
    const studentData = {
      name: 'Test Student',
      email: 'test.student@example.com',
      phone: '9876543210',
      password: 'Password123', // Must have uppercase, lowercase, and number
      college: 'Test College University',
      course: 'B.Tech Computer Science',
      year: 2, // Must be integer between 1-6
      emergencyContact: {
        name: 'Test Parent',
        phone: '9876543211',
        relation: 'Father'
      },
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      }
    };

    const response = await axios.post(`${API_BASE_URL}/auth/register`, studentData);
    console.log('Student registration response:', response.data);
    
    if (response.data.success) {
      console.log('✅ Student registration successful');
      return true;
    } else {
      console.log('❌ Student registration failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Student registration error:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.log('Validation errors:', error.response.data.errors);
    }
    return false;
  }
};

// Test admin registration with proper validation
const testAdminRegistration = async () => {
  try {
    console.log('\nTesting admin registration...');
    
    const adminData = {
      name: 'Test Admin',
      email: 'test.admin@example.com',
      phone: '9876543212',
      password: 'Password123!', // Must have uppercase, lowercase, number, and special char
      adminCode: 'ADMIN123SECURE'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/admin-register`, adminData);
    console.log('Admin registration response:', response.data);
    
    if (response.data.success) {
      console.log('✅ Admin registration successful');
      return response.data.token;
    } else {
      console.log('❌ Admin registration failed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Admin registration error:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.log('Validation errors:', error.response.data.errors);
    }
    return null;
  }
};

// Test login after registration
const testLogin = async () => {
  try {
    console.log('\nTesting admin login...');
    
    const loginData = {
      email: 'test.admin@example.com',
      password: 'Password123!'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      console.log('✅ Login successful');
      return response.data.token;
    } else {
      console.log('❌ Login failed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.response?.data?.message || error.message);
    return null;
  }
};

// Test token verification
const testTokenVerification = async (token) => {
  try {
    console.log('\nTesting token verification...');
    
    const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Token verification successful');
      return true;
    } else {
      console.log('❌ Token verification failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Token verification error:', error.response?.data?.message || error.message);
    return false;
  }
};

// Test duplicate registration (should fail)
const testDuplicateRegistration = async () => {
  try {
    console.log('\nTesting duplicate registration (should fail)...');
    
    const duplicateData = {
      name: 'Another Test Student',
      email: 'test.student@example.com', // Same email as before
      phone: '9876543213',
      password: 'Password123',
      college: 'Another College',
      course: 'B.Tech IT',
      year: 1,
      emergencyContact: {
        name: 'Another Parent',
        phone: '9876543214',
        relation: 'Mother'
      },
      address: {
        street: '456 Another Street',
        city: 'Another City',
        state: 'Another State',
        pincode: '654321'
      }
    };

    const response = await axios.post(`${API_BASE_URL}/auth/register`, duplicateData);
    console.log('❌ Duplicate registration should have failed but succeeded');
    return false;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('✅ Duplicate registration correctly rejected');
      return true;
    } else {
      console.log('❌ Unexpected error in duplicate registration test:', error.response?.data?.message || error.message);
      return false;
    }
  }
};

// Test invalid admin code
const testInvalidAdminCode = async () => {
  try {
    console.log('\nTesting invalid admin code (should fail)...');
    
    const invalidAdminData = {
      name: 'Invalid Admin',
      email: 'invalid.admin@example.com',
      phone: '9876543215',
      password: 'Password123!',
      adminCode: 'WRONGCODE'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/admin-register`, invalidAdminData);
    console.log('❌ Invalid admin code should have failed but succeeded');
    return false;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('Invalid admin code')) {
      console.log('✅ Invalid admin code correctly rejected');
      return true;
    } else {
      console.log('❌ Unexpected error in invalid admin code test:', error.response?.data?.message || error.message);
      return false;
    }
  }
};

// Run comprehensive tests
const runTests = async () => {
  console.log('🚀 Starting comprehensive registration tests...\n');
  
  const results = {
    studentRegistration: false,
    adminRegistration: false,
    login: false,
    tokenVerification: false,
    duplicateRejection: false,
    invalidAdminCodeRejection: false
  };

  // Test student registration
  results.studentRegistration = await testStudentRegistration();
  
  // Test admin registration
  const adminToken = await testAdminRegistration();
  results.adminRegistration = !!adminToken;
  
  // Test login
  const loginToken = await testLogin();
  results.login = !!loginToken;
  
  // Test token verification
  if (loginToken) {
    results.tokenVerification = await testTokenVerification(loginToken);
  }
  
  // Test duplicate registration
  results.duplicateRejection = await testDuplicateRegistration();
  
  // Test invalid admin code
  results.invalidAdminCodeRejection = await testInvalidAdminCode();
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Registration functionality is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
  }
  
  return results;
};

// Check if backend is running
const checkBackend = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Backend is running');
    console.log('Backend status:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Backend is not running. Please start the backend server first.');
    console.log('Run: cd backend && npm start');
    return false;
  }
};

// Main execution
const main = async () => {
  console.log('🔍 Checking backend connectivity...\n');
  const backendRunning = await checkBackend();
  
  if (backendRunning) {
    console.log('\n');
    const results = await runTests();
    
    // Return exit code based on results
    const allPassed = Object.values(results).every(Boolean);
    process.exit(allPassed ? 0 : 1);
  } else {
    process.exit(1);
  }
};

main();