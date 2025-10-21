import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
};

export const userAPI = {
  getMe: () => api.get('/api/user/me'),
  createDeposit: (amount) => api.post('/api/user/deposit', { amount }),
  withdraw: (data) => api.post('/api/withdrawals', data),
  getTransactions: () => api.get('/api/user/transactions'),
};

export const walletAPI = {
  getWalletAddresses: () => api.get('/api/wallets'),
};

export const depositAPI = {
  createDeposit: (data) => api.post('/api/deposits', data),
  getMyDeposits: () => api.get('/api/deposits/my'),
};

export const withdrawalAPI = {
  createWithdrawal: (amount) => api.post('/api/withdrawals', { amount }),
  getMyWithdrawals: () => api.get('/api/withdrawals/my'),
};

export default api;
