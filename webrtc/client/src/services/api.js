import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: (data) => api.post('/api/auth/logout', data),
  getMe: () => api.get('/api/auth/me'),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
};

// User API
export const userAPI = {
  search: (query, page = 1) => api.get(`/api/users/search?q=${query}&page=${page}`),
  getUser: (userId) => api.get(`/api/users/${userId}`),
  updateProfile: (data) => api.patch('/api/users/profile', data),
};

// Conversation API
export const conversationAPI = {
  getAll: (page = 1) => api.get(`/api/conversations?page=${page}`),
  getById: (id) => api.get(`/api/conversations/${id}`),
  createDirect: (participantId) => api.post('/api/conversations/direct', { participantId }),
  createGroup: (data) => api.post('/api/conversations/group', data),
};

// Message API
export const messageAPI = {
  getMessages: (conversationId, before) => {
    const url = `/api/messages/${conversationId}${before ? `?before=${before}` : ''}`;
    return api.get(url);
  },
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/messages/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
