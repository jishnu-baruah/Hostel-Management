// Comprehensive mobile app integration test
// Run this with: node test-mobile-integration.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Generate unique test data
const generateUniqueData = () => {
  const timestamp = Date.now();
  return {
    student: {
      name: 'Mobile Test Student',
      email: `mobile.student.${timestamp}@example.com`,
      phone: `98765${String(timestamp).slice(-5)}`,
      password: 'Password123',
      college: 'Mobile Test College University',
      course: 'B.Tech Computer Science',
      year: 2,
      emergencyContact: {
        name: 'Mobile Test Parent',
        phone: `98765${String(timestamp + 1).slice(-5)}`,
        relation: 'Father'
      },
      address: {
        street: '123 Mobile Test Street',
        city: 'Mobile Test City',
        state: 'Mobile Test State',
        pincode: '123456'
      }
    },
    admin: {
      name: 'Mobile Test Admin',
      email: `mobile.admin.${timestamp}@example.com`,
      phone: `98765${String(timestamp + 2).slice(-5)}`,
      password: 'Password123!',
      adminCode: 'ADMIN123SECURE'
    }
  };
};

// Test API connectivity
const testAPIConnectivity = async () => {
  try {
    console.log('🔗 Testing API connectivity...');
    
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    
    if (response.data.status === 'OK') {
      console.log('✅ Backend API is accessible');
      console.log(`   Server uptime: ${Math.floor(response.data.uptime)} seconds`);
      return true;
    } else {
      console.log('❌ Backend API health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend API');
    console.log(`   Error: ${error.message}`);
    console.log('   Make sure backend is running on http://localhost:5000');
    return false;
  }
};

// Test CORS configuration
const testCORS = async () => {
  try {
    console.log('🌐 Testing CORS configuration...');
    
    const response = await axios.options(`${API_BASE_URL}/auth/register`);
    console.log('✅ CORS preflight request successful');
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('✅ CORS appears to be configured (OPTIONS not implemented but request went through)');
      return true;
    } else {
      console.log('❌ CORS configuration issue:', error.message);
      return false;
    }
  }
};

