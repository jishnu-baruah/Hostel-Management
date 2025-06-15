# Registration System Implementation Guide

## Overview

This document outlines the complete registration system implementation for the Hostel Management App, including both student and admin registration workflows.

## Features Implemented

### ✅ Student Registration
- **Multi-step registration form** with 4 steps:
  1. Basic Information (name, email, phone, password)
  2. Academic Information (college, course, year)
  3. Emergency Contact (name, phone, relation)
  4. Address Information (street, city, state, pincode)
- **Document upload** functionality (ID proof, college ID) - optional
- **Form validation** with real-time error feedback
- **Approval workflow** - students need admin approval before accessing the app
- **Responsive design** following the app's design system

### ✅ Admin Registration
- **Simplified 2-step process**:
  1. Basic Information (name, email, phone, password)
  2. Admin Code Verification (ADMIN123SECURE)
- **Auto-approval** - admins are immediately logged in after registration
- **Secure admin code** validation

## File Structure

```
mobile/src/
├── screens/auth/
│   └── RegisterScreen.js          # Main registration screen
├── services/
│   └── api.js                     # API service with registration endpoints
├── context/
│   └── AuthContext.js             # Authentication context with registration methods
├── navigation/
│   └── AppNavigator.js            # Navigation flow handling approval states
└── screens/
    └── ApprovalPendingScreen.js   # Screen shown to students awaiting approval
```

## API Endpoints

### Student Registration
- **Endpoint**: `POST /api/auth/register`
- **Payload**:
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "9876543210",
  "password": "password123",
  "college": "College Name",
  "course": "B.Tech Computer Science",
  "year": "2nd Year",
  "emergencyContact": {
    "name": "Parent Name",
    "phone": "9876543211",
    "relation": "Father"
  },
  "address": {
    "street": "123 Street",
    "city": "City",
    "state": "State",
    "pincode": "123456"
  }
}
```

### Admin Registration
- **Endpoint**: `POST /api/auth/admin-register`
- **Payload**:
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "phone": "9876543210",
  "password": "password123",
  "adminCode": "ADMIN123SECURE"
}
```

## Validation Rules

### Email Validation
- Must be a valid email format
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Phone Validation
- Must be a 10-digit Indian phone number
- Regex: `/^[6-9]\d{9}$/`

### Password Validation
- Minimum 6 characters
- Must match confirmation password

### Pincode Validation
- Must be exactly 6 digits
- Regex: `/^\d{6}$/`

## User Flow

### Student Registration Flow
1. User selects "Student" registration type
2. Fills out basic information (step 1)
3. Provides academic details (step 2)
4. Enters emergency contact (step 3)
5. Completes address information (step 4)
6. Optionally uploads documents
7. Submits registration
8. Receives success message about pending approval
9. Redirected to login screen

### Admin Registration Flow
1. User selects "Admin" registration type
2. Fills out basic information (step 1)
3. Enters admin verification code (step 2)
4. Submits registration
5. Automatically logged in upon successful registration
6. Redirected to admin dashboard

## Navigation States

The app handles different user states through the navigation system:

- **Not Authenticated**: Shows auth screens (login/register)
- **Student - Not Approved**: Shows approval pending screen
- **Student - Approved**: Shows student dashboard and features
- **Admin**: Shows admin dashboard and management features

## Error Handling

### Registration Errors
- **Validation errors**: Real-time field validation with error messages
- **Network errors**: User-friendly error messages for connection issues
- **Server errors**: Displays backend error messages (duplicate email, invalid admin code, etc.)

### Common Error Scenarios
- Email already registered
- Phone number already registered
- Invalid admin code
- Network connectivity issues
- Server unavailable

## Testing

### Manual Testing
1. Start the backend server: `cd backend && npm start`
2. Start the mobile app: `cd mobile && npm start`
3. Test both student and admin registration flows
4. Verify validation rules work correctly
5. Test error scenarios (duplicate email, invalid admin code)

### Automated Testing
Run the test script to verify backend integration:
```bash
cd mobile
node test-registration.js
```

## Dependencies Added

### Mobile App Dependencies
- `expo-document-picker`: For document upload functionality
- `expo-image-picker`: Already available for image selection

### Backend Dependencies
All required dependencies are already installed.

## Configuration

### Admin Registration Code
The admin registration code is configured in the backend `.env` file:
```
ADMIN_REGISTRATION_CODE=ADMIN123SECURE
```

### API Base URL
Configure the API base URL in `mobile/src/utils/constants.js`:
```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';
```

## Security Considerations

1. **Admin Code**: The admin registration code should be changed in production
2. **Password Security**: Passwords are hashed using bcrypt in the backend
3. **Input Validation**: All inputs are validated both client-side and server-side
4. **Token Security**: JWT tokens are used for authentication

## Future Enhancements

### Potential Improvements
1. **Email Verification**: Add email verification step for registration
2. **OTP Verification**: Add phone number verification via OTP
3. **Document Validation**: Implement document verification workflow
4. **Bulk Registration**: Allow admins to register multiple students via CSV upload
5. **Registration Analytics**: Track registration completion rates and drop-off points

### Room Assignment Integration
The registration system is designed to integrate with the room assignment workflow:
1. Students complete registration and get approved
2. Admins can assign rooms to approved students
3. Students can view their assigned room in the dashboard

## Troubleshooting

### Common Issues

#### Registration Form Not Submitting
- Check network connectivity
- Verify backend server is running
- Check browser/app console for JavaScript errors

#### Validation Errors Not Showing
- Ensure all validation rules are properly imported
- Check that error state is being updated correctly

#### Admin Registration Failing
- Verify admin code is correct (ADMIN123SECURE)
- Check backend logs for detailed error messages

#### Navigation Issues After Registration
- Ensure AuthContext is properly updating user state
- Check that navigation conditions in AppNavigator are correct

### Debug Steps
1. Check backend server logs
2. Inspect network requests in browser/app dev tools
3. Verify API endpoints are responding correctly
4. Check AsyncStorage for token persistence issues

## Support

For issues or questions about the registration system:
1. Check the backend logs for detailed error messages
2. Use the test script to verify backend connectivity
3. Review the validation rules and error handling logic
4. Ensure all required dependencies are installed

## Conclusion

The registration system provides a complete, user-friendly workflow for both students and admins to create accounts in the Hostel Management App. The implementation follows best practices for form validation, error handling, and user experience design.