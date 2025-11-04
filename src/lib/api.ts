import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: (token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return api.get('/auth/profile', { headers });
  },
  changePassword: (data: any) => api.patch('/auth/change-password', data),
};

// API functions for Customers
export const customersApi = {
  getAll: () => api.get('/customers'),
  getOne: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.patch(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  search: (term: string) => api.get(`/customers?search=${term}`),
  addLoyaltyPoints: (id: string, points: number) =>
    api.post(`/customers/${id}/loyalty-points`, { points }),
};

// API functions for Visits
export const visitsApi = {
  getAll: () => api.get('/visits'),
  getCurrent: () => api.get('/visits/current'),
  getOne: (id: string) => api.get(`/visits/${id}`),
  create: (data: any) => api.post('/visits', data),
  update: (id: string, data: any) => api.patch(`/visits/${id}`, data),
  delete: (id: string) => api.delete(`/visits/${id}`),
};

// API functions for Service Requests
export const serviceRequestsApi = {
  getAll: () => api.get('/service-requests'),
  getPending: () => api.get('/service-requests?status=PENDING'),
  getOne: (id: string) => api.get(`/service-requests/${id}`),
  create: (data: any) => api.post('/service-requests', data),
  update: (id: string, data: any) => api.patch(`/service-requests/${id}`, data),
  delete: (id: string) => api.delete(`/service-requests/${id}`),
};

// API functions for Feedback
export const feedbackApi = {
  getAll: () => api.get('/feedback'),
  getUnreviewed: () => api.get('/feedback?unreviewed=true'),
  getStats: () => api.get('/feedback/stats'),
  getOne: (id: string) => api.get(`/feedback/${id}`),
  create: (data: any) => api.post('/feedback', data),
  update: (id: string, data: any) => api.patch(`/feedback/${id}`, data),
  delete: (id: string) => api.delete(`/feedback/${id}`),
};

// API functions for Assets
export const assetsApi = {
  getAll: () => api.get('/assets'),
  getMaintenanceDue: () => api.get('/assets?maintenanceDue=true'),
  getStats: () => api.get('/assets/stats'),
  getOne: (id: string) => api.get(`/assets/${id}`),
  create: (data: any) => api.post('/assets', data),
  update: (id: string, data: any) => api.patch(`/assets/${id}`, data),
  delete: (id: string) => api.delete(`/assets/${id}`),
};

// API functions for Maintenance
export const maintenanceApi = {
  getAll: () => api.get('/maintenance'),
  getUpcoming: () => api.get('/maintenance/upcoming'),
  getOverdue: () => api.get('/maintenance/overdue'),
  getStats: () => api.get('/maintenance/stats'),
  predictCosts: (months: number = 6) => api.get(`/maintenance/predict-costs?months=${months}`),
  getOne: (id: string) => api.get(`/maintenance/${id}`),
  create: (data: any) => api.post('/maintenance', data),
  update: (id: string, data: any) => api.patch(`/maintenance/${id}`, data),
  delete: (id: string) => api.delete(`/maintenance/${id}`),
};

// API functions for Docks
export const docksApi = {
  getAll: (status?: string, size?: string) => {
    let url = '/docks';
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (size) params.append('size', size);
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },
  getAvailable: () => api.get('/docks?available=true'),
  getStats: () => api.get('/docks/stats'),
  getOne: (id: string) => api.get(`/docks/${id}`),
  create: (data: any) => api.post('/docks', data),
  update: (id: string, data: any) => api.patch(`/docks/${id}`, data),
  delete: (id: string) => api.delete(`/docks/${id}`),
};

// API functions for File Upload
export const uploadApi = {
  uploadSingle: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// API functions for Analytics
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRevenue: (startDate?: string, endDate?: string) => {
    let url = '/analytics/revenue';
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },
  getCustomerInsights: () => api.get('/analytics/customers'),
  getServiceAnalytics: () => api.get('/analytics/services'),
  getMaintenanceAnalytics: (months: number = 12) =>
    api.get(`/analytics/maintenance?months=${months}`),
  getOccupancy: () => api.get('/analytics/occupancy'),
};
