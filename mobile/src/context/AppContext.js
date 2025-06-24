import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { noticeAPI, dashboardAPI } from '../services/api';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  // Dashboard data
  dashboardData: null,
  
  // Notices
  notices: [],
  unreadNoticesCount: 0,
  
  // App settings
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  
  // UI state
  isRefreshing: false,
  networkStatus: 'online',
  
  // Loading states
  loading: {
    dashboard: false,
    notices: false,
    payments: false,
    complaints: false,
  },
  
  // Error states
  errors: {
    dashboard: null,
    notices: null,
    payments: null,
    complaints: null,
  },
};

// Action types
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_NOTICES: 'SET_NOTICES',
  SET_UNREAD_NOTICES_COUNT: 'SET_UNREAD_NOTICES_COUNT',
  ADD_NOTICE: 'ADD_NOTICE',
  MARK_NOTICE_READ: 'MARK_NOTICE_READ',
  UPDATE_NOTIFICATION_SETTINGS: 'UPDATE_NOTIFICATION_SETTINGS',
  SET_REFRESHING: 'SET_REFRESHING',
  SET_NETWORK_STATUS: 'SET_NETWORK_STATUS',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value,
        },
        loading: {
          ...state.loading,
          [action.payload.key]: false,
        },
      };
    
    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: null,
        },
      };
    
    case APP_ACTIONS.SET_DASHBOARD_DATA:
      return {
        ...state,
        dashboardData: action.payload,
        loading: {
          ...state.loading,
          dashboard: false,
        },
        errors: {
          ...state.errors,
          dashboard: null,
        },
      };
    
    case APP_ACTIONS.SET_NOTICES:
      return {
        ...state,
        notices: action.payload,
        loading: {
          ...state.loading,
          notices: false,
        },
        errors: {
          ...state.errors,
          notices: null,
        },
      };
    
    case APP_ACTIONS.SET_UNREAD_NOTICES_COUNT:
      return {
        ...state,
        unreadNoticesCount: action.payload,
      };
    
    case APP_ACTIONS.ADD_NOTICE:
      return {
        ...state,
        notices: [action.payload, ...state.notices],
        unreadNoticesCount: state.unreadNoticesCount + 1,
      };
    
    case APP_ACTIONS.MARK_NOTICE_READ:
      return {
        ...state,
        notices: state.notices.map(notice =>
          notice._id === action.payload
            ? { ...notice, isRead: true }
            : notice
        ),
        unreadNoticesCount: Math.max(0, state.unreadNoticesCount - 1),
      };
    
    case APP_ACTIONS.UPDATE_NOTIFICATION_SETTINGS:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...action.payload,
        },
      };
    
    case APP_ACTIONS.SET_REFRESHING:
      return {
        ...state,
        isRefreshing: action.payload,
      };
    
    case APP_ACTIONS.SET_NETWORK_STATUS:
      return {
        ...state,
        networkStatus: action.payload,
      };
    
    case APP_ACTIONS.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// App provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isAuthenticated, user, isStudent, isAdmin } = useAuth();

  // Load initial data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadInitialData();
    } else {
      // Reset state when user logs out
      dispatch({ type: APP_ACTIONS.RESET_STATE });
    }
  }, [isAuthenticated, user]);

  const loadInitialData = async () => {
    await Promise.all([
      loadDashboardData(),
      loadNotices(),
      loadUnreadNoticesCount(),
    ]);
  };

  const setLoading = (key, value) => {
    dispatch({
      type: APP_ACTIONS.SET_LOADING,
      payload: { key, value },
    });
  };

  const setError = (key, value) => {
    dispatch({
      type: APP_ACTIONS.SET_ERROR,
      payload: { key, value },
    });
  };

  const clearError = (key) => {
    dispatch({
      type: APP_ACTIONS.CLEAR_ERROR,
      payload: key,
    });
  };

  // Dashboard functions
  const loadDashboardData = async () => {
    try {
      setLoading('dashboard', true);
      clearError('dashboard');

      const response = isStudent() 
        ? await dashboardAPI.getStudentDashboard()
        : await dashboardAPI.getAdminDashboard();

      if (response.data.success) {
        dispatch({
          type: APP_ACTIONS.SET_DASHBOARD_DATA,
          payload: response.data.data,
        });
      } else {
        setError('dashboard', response.data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      setError('dashboard', error.response?.data?.message || 'Network error');
    }
  };

  // Notice functions
  const loadNotices = async () => {
    try {
      setLoading('notices', true);
      clearError('notices');

      const response = await noticeAPI.getAllNotices();
      if (response.data.success) {
        dispatch({
          type: APP_ACTIONS.SET_NOTICES,
          payload: Array.isArray(response.data.notices) ? response.data.notices : [],
        });
      } else {
        setError('notices', response.data.message || 'Failed to load notices');
      }
    } catch (error) {
      setError('notices', error.response?.data?.message || 'Network error');
    }
  };

  const loadUnreadNoticesCount = async () => {
    try {
      const response = await noticeAPI.getUnreadCount();
      if (response.data.success) {
        dispatch({
          type: APP_ACTIONS.SET_UNREAD_NOTICES_COUNT,
          payload: response.data.count,
        });
      }
    } catch (error) {
      // console.error('Error loading unread notices count:', error);
    }
  };

  const markNoticeAsRead = async (noticeId) => {
    try {
      await noticeAPI.markAsRead(noticeId);
      // Update unread count
      loadUnreadNoticesCount();
    } catch (error) {
      // console.error('Error marking notice as read:', error);
    }
  };

  const addNewNotice = (notice) => {
    dispatch({
      type: APP_ACTIONS.ADD_NOTICE,
      payload: notice,
    });
  };

  // Refresh functions
  const refreshData = async () => {
    dispatch({ type: APP_ACTIONS.SET_REFRESHING, payload: true });
    await loadInitialData();
    dispatch({ type: APP_ACTIONS.SET_REFRESHING, payload: false });
  };

  // Notification settings
  const updateNotificationSettings = (settings) => {
    dispatch({
      type: APP_ACTIONS.UPDATE_NOTIFICATION_SETTINGS,
      payload: settings,
    });
    // TODO: Save to AsyncStorage
  };

  // Network status
  const setNetworkStatus = (status) => {
    dispatch({
      type: APP_ACTIONS.SET_NETWORK_STATUS,
      payload: status,
    });
  };

  const value = {
    ...state,
    // Data loading functions
    loadDashboardData,
    loadNotices,
    loadUnreadNoticesCount,
    refreshData,
    
    // Notice functions
    markNoticeAsRead,
    addNewNotice,
    
    // Settings
    updateNotificationSettings,
    
    // Utility functions
    setLoading,
    setError,
    clearError,
    setNetworkStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;