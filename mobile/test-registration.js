// Test script to verify registration functionality
// Run this with: node test-registration.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test student registration
const testStudentRegistration = async () => {
  try {
    console.log('Testing student registration...');
    
    const studentData = {
      name: 'Test Student',
      email: 'test.student@example.com',
      phone: '9876543210',
      password: 'password123',
      college: 'Test College',
      course: 'B.Tech Computer Science',
      year: '2nd Year',
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
    } else {
      console.log('❌ Student registration failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Student registration error:', error.response?.data?.message || error.message);
  }
};

// Test admin registration
const testAdminRegistration = async () => {
  try {
    console.log('\nTesting admin registration...');
    
    const adminData = {
      name: 'Test Admin',
      email: 'test.admin@example.com',
      phone: '9876543212',
      password: 'password123',
      adminCode: 'ADMIN123SECURE'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/admin-register`, adminData);
    console.log('Admin registration response:', response.data);
    
    if (response.data.success) {
      console.log('✅ Admin registration successful');
      return response.data.token;
    } else {
      console.log('❌ Admin registration failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Admin registration error:', error.response?.data?.message || error.message);
  }
};

// Test login after registration
const testLogin = async () => {
  try {
    console.log('\nTesting login...');
    
    const loginData = {
      email: 'test.admin@example.com',
      password: 'password123'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Login error:', error.response?.data?.message || error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting registration tests...\n');
  
  await testStudentRegistration();
  await testAdminRegistration();
  await testLogin();
  
  console.log('\n✨ Tests completed!');
};

// Check if backend is running
const checkBackend = async () => {
  try {
    await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Backend is running');
    return true;
  } catch (error) {
    console.log('❌ Backend is not running. Please start the backend server first.');
    console.log('Run: cd backend && npm start');
    return false;
  }
};

// Main execution
const main = async () => {
  const backendRunning = await checkBackend();
  if (backendRunning) {
    await runTests();
  }
};

main();