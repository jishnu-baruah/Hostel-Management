import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER_TOKEN, STORAGE_KEYS.USER_DATA]);
      // Navigate to login screen (will be handled by auth context)
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  adminRegister: (adminData) => api.post('/auth/admin-register', adminData),
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Student API calls
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (profileData) => api.put('/students/profile', profileData),
  uploadDocuments: (formData) => api.post('/students/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllStudents: () => api.get('/students'),
  approveStudent: (studentId) => api.put(`/students/${studentId}/approve`),
  rejectStudent: (studentId, reason) => api.put(`/students/${studentId}/reject`, { reason }),
  deleteStudent: (studentId) => api.delete(`/students/${studentId}`),
};

// Room API calls
export const roomAPI = {
  getAllRooms: () => api.get('/rooms'),
  getAvailableRooms: () => api.get('/rooms/available'),
  getRoomDetails: (roomId) => api.get(`/rooms/${roomId}`),
  assignRoom: (studentId, roomId) => api.put(`/rooms/${roomId}/assign`, { studentId }),
  removeStudentFromRoom: (studentId, roomId) => api.put(`/rooms/${roomId}/remove`, { studentId }),
  updateRoom: (roomId, roomData) => api.put(`/rooms/${roomId}`, roomData),
  createRoom: (roomData) => api.post('/rooms', roomData),
  deleteRoom: (roomId) => api.delete(`/rooms/${roomId}`),
  changeRoomStatus: (roomId, status) => api.put(`/rooms/${roomId}/status`, { status }),
};

// Payment API calls
export const paymentAPI = {
  getStudentPayments: (studentId) => api.get(`/payments/student/${studentId}`),
  getAllPayments: () => api.get('/payments'),
  createPaymentOrder: (paymentData) => api.post('/payments/create', paymentData),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
  getPaymentReceipt: (paymentId) => api.get(`/payments/receipt/${paymentId}`),
  updatePaymentStatus: (paymentId, status) => api.put(`/payments/${paymentId}/status`, { status }),
  generateMonthlyBills: () => api.post('/payments/generate-bills'),
};

// Notice API calls
export const noticeAPI = {
  getAllNotices: () => api.get('/notices'),
  getNoticeById: (noticeId) => api.get(`/notices/${noticeId}`),
  createNotice: (noticeData) => api.post('/notices', noticeData),
  updateNotice: (noticeId, noticeData) => api.put(`/notices/${noticeId}`, noticeData),
  deleteNotice: (noticeId) => api.delete(`/notices/${noticeId}`),
  markAsRead: (noticeId) => api.put(`/notices/${noticeId}/read`),
  getUnreadCount: () => api.get('/notices/unread-count'),
};

// Complaint API calls
export const complaintAPI = {
  getAllComplaints: () => api.get('/complaints'),
  getStudentComplaints: (studentId) => api.get(`/complaints/student/${studentId}`),
  getComplaintById: (complaintId) => api.get(`/complaints/${complaintId}`),
  createComplaint: (complaintData) => api.post('/complaints', complaintData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateComplaintStatus: (complaintId, status, resolution) => 
    api.put(`/complaints/${complaintId}/status`, { status, resolution }),
  rateComplaint: (complaintId, rating, feedback) => 
    api.post(`/complaints/${complaintId}/rating`, { rating, feedback }),
  assignComplaint: (complaintId, assignedTo) => 
    api.put(`/complaints/${complaintId}/assign`, { assignedTo }),
};

// File upload utility
export const uploadFile = async (uri, type = 'image') => {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: `${type}_${Date.now()}.jpg`,
  });
  
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Dashboard API calls
export const dashboardAPI = {
  getStudentDashboard: () => api.get('/dashboard/student'),
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getOccupancyStats: () => api.get('/dashboard/occupancy'),
  getPaymentStats: () => api.get('/dashboard/payments'),
  getComplaintStats: () => api.get('/dashboard/complaints'),
};

// Export the main api instance for custom calls
export default api;