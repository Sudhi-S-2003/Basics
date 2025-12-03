// ==========================================
// client/src/store/authStore.js
// ==========================================
import { create } from 'zustand';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const response = await authAPI.getMe();
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Connect socket
      socketService.connect(token);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    const response = await authAPI.login(credentials);
    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    set({ user, isAuthenticated: true });

    // Connect socket
    socketService.connect(accessToken);

    return user;
  },

  register: async (data) => {
    const response = await authAPI.register(data);
    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    set({ user, isAuthenticated: true });

    // Connect socket
    socketService.connect(accessToken);

    return user;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      await authAPI.logout({ refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    socketService.disconnect();
    
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData },
    }));
  },
}));