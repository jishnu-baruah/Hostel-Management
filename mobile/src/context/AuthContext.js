import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';

// Initial state
const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOADING: 'LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true });
      
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        // Verify token with backend
        try {
          const response = await authAPI.verifyToken();
          if (response.data.success) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                token,
                user: JSON.parse(userData),
              },
            });
          } else {
            // Token invalid, clear storage
            await clearAuthData();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } catch (error) {
          // Token verification failed
          await clearAuthData();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: false });
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const login = async (credentials, isAdmin = false) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = isAdmin 
        ? await authAPI.adminLogin(credentials)
        : await authAPI.login(credentials);

      if (response.data.success) {
        const { token, user } = response.data;

        // Store in AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { token, user },
        });

        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: response.data.message || 'Login failed',
        });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.register(userData);

      if (response.data.success) {
        // Registration successful, but user needs approval
        dispatch({ type: AUTH_ACTIONS.LOADING, payload: false });
        return {
          success: true,
          message: 'Registration successful! Please wait for admin approval.',
          needsApproval: true
        };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: response.data.message || 'Registration failed',
        });
        return {
          success: false,
          message: response.data.message,
          errors: response.data.errors
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors
      };
    }
  };

  const adminRegister = async (adminData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.adminRegister(adminData);

      if (response.data.success) {
        const { token, user } = response.data;

        // Store in AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { token, user },
        });

        return {
          success: true,
          message: 'Admin registration successful! You are now logged in.',
          autoLogin: true
        };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: response.data.message || 'Admin registration failed',
        });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      if (response.data.success) {
        const updatedUser = response.data.user;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed';
      return { success: false, message: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Helper functions
  const isStudent = () => state.user?.role === USER_ROLES.STUDENT;
  const isAdmin = () => state.user?.role === USER_ROLES.ADMIN;
  const isApproved = () => state.user?.isApproved === true;

  const value = {
    ...state,
    login,
    register,
    adminRegister,
    logout,
    updateUser,
    clearError,
    isStudent,
    isAdmin,
    isApproved,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;