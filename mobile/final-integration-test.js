// Final comprehensive integration test for mobile app
// This script validates the complete mobile app setup and provides testing guidance

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:5000/api';

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

// Check if file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};

// Read package.json
const readPackageJson = () => {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    return JSON.parse(packageContent);
  } catch (error) {
    return null;
  }
};

// Check mobile app structure
const checkMobileAppStructure = () => {
  log('cyan', '\n📱 Checking Mobile App Structure...');
  
  const requiredFiles = [
    'package.json',
    'App.js',
    'app.json',
    'src/services/api.js',
    'src/context/AuthContext.js',
    'src/screens/auth/RegisterScreen.js',
    'src/screens/auth/LoginScreen.js',
    'src/utils/constants.js',
    'src/components/common/Input.js',
    'src/components/common/Button.js'
  ];
  
  const requiredDirectories = [
    'src',
    'src/screens',
    'src/screens/auth',
    'src/screens/student',
    'src/screens/admin',
    'src/components',
    'src/components/common',
    'src/services',
    'src/context',
    'src/navigation',
    'src/utils'
  ];
  
  let allFilesExist = true;
  let allDirsExist = true;
  
  // Check files
  log('blue', '\n  📄 Checking Required Files:');
  requiredFiles.forEach(file => {
    const exists = fileExists(path.join(__dirname, file));
    log(exists ? 'green' : 'red', `    ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
  });
  
  // Check directories
  log('blue', '\n  📁 Checking Required Directories:');
  requiredDirectories.forEach(dir => {
    const exists = fileExists(path.join(__dirname, dir));
    log(exists ? 'green' : 'red', `    ${exists ? '✅' : '❌'} ${dir}/`);
    if (!exists) allDirsExist = false;
  });
  
  return allFilesExist && allDirsExist;
};

// Check dependencies
const checkDependencies = () => {
  log('cyan', '\n📦 Checking Dependencies...');
  
  const packageJson = readPackageJson();
  if (!packageJson) {
    log('red', '  ❌ Could not read package.json');
    return false;
  }
  
  const requiredDeps = {
    'expo': '~53.0.9',
    'react': '19.0.0',
    'react-native': '0.79.2',
    '@react-navigation/native': '^7.1.9',
    '@react-navigation/stack': '^7.3.2',
    '@react-navigation/bottom-tabs': '^7.3.13',
    'axios': '^1.9.0',
    '@react-native-async-storage/async-storage': '^2.1.2',
    'expo-document-picker': '^12.0.2',
    'expo-image-picker': '^16.1.4',
    'formik': '^2.4.6',
    'yup': '^1.6.1',
    'react-native-elements': '^3.4.3',
    'react-native-vector-icons': '^10.2.0'
  };
  
  const deps = packageJson.dependencies || {};
  let allDepsPresent = true;
  
  Object.entries(requiredDeps).forEach(([dep, version]) => {
    const installed = deps[dep];
    const present = !!installed;
    log(present ? 'green' : 'red', `  ${present ? '✅' : '❌'} ${dep}: ${installed || 'NOT INSTALLED'}`);
    if (!present) allDepsPresent = false;
  });
  
  return allDepsPresent;
};

// Test backend connectivity
const testBackendConnectivity = async () => {
  log('cyan', '\n🔗 Testing Backend Connectivity...');
  
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    if (response.data.status === 'OK') {
      log('green', '  ✅ Backend is running and accessible');
      log('blue', `  📊 Server uptime: ${Math.floor(response.data.uptime)} seconds`);
      return true;
    } else {
      log('red', '  ❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    log('red', '  ❌ Cannot connect to backend');
    log('yellow', '  ⚠️  Make sure backend is running: cd backend && npm start');
    return false;
  }
};

// Test registration endpoints
const testRegistrationEndpoints = async () => {
  log('cyan', '\n🔐 Testing Registration Endpoints...');
  
  const timestamp = Date.now();
  const testData = {
    student: {
      name: 'Final Test Student',
      email: `final.student.${timestamp}@example.com`,
      phone: `98765${String(timestamp).slice(-5)}`,
      password: 'Password123',
      college: 'Final Test College',
      course: 'B.Tech Computer Science',
      year: 2,
      emergencyContact: {
        name: 'Test Parent',
        phone: `98765${String(timestamp + 1).slice(-5)}`,
        relation: 'Father'
      },
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      }
    },
    admin: {
      name: 'Final Test Admin',
      email: `final.admin.${timestamp}@example.com`,
      phone: `98765${String(timestamp + 2).slice(-5)}`,
      password: 'Password123!',
      adminCode: 'ADMIN123SECURE'
    }
  };
  
  let allEndpointsWorking = true;
  
  // Test student registration
  try {
    const studentResponse = await axios.post(`${API_BASE_URL}/auth/register`, testData.student);
    if (studentResponse.data.success) {
      log('green', '  ✅ Student registration endpoint working');
    } else {
      log('red', '  ❌ Student registration failed');
      allEndpointsWorking = false;
    }
  } catch (error) {
    log('red', '  ❌ Student registration endpoint error');
    allEndpointsWorking = false;
  }
  
  // Test admin registration
  try {
    const adminResponse = await axios.post(`${API_BASE_URL}/auth/admin-register`, testData.admin);
    if (adminResponse.data.success) {
      log('green', '  ✅ Admin registration endpoint working');
      
      // Test token verification if admin registration provided token
      if (adminResponse.data.token) {
        try {
          const verifyResponse = await axios.get(`${API_BASE_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${adminResponse.data.token}` }
          });
          if (verifyResponse.data.success) {
            log('green', '  ✅ Token verification working');
          } else {
            log('red', '  ❌ Token verification failed');
            allEndpointsWorking = false;
          }
        } catch (error) {
          log('red', '  ❌ Token verification error');
          allEndpointsWorking = false;
        }
      }
    } else {
      log('red', '  ❌ Admin registration failed');
      allEndpointsWorking = false;
    }
  } catch (error) {
    log('red', '  ❌ Admin registration endpoint error');
    allEndpointsWorking = false;
  }
  
  return allEndpointsWorking;
};

// Generate mobile app startup guide
const generateStartupGuide = () => {
  log('cyan', '\n📋 Mobile App Startup Guide:');
  log('blue', '\n  🚀 To start the mobile app:');
  log('reset', '    1. Make sure you\'re in the mobile directory');
  log('reset', '    2. Run: npx expo start');
  log('reset', '    3. Choose your platform:');
  log('reset', '       - Press \'a\' for Android emulator');
  log('reset', '       - Press \'i\' for iOS simulator');
  log('reset', '       - Press \'w\' for web browser');
  log('reset', '       - Scan QR code with Expo Go app on physical device');
  
  log('blue', '\n  📱 Testing Registration Flow:');
  log('reset', '    1. Navigate to "Create Account" from welcome screen');
  log('reset', '    2. Select "Student" or "Admin" registration type');
  log('reset', '    3. Fill out the multi-step form');
  log('reset', '    4. For admin registration, use code: ADMIN123SECURE');
  log('reset', '    5. Verify successful registration and navigation');
  
  log('blue', '\n  🔍 What to Test:');
  log('reset', '    ✓ Form validation (try invalid emails, short passwords)');
  log('reset', '    ✓ Navigation between form steps');
  log('reset', '    ✓ Document upload functionality (optional)');
  log('reset', '    ✓ Registration success messages');
  log('reset', '    ✓ Admin auto-login after registration');
  log('reset', '    ✓ Student approval pending screen');
  log('reset', '    ✓ Login functionality with registered users');
};

// Main test execution
const runFinalTests = async () => {
  log('bold', '🎯 FINAL MOBILE APP INTEGRATION TEST');
  log('bold', '=====================================\n');
  
  const results = {
    structure: false,
    dependencies: false,
    backend: false,
    endpoints: false
  };
  
  // Check mobile app structure
  results.structure = checkMobileAppStructure();
  
  // Check dependencies
  results.dependencies = checkDependencies();
  
  // Test backend connectivity
  results.backend = await testBackendConnectivity();
  
  // Test registration endpoints (only if backend is accessible)
  if (results.backend) {
    results.endpoints = await testRegistrationEndpoints();
  }
  
  // Generate startup guide
  generateStartupGuide();
  
  // Final summary
  log('cyan', '\n📊 Final Test Results:');
  log('cyan', '======================');
  
  Object.entries(results).forEach(([test, passed]) => {
    const testName = test.charAt(0).toUpperCase() + test.slice(1);
    log(passed ? 'green' : 'red', `${passed ? '✅' : '❌'} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  log('bold', `\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    log('green', '\n🎉 ALL TESTS PASSED!');
    log('green', '✨ Mobile app is ready for end-to-end testing');
    log('yellow', '\n🚀 Next step: Run "npx expo start" to launch the app');
  } else {
    log('red', '\n⚠️  Some tests failed. Please fix the issues above before proceeding.');
  }
  
  return passedTests === totalTests;
};

// Execute final tests
runFinalTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log('red', `\n❌ Test execution failed: ${error.message}`);
    process.exit(1);
  });