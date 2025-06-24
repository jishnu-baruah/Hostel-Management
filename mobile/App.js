import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

// Disable all warnings and errors
LogBox.ignoreAllLogs();

// Disable console warnings and errors
if (__DEV__) {
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  
  console.warn = () => {};
  console.error = () => {};
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
