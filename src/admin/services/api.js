import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify'),
};

// ─── Blogs ─────────────────────────────────────────────────
export const blogAPI = {
  // Public
  getPublished: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  // Admin
  getAll: (params) => api.get('/blogs/admin/list', { params }),
  getById: (id) => api.get(`/blogs/admin/detail/${id}`),
  create: (data) => api.post('/blogs/admin/create', data),
  update: (id, data) => api.put(`/blogs/admin/update/${id}`, data),
  delete: (id) => api.delete(`/blogs/admin/delete/${id}`),
  upload: (formData) => api.post('/blogs/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getStats: () => api.get('/blogs/admin/stats'),
};

// ─── Forms ─────────────────────────────────────────────────
export const formAPI = {
  // Public submissions
  submitVisitor: (data) => api.post('/forms/visitor', data),
  submitStallBooking: (data) => api.post('/forms/stall-booking', data),
  submitContact: (data) => api.post('/forms/contact', data),
  // Admin
  getAll: (params) => api.get('/forms/admin/list', { params }),
  getStats: () => api.get('/forms/admin/stats'),
  updateStatus: (type, id, status) => api.put(`/forms/admin/status/${type}/${id}`, { status }),
  exportCSV: (type) => `${BASE_URL}/forms/admin/export${type ? `?type=${type}` : ''}`,
};

export default api;
