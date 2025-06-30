// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // لتخزين بيانات المستخدم { id, username, ... }
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (token) {
      // إذا وجدنا توكن، نحفظه ونضبطه في هيدر axios
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // ونجلب بيانات المستخدم المرتبطة به
      apiClient.get('/users/me/')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // إذا كان التوكن غير صالح، نحذفه
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken');
          delete apiClient.defaults.headers.common['Authorization'];
        });
    } else {
      // إذا لم نجد توكن، نحذف كل شيء
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]); // هذا الـ Effect يعمل كلما تغير التوكن

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/users/token/', { username, password });
      setToken(response.data.access); // تحديث التوكن سيشغل الـ useEffect أعلاه
    } catch (err) {
      // نرمي الخطأ ليتم التعامل معه في مكون Login
      throw new Error('Invalid username or password.');
    }
  };

  const logout = () => {
    setToken(null); // حذف التوكن سيشغل الـ useEffect ويقوم بتنظيف كل شيء
  };

  // القيمة التي ستكون متاحة لكل التطبيق
  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// "خطاف" مخصص ليسهل استخدام السياق
export const useAuth = () => {
  return useContext(AuthContext);
};