import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// Mind Map API
export const mindMapAPI = {
  getMindMaps: (params = {}) => api.get('/mindmaps', { params }),
  getMindMap: (id) => api.get(`/mindmaps/${id}`),
  createMindMap: (data) => api.post('/mindmaps', data),
  updateMindMap: (id, data) => api.put(`/mindmaps/${id}`, data),
  deleteMindMap: (id) => api.delete(`/mindmaps/${id}`),
  addCollaborator: (id, data) => api.post(`/mindmaps/${id}/collaborators`, data),
  createNode: (data) => api.post('/nodes', data),
  getNode: (id) => api.get(`/nodes/${id}`),
  getNodesByMindMap: (mindMapId) => api.get(`/nodes/mindmap/${mindMapId}`),
  updateNode: (id, data) => api.put(`/nodes/${id}`, data),
  deleteNode: (id) => api.delete(`/nodes/${id}`),
  addConnection: (id, data) => api.post(`/nodes/${id}/connections`, data),
  removeConnection: (id, targetId) => api.delete(`/nodes/${id}/connections/${targetId}`),
};

// Export API instance for custom requests
export default api;