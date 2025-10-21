import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'secret-admin-key-123';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-admin-key': ADMIN_KEY,
  },
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Admin access denied. Check your admin key.');
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Users
  getAllUsers: () => api.get('/api/admin/users'),
  getUserById: (id) => api.get(`/api/admin/user/${id}`),
  adjustBalance: (id, data) => api.post(`/api/admin/user/${id}/adjust-balance`, data),
  addProfit: (id, data) => api.post(`/api/admin/user/${id}/add-profit`, data),
  impersonateUser: (id) => api.post(`/api/admin/impersonate/${id}`),

  // Transactions
  getPendingTransactions: () => api.get('/api/admin/transactions/pending'),
  approveWithdrawal: (id, data) => api.post(`/api/admin/withdraw/${id}/approve`, data),
  rejectWithdrawal: (id, data) => api.post(`/api/admin/withdraw/${id}/reject`, data),
  approveDeposit: (id, data) => api.post(`/api/admin/deposit/${id}/approve`, data),
  rejectDeposit: (id, data) => api.post(`/api/admin/deposit/${id}/reject`, data),

  // Deposits
  getAllDeposits: () => api.get('/api/deposits/all'),
  approveCryptoDeposit: (id, data) => api.post(`/api/deposits/${id}/approve`, data),
  rejectCryptoDeposit: (id, data) => api.post(`/api/deposits/${id}/reject`, data),

  // Withdrawals
  getAllWithdrawals: () => api.get('/api/withdrawals/all'),
  approveCryptoWithdrawal: (id, data) => api.post(`/api/withdrawals/${id}/approve`, data),
  rejectCryptoWithdrawal: (id, data) => api.post(`/api/withdrawals/${id}/reject`, data),

  // Wallets
  getWalletAddresses: () => api.get('/api/wallets'),
  updateWalletAddress: (data) => api.post('/api/wallets/update', data),

  // Audit logs
  getAuditLogs: () => api.get('/api/admin/logs'),
};

export default api;