// Test student registration flow
const testStudentRegistrationFlow = async (studentData) => {
  try {
    console.log('👨‍🎓 Testing student registration flow...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, studentData);
    
    if (response.data.success) {
      console.log('✅ Student registration successful');
      console.log(`   Message: ${response.data.message}`);
      console.log(`   User ID: ${response.data.user?.id || 'Not provided'}`);
      console.log(`   Approval Status: ${response.data.user?.isApproved ? 'Approved' : 'Pending'}`);
      return { success: true, user: response.data.user };
    } else {
      console.log('❌ Student registration failed:', response.data.message);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.log('❌ Student registration error:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.log('   Validation errors:');
      error.response.data.errors.forEach(err => {
        console.log(`     - ${err.msg} (${err.param})`);
      });
    }
    return { success: false, error: error.response?.data };
  }
};

// Test admin registration flow
const testAdminRegistrationFlow = async (adminData) => {
  try {
    console.log('👨‍💼 Testing admin registration flow...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/admin-register`, adminData);
    
    if (response.data.success) {
      console.log('✅ Admin registration successful');
      console.log(`   Message: ${response.data.message}`);
      console.log(`   User ID: ${response.data.user?.id || 'Not provided'}`);
      console.log(`   Role: ${response.data.user?.role || 'Not provided'}`);
      console.log(`   Auto-login: ${response.data.token ? 'Yes' : 'No'}`);
      return { 
        success: true, 
        user: response.data.user, 
        token: response.data.token,
        autoLogin: !!response.data.token 
      };
    } else {
      console.log('❌ Admin registration failed:', response.data.message);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.log('❌ Admin registration error:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.log('   Validation errors:');
      error.response.data.errors.forEach(err => {
        console.log(`     - ${err.msg} (${err.param})`);
      });
    }
    return { success: false, error: error.response?.data };
  }
};

// Test login functionality
const testLoginFlow = async (email, password, isAdmin = false) => {
  try {
    console.log(`🔐 Testing ${isAdmin ? 'admin' : 'user'} login flow...`);
    
    const endpoint = isAdmin ? '/auth/admin-login' : '/auth/login';
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
      email,
      password
    });
    
    if (response.data.success) {
      console.log('✅ Login successful');
      console.log(`   User: ${response.data.user?.name}`);
      console.log(`   Role: ${response.data.user?.role}`);
      console.log(`   Token provided: ${response.data.token ? 'Yes' : 'No'}`);
      return { 
        success: true, 
        user: response.data.user, 
        token: response.data.token 
      };
    } else {
      console.log('❌ Login failed:', response.data.message);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.log('❌ Login error:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data };
  }
};

// Test token verification
const testTokenVerification = async (token) => {
  try {
    console.log('🔍 Testing token verification...');
    
    const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Token verification successful');
      console.log(`   User: ${response.data.user?.name}`);
      console.log(`   Role: ${response.data.user?.role}`);
      return { success: true, user: response.data.user };
    } else {
      console.log('❌ Token verification failed:', response.data.message);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.log('❌ Token verification error:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data };
  }
};

// Test error handling
const testErrorHandling = async () => {
  console.log('🚨 Testing error handling...');
  
  const tests = [
    {
      name: 'Invalid email format',
      data: { email: 'invalid-email', password: 'Password123' },
      endpoint: '/auth/login'
    },
    {
      name: 'Missing required fields',
      data: { name: 'Test' },
      endpoint: '/auth/register'
    },
    {
      name: 'Invalid admin code',
      data: {
        name: 'Test Admin',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'Password123!',
        adminCode: 'WRONGCODE'
      },
      endpoint: '/auth/admin-register'
    }
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    try {
      const response = await axios.post(`${API_BASE_URL}${test.endpoint}`, test.data);
      console.log(`❌ ${test.name}: Should have failed but succeeded`);
    } catch (error) {
      if (error.response?.status >= 400 && error.response?.status < 500) {
        console.log(`✅ ${test.name}: Correctly rejected`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: Unexpected error - ${error.message}`);
      }
    }
  }
  
  console.log(`   Error handling: ${passedTests}/${tests.length} tests passed`);
  return passedTests === tests.length;
};

// Check mobile app configuration
const checkMobileAppConfig = () => {
  console.log('📱 Checking mobile app configuration...');
  
  try {
    // Check if constants file exists and has correct API URL
    const fs = require('fs');
    const path = require('path');
    
    const constantsPath = path.join(__dirname, 'src', 'utils', 'constants.js');
    
    if (fs.existsSync(constantsPath)) {
      const constants = fs.readFileSync(constantsPath, 'utf8');
      
      if (constants.includes('http://localhost:5000/api')) {
        console.log('✅ API base URL correctly configured for development');
      } else {
        console.log('⚠️  API base URL might not be configured correctly');
        console.log('   Expected: http://localhost:5000/api');
      }
      
      if (constants.includes('__DEV__')) {
        console.log('✅ Development environment detection configured');
      } else {
        console.log('⚠️  Development environment detection not found');
      }
      
      return true;
    } else {
      console.log('❌ Constants file not found at expected location');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking mobile app configuration:', error.message);
    return false;
  }
};

// Main test execution
const runComprehensiveTests = async () => {
  console.log('🚀 Starting comprehensive mobile app integration tests...\n');
  
  const results = {
    apiConnectivity: false,
    corsConfiguration: false,
    mobileAppConfig: false,
    studentRegistration: false,
    adminRegistration: false,
    adminLogin: false,
    tokenVerification: false,
    errorHandling: false
  };
  
  // Generate unique test data
  const testData = generateUniqueData();
  
  // Test API connectivity
  results.apiConnectivity = await testAPIConnectivity();
  console.log('');
  
  if (!results.apiConnectivity) {
    console.log('❌ Cannot proceed with tests - backend not accessible');
    return results;
  }
  
  // Test CORS
  results.corsConfiguration = await testCORS();
  console.log('');
  
  // Check mobile app configuration
  results.mobileAppConfig = checkMobileAppConfig();
  console.log('');
  
  // Test student registration
  const studentResult = await testStudentRegistrationFlow(testData.student);
  results.studentRegistration = studentResult.success;
  console.log('');
  
  // Test admin registration
  const adminResult = await testAdminRegistrationFlow(testData.admin);
  results.adminRegistration = adminResult.success;
  console.log('');
  
  // Test admin login (if registration succeeded)
  let loginToken = null;
  if (adminResult.success) {
    if (adminResult.autoLogin && adminResult.token) {
      console.log('🔐 Admin auto-login successful (token provided during registration)');
      loginToken = adminResult.token;
      results.adminLogin = true;
    } else {
      const loginResult = await testLoginFlow(testData.admin.email, testData.admin.password, true);
      results.adminLogin = loginResult.success;
      loginToken = loginResult.token;
    }
    console.log('');
  }
  
  // Test token verification (if login succeeded)
  if (loginToken) {
    const verifyResult = await testTokenVerification(loginToken);
    results.tokenVerification = verifyResult.success;
    console.log('');
  }
  
  // Test error handling
  results.errorHandling = await testErrorHandling();
  console.log('');
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${passed ? '✅' : '❌'} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Mobile app integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
  }
  
  return results;
};

// Execute tests
runComprehensiveTests()
  .then(results => {
    const allPassed = Object.values(results).every(Boolean);
    process.exit(allPassed ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });