import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

// Import navigators
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import AdminNavigator from './AdminNavigator';

// Import screens
import LoadingScreen from '../screens/LoadingScreen';
import ApprovalPendingScreen from '../screens/ApprovalPendingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoading, isAuthenticated, isStudent, isAdmin, isApproved } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          // User is not authenticated - show auth screens
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : isStudent() && !isApproved() ? (
          // Student is authenticated but not approved
          <Stack.Screen
            name="ApprovalPending"
            component={ApprovalPendingScreen}
            options={{ 
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        ) : isStudent() ? (
          // Approved student - show student screens
          <Stack.Screen
            name="Student"
            component={StudentNavigator}
            options={{ headerShown: false }}
          />
        ) : isAdmin() ? (
          // Admin user - show admin screens
          <Stack.Screen
            name="Admin"
            component={AdminNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          // Fallback - should not happen
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;