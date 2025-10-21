import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import Modal from '../components/Modal';
import { ArrowLeft, DollarSign, TrendingUp, Clock, User, Phone, MapPin } from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ amount: '', type: 'credit', note: '' });
  const [profitForm, setProfitForm] = useState({ amount: '', note: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await adminAPI.getUserById(id);
      setUser(response.data.user);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage('');

    try {
      await adminAPI.adjustBalance(id, adjustForm);
      setMessage('Balance adjusted successfully');
      setShowAdjustModal(false);
      setAdjustForm({ amount: '', type: 'credit', note: '' });
      fetchUserData();
    } catch (error) {
      setMessage('Failed to adjust balance');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddProfit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage('');

    try {
      await adminAPI.addProfit(id, profitForm);
      setMessage('Profit added successfully');
      setShowProfitModal(false);
      setProfitForm({ amount: '', note: '' });
      fetchUserData();
    } catch (error) {
      setMessage('Failed to add profit');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">User not found</p>
        <Link to="/users" className="btn-primary mt-4">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/users" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">User Details & Management</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAdjustModal(true)}
            className="btn-secondary"
          >
            Adjust Balance
          </button>
          <button
            onClick={() => setShowProfitModal(true)}
            className="btn-success"
          >
            Add Profit
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      {/* User Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-medium">{user.country}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Joined</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Balance</h3>
            <div className="flex items-center mb-4">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.balance)}</p>
                <p className="text-sm text-gray-600">Current Balance</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Profit</h3>
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.profit)}</p>
                <p className="text-sm text-gray-600">Total Profit</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Withdrawals</h3>
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.withdrawalsPending)}</p>
                <p className="text-sm text-gray-600">Pending Amount</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Note
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.adminNote || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Balance Modal */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        title="Adjust User Balance"
      >
        <form onSubmit={handleAdjustBalance} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={adjustForm.amount}
              onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })}
              className="input-field"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={adjustForm.type}
              onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}
              className="input-field"
              required
            >
              <option value="credit">Credit (Add)</option>
              <option value="debit">Debit (Subtract)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              value={adjustForm.note}
              onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Reason for adjustment..."
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={actionLoading}
              className="btn-primary disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Adjust Balance'}
            </button>
            <button
              type="button"
              onClick={() => setShowAdjustModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Profit Modal */}
      <Modal
        isOpen={showProfitModal}
        onClose={() => setShowProfitModal(false)}
        title="Add Profit to User"
      >
        <form onSubmit={handleAddProfit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profit Amount
            </label>
            <input
              type="number"
              value={profitForm.amount}
              onChange={(e) => setProfitForm({ ...profitForm, amount: e.target.value })}
              className="input-field"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              value={profitForm.note}
              onChange={(e) => setProfitForm({ ...profitForm, note: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Reason for profit addition..."
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={actionLoading}
              className="btn-success disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Add Profit'}
            </button>
            <button
              type="button"
              onClick={() => setShowProfitModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserDetail;
