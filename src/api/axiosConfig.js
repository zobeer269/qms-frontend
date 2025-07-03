// src/api/axiosConfig.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api' // تأكد من أن هذا المنفذ صحيح
});

// "معترض الطلبات" (Request Interceptor)
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for handling authentication errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 errors by clearing invalid tokens
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
      // Redirect to login if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;