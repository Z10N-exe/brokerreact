import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Filter,
  Search,
  Download,
  AlertTriangle,
  DollarSign,
  User,
  Calendar
} from 'lucide-react';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await adminAPI.getWithdrawals();
      setWithdrawals(response.data.withdrawals || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId, adminNote = '') => {
    setActionLoading(true);
    try {
      await adminAPI.approveWithdrawal(withdrawalId, { note: adminNote });
      await fetchWithdrawals();
      setShowModal(false);
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('Failed to approve withdrawal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (withdrawalId, adminNote = '') => {
    setActionLoading(true);
    try {
      await adminAPI.rejectWithdrawal(withdrawalId, { note: adminNote });
      await fetchWithdrawals();
      setShowModal(false);
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert('Failed to reject withdrawal');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.user?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Withdrawal Management</h1>
          <p className="text-slate-300">Manage and approve user withdrawal requests</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-dark p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-dark pl-10 w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-dark"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={fetchWithdrawals}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Withdrawals</p>
              <p className="text-2xl font-bold text-white">{withdrawals.length}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="card-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {withdrawals.filter(w => w.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="card-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-400">
                {withdrawals.filter(w => w.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="card-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(withdrawals.reduce((sum, w) => sum + w.amount, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="card-dark">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Withdrawal Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table-dark w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Method</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {withdrawal.user?.firstName} {withdrawal.user?.lastName}
                        </div>
                        <div className="text-slate-400 text-sm">{withdrawal.user?.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">
                      {formatCurrency(withdrawal.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300 capitalize">
                      {withdrawal.method || 'Bank Transfer'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(withdrawal.status)}`}>
                      {getStatusIcon(withdrawal.status)}
                      <span className="ml-1 capitalize">{withdrawal.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300 text-sm">
                      {formatDate(withdrawal.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setShowModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {withdrawal.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(withdrawal._id)}
                            className="p-2 text-green-400 hover:text-green-300 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(withdrawal._id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Details Modal */}
      {showModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Withdrawal Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-slate-700 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3">User Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-sm">Name</label>
                    <div className="text-white">
                      {selectedWithdrawal.user?.firstName} {selectedWithdrawal.user?.lastName}
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Phone</label>
                    <div className="text-white">{selectedWithdrawal.user?.phone}</div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Country</label>
                    <div className="text-white">{selectedWithdrawal.user?.country}</div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Balance</label>
                    <div className="text-white">{formatCurrency(selectedWithdrawal.user?.balance || 0)}</div>
                  </div>
                </div>
              </div>

              {/* Withdrawal Details */}
              <div className="bg-slate-700 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3">Withdrawal Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedWithdrawal.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Method:</span>
                    <span className="text-white capitalize">{selectedWithdrawal.method || 'Bank Transfer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWithdrawal.status)}`}>
                      {selectedWithdrawal.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white">{formatDate(selectedWithdrawal.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Bank/Crypto Details */}
              {(selectedWithdrawal.bankDetails || selectedWithdrawal.cryptoDetails) && (
                <div className="bg-slate-700 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">
                    {selectedWithdrawal.method === 'crypto' ? 'Crypto Details' : 'Bank Details'}
                  </h4>
                  <div className="space-y-3">
                    {selectedWithdrawal.bankDetails && (
                      <>
                        <div>
                          <label className="text-slate-400 text-sm">Account Name</label>
                          <div className="text-white">{selectedWithdrawal.bankDetails.accountName}</div>
                        </div>
                        <div>
                          <label className="text-slate-400 text-sm">Account Number</label>
                          <div className="text-white">{selectedWithdrawal.bankDetails.accountNumber}</div>
                        </div>
                        <div>
                          <label className="text-slate-400 text-sm">Bank Name</label>
                          <div className="text-white">{selectedWithdrawal.bankDetails.bankName}</div>
                        </div>
                        <div>
                          <label className="text-slate-400 text-sm">Routing Number</label>
                          <div className="text-white">{selectedWithdrawal.bankDetails.routingNumber}</div>
                        </div>
                      </>
                    )}
                    {selectedWithdrawal.cryptoDetails && (
                      <>
                        <div>
                          <label className="text-slate-400 text-sm">Wallet Address</label>
                          <div className="text-white break-all">{selectedWithdrawal.cryptoDetails.walletAddress}</div>
                        </div>
                        <div>
                          <label className="text-slate-400 text-sm">Network</label>
                          <div className="text-white">{selectedWithdrawal.cryptoDetails.network}</div>
                        </div>
                      </>
                    )}
                    {selectedWithdrawal.paypalDetails && (
                      <div>
                        <label className="text-slate-400 text-sm">PayPal Email</label>
                        <div className="text-white">{selectedWithdrawal.paypalDetails.email}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              {selectedWithdrawal.status === 'pending' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApprove(selectedWithdrawal._id)}
                    disabled={actionLoading}
                    className="btn-success flex-1 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedWithdrawal._id)}
                    disabled={actionLoading}
                    className="btn-danger flex-1 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdrawals;
