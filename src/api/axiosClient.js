import axios from 'axios';

const axiosClient = axios.create({
  // Thay 5000 bằng cổng server thực tế của bạn (5001 hoặc 8000 nếu bạn đã đổi)
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Lấy token từ lúc đăng nhập
  console.log('Axios Interceptor - Token from localStorage:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Gửi kèm theo chuẩn Bearer
    console.log('Axios Interceptor - Authorization header set');
  } else {
    console.warn('Axios Interceptor - NO TOKEN FOUND in localStorage!');
  }
  return config;
});

export default axiosClient;
