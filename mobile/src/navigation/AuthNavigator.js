import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../utils/constants';

// Import auth screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      />
      
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create Account',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      />
      
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      />
      
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: 'New Password',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;