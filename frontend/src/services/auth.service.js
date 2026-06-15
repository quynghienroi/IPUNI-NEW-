import api from './api';

export const authService = {
  login: (identifier, password) => api.post('/auth/login', { identifier, password }),
  googleMock: (email) => api.post('/auth/google-mock', { email }),
  register: (cccd, phone, password, confirmPassword) => api.post('/auth/register', { cccd, phone, password, confirmPassword }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.put('/users/profile', data),
};
