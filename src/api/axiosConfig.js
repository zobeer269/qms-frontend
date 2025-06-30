// src/api/axiosConfig.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api' // تأكد من أن هذا المنفذ صحيح
});

// "معترض الطلبات" (Request Interceptor)
apiClient.interceptors.request.use(config => {
  // --- كود التتبع ---
  console.log("Interceptor is running for request to:", config.url);

  const token = localStorage.getItem('authToken');

  if (token) {
    console.log("Token FOUND in localStorage. Adding it to header.");
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token found in localStorage for this request.");
  }
  // --------------------

  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;